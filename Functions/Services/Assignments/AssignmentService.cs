using Functions.Database;
using Functions.Models;
using Functions.Utils;

namespace Functions.AssignmentsService;

public class AssignmentService(ICosmos cosmos, IAssignmentStrategy strategy)
{
    private const string DatabaseName = "blind-review";
    private const string AssignmentsContainerName = "assignments";

    public async Task<Result<List<Assignment>>> CreateAssignmentsForReviewable(
        Reviewable reviewable,
        string ownerUserId)
    {
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

        var assignments = new List<Assignment>();
        foreach (var reviewerId in reviewerIds)
        {
            var assignment = new Assignment
            {
                reviewableId = reviewable.id ?? string.Empty,
                ownerUserId = ownerUserId,
                reviewerUserId = reviewerId,
                status = "pending",
                assignedAt = DateTime.UtcNow,
            };

            var createResult = await cosmos.CreateItem(
                DatabaseName,
                AssignmentsContainerName,
                assignment,
                new PartitionKey(assignment.reviewerUserId));

            if (!createResult.isSuccess)
            {
                return Result<List<Assignment>>.Fail(createResult.error);
            }

            assignments.Add(assignment);
        }

        return Result<List<Assignment>>.Ok(assignments);
    }
}
