using Functions.Database;
using Functions.Models;
using Functions.Utils;

namespace Functions.Services.Assignments;

public class DedicatedReviewerStrategy(ICosmos cosmos) : IAssignmentStrategy
{
    private const string DatabaseName = "blind-review";
    private const string UsersContainerName = "users";

    public bool CanHandle(Reviewable reviewable) => reviewable.type == "Expert";

    public async Task<Result<IReadOnlyList<string>>> SelectReviewersAsync(
        Reviewable reviewable,
        string ownerUserId)
    {
        var usersResult = await cosmos.QueryItemFixed<Models.User>(
            DatabaseName,
            UsersContainerName,
            q => q
                .Where(u => u.id != ownerUserId)
                .Where(u => u.role == "Reviewer")
                .Take(50));

        if (!usersResult.isSuccess)
        {
            return Result<IReadOnlyList<string>>.Fail(usersResult.error);
        }

        var random = new Random();
        var reviewerIds = usersResult.value
            .Select(u => u.id)
            .Where(id => !string.IsNullOrWhiteSpace(id))
            .Distinct()
            .OrderBy(x => random.Next())
            .Take(1)
            .ToList();

        return Result<IReadOnlyList<string>>.Ok(reviewerIds);
    }
}