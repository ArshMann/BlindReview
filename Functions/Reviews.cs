using Functions.Storage;
using Functions.HTTP;

namespace Functions;

public class Reviews(ILogger<Reviews> logger, IBlobService blobService)
{
    private readonly string _containerName = Environment.GetEnvironmentVariable("BlobContainerName") ?? "reviewables";

    [Function("UploadImage")]
    public async Task<HttpResponseData> UploadImage(
        [HttpTrigger(AuthorizationLevel.Anonymous, "post")] HttpRequestData req)
    {
        logger.LogInformation("Processing image upload...");

        var imageStream = req.Body;

        if (imageStream == null)
        {
            return await Handlers.ErrorResponse(new Exception("Please provide an image in the request body."), req);
        }

        string fileName = $"{Guid.NewGuid()}.jpg";
        string contentType = "image/jpeg";

        var result = await blobService.UploadAsync(_containerName, fileName, imageStream, contentType);

        if (result.isSuccess)
        {
            return await Handlers.JsonResponse(new { Message = "Success", Url = result.value }, HttpStatusCode.OK, req);
        }

        logger.LogError(result.error, "Upload failed");
        return await Handlers.ErrorResponse(result.error, req);
    }

    [Function("DownloadImage")]
    public async Task<HttpResponseData> DownloadImage(
        [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "images/{fileName}")] HttpRequestData req,
        string fileName)
    {
        logger.LogInformation($"Downloading: {fileName}");

        var result = await blobService.DownloadAsync(_containerName, fileName);

        if (!result.isSuccess)
        {
            return await Handlers.ErrorResponse(new Exception("Image not found."), req);
        }

        var response = req.CreateResponse(HttpStatusCode.OK);
        response.Headers.Add("Content-Type", result.value.ContentType);

        using (var blobStream = result.value.Stream)
        {
            await blobStream.CopyToAsync(response.Body);
        }

        return response;
    }

    [Function("DeleteImage")]
    public async Task<HttpResponseData> DeleteImage(
        [HttpTrigger(AuthorizationLevel.Anonymous, "delete", Route = "images/{fileName}")] HttpRequestData req,
        string fileName)
    {
        logger.LogInformation($"Deleting: {fileName}");

        var result = await blobService.DeleteAsync(_containerName, fileName);

        if (result.isSuccess)
        {
            var successData = new { Message = result.value ? "Deleted successfully." : "File not found." };
            return await Handlers.JsonResponse(successData, HttpStatusCode.OK, req);
        }

        return await Handlers.ErrorResponse(result.error, req);
    }
}