using Functions.Models;
using Functions.Utils;

namespace Functions.Services.Assignments;

public interface IAssignmentStrategy
{
    bool CanHandle(Reviewable reviewable);
    Task<Result<IReadOnlyList<string>>> SelectReviewersAsync(
        Reviewable reviewable,
        string ownerUserId);
}