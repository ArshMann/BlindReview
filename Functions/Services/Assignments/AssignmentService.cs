using Functions.Models;
using Functions.Utils;

namespace Functions.Services.Assignments;

public class AssignmentService(IEnumerable<IAssignmentStrategy> strategies) : IAssignmentService
{
    public async Task<Result<List<ReviewableAssignment>>> CreateAssignmentsForReviewable(
        Reviewable reviewable,
        string ownerUserId)
    {
        var strategy = strategies.FirstOrDefault(s => s.CanHandle(reviewable));
        if (strategy == null)
        {
            return Result<List<ReviewableAssignment>>.Fail("Unsupported reviewable type.");
        }

        var selectionResult = await strategy.SelectReviewersAsync(reviewable, ownerUserId);
        if (!selectionResult.isSuccess)
        {
            return Result<List<ReviewableAssignment>>.Fail(selectionResult.error);
        }

        var reviewerIds = selectionResult.value;
        if (reviewerIds.Count == 0)
        {
            return Result<List<ReviewableAssignment>>.Ok([]);
        }

        var now = DateTime.UtcNow;
        var assignments = reviewerIds
            .Select(reviewerId => new ReviewableAssignment
            {
                reviewerUserId = reviewerId,
                status = "pending",
                assignedAt = now,
                deadline = null,
            })
            .ToList();

        return Result<List<ReviewableAssignment>>.Ok(assignments);
    }
}
