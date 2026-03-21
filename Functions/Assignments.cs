using Functions.Database;
using Functions.HTTP;
using Functions.Models;
using static Functions.HTTP.Handlers;

namespace Functions;

public class Assignments(ILogger<Assignments> logger, ICosmos cosmos)
{
    private const string DatabaseName = "blind-review";
    private const string AssignmentsContainerName = "assignments";
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

        var assignmentsResult = await cosmos.QueryItemFixed<Assignment>(
            DatabaseName,
            AssignmentsContainerName,
            q => q
                .Where(a => a.reviewerUserId == userResult.value)
                .OrderByDescending(a => a.assignedAt));

        if (!assignmentsResult.isSuccess)
        {
            return await req.ErrorResponse(assignmentsResult.error, logger);
        }

        var items = new List<ReviewAssignmentResponse>();
        foreach (var assignment in assignmentsResult.value)
        {
            var reviewableResult = await cosmos.GetItem<Reviewable>(
                DatabaseName,
                ReviewablesContainerName,
                assignment.reviewableId,
                new PartitionKey(assignment.ownerUserId));

            var title = assignment.reviewableId;
            var subject = "Document";
            if (reviewableResult.isSuccess)
            {
                title = reviewableResult.value.name ?? assignment.reviewableId;
                subject = reviewableResult.value.type ?? "Document";
            }

            items.Add(new ReviewAssignmentResponse
            {
                id = assignment.id,
                submissionId = assignment.reviewableId,
                title = title,
                subject = subject,
                assignedDate = assignment.assignedAt,
                deadline = assignment.deadline,
                status = assignment.status
            });
        }

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
