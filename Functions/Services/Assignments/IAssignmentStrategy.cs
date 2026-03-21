using Functions.Models;
using Functions.Utils;

namespace Functions.AssignmentsService;

public interface IAssignmentStrategy
{
    Task<Result<IReadOnlyList<string>>> SelectReviewersAsync(
    Reviewable reviewable,
    string ownerUserId);
}
