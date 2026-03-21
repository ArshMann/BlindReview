using Functions.Database;
using Functions.Models;
using Functions.Utils;

namespace Functions.AssignmentsService;

public class AssignmentService(
    ICosmos cosmos,
    IEnumerable<IAssignmentStrategy> strategies) : IAssignmentService
{
    private const string DatabaseName = "blind-review";
    private const string AssignmentsContainerName = "assignments";

    public async Task<Result<List<Assignment>>> CreateAssignmentsForReviewable(
        Reviewable reviewable,
        string ownerUserId)
    {
        var strategy = strategies.FirstOrDefault(s => s.CanHandle(reviewable));
        if (strategy == null)
        {
            return Result<List<Assignment>>.Fail("Unsupported reviewable type.");
        }

        var selectionResult = await strategy.SelectReviewersAsync(reviewable, ownerUserId);
        if (!selectionResult.isSuccess)
        {
            return Result<List<Assignment>>.Fail(selectionResult.error);
        }

        var reviewerIds = selectionResult.value;
        if (reviewerIds.Count == 0)
        {
            return Result<List<Assignment>>.Ok([]);
        }

        var assignments = reviewerIds.Select(reviewerId => new Assignment
        {
            reviewableId = reviewable.id ?? string.Empty,
            ownerUserId = ownerUserId,
            reviewerUserId = reviewerId,
            status = "pending",
            assignedAt = DateTime.UtcNow,
        }).ToList();

        var createTasks = assignments.Select(assignment =>
            cosmos.CreateItem(
                DatabaseName,
                AssignmentsContainerName,
                assignment,
                new PartitionKey(assignment.reviewerUserId)));

        var results = await Task.WhenAll(createTasks);

        var failures = results.Where(r => !r.isSuccess).ToList();
        if (failures.Count != 0)
        {
            return Result<List<Assignment>>.Fail(failures.First().error);
        }

        return Result<List<Assignment>>.Ok(assignments);
    }
}