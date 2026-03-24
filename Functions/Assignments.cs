using Functions.Database;
using Functions.HTTP;
using Functions.Models;
using static Functions.HTTP.Handlers;

namespace Functions;

public class Assignments(ILogger<Assignments> logger, ICosmos cosmos)
{
    private const string DatabaseName = "blind-review";
    private const string ReviewablesContainerName = "reviewables";

    [Function("ListMyAssignments")]
    public async Task<HttpResponseData> ListMyAssignments(
        [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "assignments")]
        FunctionContext context,
        HttpRequestData req)
    {
        var userResult = context.GetUserId();
        if (!userResult.isSuccess)
        {
            return await req.ErrorResponse(userResult.error, logger);
        }

        var userId = userResult.value;
        var reviewablesResult = await cosmos.QueryItemFixed<Reviewable>(
            DatabaseName,
            ReviewablesContainerName,
            q => q.Where(r => r.assignments.Any(a => a.reviewerUserId == userId)));

        if (!reviewablesResult.isSuccess)
        {
            return await req.ErrorResponse(reviewablesResult.error, logger);
        }

        var items = new List<ReviewAssignmentResponse>();
        foreach (var r in reviewablesResult.value)
        {
            foreach (var a in r.assignments.Where(x => x.reviewerUserId == userId))
            {
                var submissionId = r.id ?? string.Empty;
                items.Add(new ReviewAssignmentResponse
                {
                    id = $"{submissionId}:{a.reviewerUserId}",
                    submissionId = submissionId,
                    title = r.name ?? submissionId,
                    subject = r.type ?? "Document",
                    assignedDate = a.assignedAt,
                    deadline = a.deadline,
                    status = a.status
                });
            }
        }

        items.Sort((x, y) => y.assignedDate.CompareTo(x.assignedDate));

        return await req.JsonResponse(new { items }, HttpStatusCode.OK);
    }

    private class ReviewAssignmentResponse
    {
        public string id { get; set; } = string.Empty;
        public string submissionId { get; set; } = string.Empty;
        public string title { get; set; } = string.Empty;
        public string subject { get; set; } = string.Empty;
        public DateTime assignedDate { get; set; }
        public DateTime? deadline { get; set; }
        public string status { get; set; } = "pending";
    }
}
