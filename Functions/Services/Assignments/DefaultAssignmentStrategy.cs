using Functions.Database;
using Functions.Models;
using Functions.Utils;

namespace Functions.AssignmentsService;

public class DefaultAssignmentStrategy(ICosmos cosmos) : IAssignmentStrategy
{
    private const string DatabaseName = "blind-review";
    private const string UsersContainerName = "users";

    public async Task<Result<IReadOnlyList<string>>> SelectReviewersAsync(
        Reviewable reviewable,
        string ownerUserId)
    {
        var maxReviewers = GetReviewerCount();
        var usersResult = await cosmos.QueryItemFixed<Models.User>(
            DatabaseName,
            UsersContainerName,
            q => q
                .Where(u => u.id != ownerUserId)
                .Where(u => u.role == "Reviewer" || u.role == "Student")
                .OrderBy(u => u.id)
                .Take(maxReviewers));

        if (!usersResult.isSuccess)
        {
            return Result<IReadOnlyList<string>>.Fail(usersResult.error);
        }

        var reviewerIds = usersResult.value
            .Select(u => u.id)
            .Where(id => !string.IsNullOrWhiteSpace(id))
            .Distinct()
            .ToList();

        return Result<IReadOnlyList<string>>.Ok(reviewerIds);
    }

    private static int GetReviewerCount()
    {
        var configured = Environment.GetEnvironmentVariable("AssignmentReviewerCount");
        return int.TryParse(configured, out var count) && count > 0 ? count : 2;
    }
}
