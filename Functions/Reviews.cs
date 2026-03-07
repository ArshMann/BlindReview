using Azure.Storage.Blobs;
using Functions.Database;
using Functions.Storage;
using Functions.HTTP;
using Functions.Models;
using Functions.Utils;
using static Functions.HTTP.Handlers;

namespace Functions;

public class Reviews(ILogger<Reviews> logger, IBlobService blobService, ICosmos cosmos)
{
    private readonly string _containerName = Environment.GetEnvironmentVariable("BlobContainerName") ?? "reviewables";

    [Function("UploadReviewable")]
    public async Task<HttpResponseData> UploadReviewable(
        [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "file")]
        FunctionContext context,
        HttpRequestData req)
    {
        var file = req.Body;
        var fileName = Guid.NewGuid().ToString();

        var program = await context.GetUserId()
            .Then(userId =>
                Result<(Task<Result<BlobClient>>, string)>.Ok((blobService.UploadAsync(_containerName, fileName, file), userId)))
            .ThenAsync(async prev =>
            {
                var reviewable = new Reviewable()
                {
                    blobUrl = prev.Item1.Result.value.Uri.AbsoluteUri,
                    createdAt = DateTime.UtcNow,
                    id = fileName,
                    type = (await (await prev.Item1).value.GetPropertiesAsync()).Value.ContentType,
                    name = fileName,
                    userId = prev.Item2,
                    cost = 1
                };
                return await cosmos.CreateItem("blind-review",
                    "reviewables",
                    reviewable);
            });
        if (program.isSuccess)
        {
            return await JsonResponse(program.value, HttpStatusCode.Created, req);
        }

        logger.LogError(program.error, "Upload failed");
        return await ErrorResponse(program.error, req);
    }

    [Function("DownloadFile")]
    public async Task<HttpResponseData> DownloadFile(
        [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "file/{fileName}")]
        FunctionContext context,
        HttpRequestData req,
        string fileName)
    {
        var result = await context.GetUserId().ThenAsync(_ => blobService.DownloadAsync(_containerName, fileName));

        if (!result.isSuccess)
        {
            return await ErrorResponse(result.error, req, logger);
        }

        var response = req.CreateResponse(HttpStatusCode.OK);
        response.Headers.Add("Content-Type", result.value.Details.ContentType);
        await using var blobStream = result.value.Content;
        await blobStream.CopyToAsync(response.Body);

        return response;
    }

    [Function("GetReviewable")]
    public async Task<HttpResponseData> GetReviewable(
        [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "reviewable/{id}")]
        FunctionContext context,
        HttpRequestData req,
        string id)
    {
        var result = await context.GetUserId().ThenAsync(userId =>
            cosmos.GetItem<Reviewable>("blind-review", "reviewables", id, new PartitionKey(userId)));
        if (!result.isSuccess)
        {
            return await ErrorResponse(result.error, req);
        }

        return await JsonResponse(result.value, HttpStatusCode.Created, req);
    }
    [Function("ListReviewables")]
    public async Task<HttpResponseData> ListReviewables(
        [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "reviewable")]
        FunctionContext context,
        HttpRequestData req,
        string id)
    {
        var contToken = req.GetContinuationToken().value;
        var pageSize = req.GetPageSize().value;

        var result = await cosmos.QueryItemsPaged<Reviewable>(
            "blind-review",
            "reviewables",
            q => q,
            continuationToken: contToken,
            pageSize: pageSize
        );
        if (!result.isSuccess)
        {
            return await ErrorResponse(result.error, req);
        }
        
        var response = new
        {
            items = result.value.ToList(),
            continuationToken = result.value.ContinuationToken,
            hasMore = !string.IsNullOrEmpty(result.value.ContinuationToken)
        };

        return await JsonResponse(response, HttpStatusCode.OK, req);
    } 

    [Function("DeleteFile")]
    public async Task<HttpResponseData> DeleteFile(
        [HttpTrigger(AuthorizationLevel.Anonymous, "delete", Route = "file/{fileName}")]
        HttpRequestData req,
        string fileName)
    {
        var result = await blobService.DeleteAsync(_containerName, fileName);

        if (result.isSuccess)
        {
            var successData = new { Message = result.value ? "Deleted successfully." : "File not found." };
            return await JsonResponse(successData, HttpStatusCode.OK, req);
        }

        return await ErrorResponse(result.error, req);
    }
}