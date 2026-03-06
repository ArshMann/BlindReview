using Functions.Database;
using Functions.Storage;
using Functions.HTTP;
using Functions.Models;
using Functions.Utils;
using static Functions.HTTP.Handlers;

namespace Functions;

public class Reviews(ILogger<Reviews> logger, IBlobService blobService, ICosmos cosmos, TokenService tokenService)
{
    private readonly string _containerName = Environment.GetEnvironmentVariable("BlobContainerName") ?? "reviewables";

    [Function("UploadFile")]
    public async Task<HttpResponseData> UploadFile(
        [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "file")]
        HttpRequestData req)
    {
        var file = req.Body;

        string fileName = Guid.NewGuid().ToString();

        var blobResult = await blobService.UploadAsync(_containerName, fileName, file);

        if (blobResult.isSuccess)
        {
            var reviewable = new Reviewable()
            {
                blobUrl = blobResult.value.Uri.AbsoluteUri,
                createdAt = DateTime.UtcNow,
                id = fileName,
                type = (await blobResult.value.GetPropertiesAsync()).Value.ContentType,
                name = fileName,
                userId = "123", // TODO THIS GOTTA BE FROM THE USER CREATING IT (in order to keep the seperation/anonymitiy of different users)
                cost = 1 // Todo figure out what the cost of things should be  
            };
            var cosmosItem = await cosmos.CreateItem("blind-review", "reviewables", reviewable);
            return await JsonResponse(cosmosItem.value, HttpStatusCode.Created, req);
        }

        logger.LogError(blobResult.error, "Upload failed");
        return await ErrorResponse(blobResult.error, req);
    }

    [Function("DownloadFile")]
    public async Task<HttpResponseData> DownloadFile(
        [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "file/{fileName}")]
        HttpRequestData req,
        string fileName)
    {
        var result = await blobService.DownloadAsync(_containerName, fileName);

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
        HttpRequestData req,
        string id)
    {
        var userid = tokenService._caller;
        var result = await cosmos.GetItem<Reviewable>("blind-review", "reviewables", id, new PartitionKey(userid?.id));
        if (!result.isSuccess)
        {
            return await ErrorResponse(result.error, req);
        }

        return await JsonResponse(result.value, HttpStatusCode.Created, req);
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