using Functions.Database;
using Functions.Storage;

namespace Functions;

public class Reviews(ILogger<Reviews> logger, ICosmos cosmos, IBlobService blobService)
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
            var badRes = req.CreateResponse(HttpStatusCode.BadRequest);
            await badRes.WriteStringAsync("Please provide an image in the request body.");
            return badRes;
        }

        string container = _containerName;
        string fileName = $"{Guid.NewGuid()}.jpg";
        string contentType = "image/jpeg";

        var result = await blobService.UploadAsync(container, fileName, imageStream, contentType);

        if (result.isSuccess)
        {
            var okRes = req.CreateResponse(HttpStatusCode.OK);
            await okRes.WriteStringAsync($"Success! Image uploaded to: {result.value}");
            return okRes;
        }
        else
        {
            logger.LogError(result.error, "Upload failed");
            var errRes = req.CreateResponse(HttpStatusCode.InternalServerError);
            await errRes.WriteStringAsync("Upload failed. Check logs.");
            return errRes;
        }
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
            var errorRes = req.CreateResponse(HttpStatusCode.NotFound);
            await errorRes.WriteStringAsync("Image not found.");
            return errorRes;
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
            var response = req.CreateResponse(HttpStatusCode.OK);
            string message = result.value ? "Deleted successfully." : "File didn't exist, but consider it gone.";
            await response.WriteStringAsync(message);
            return response;
        }
        else
        {
            var err = req.CreateResponse(HttpStatusCode.InternalServerError);
            await err.WriteStringAsync($"Delete failed: {result.error.Message}");
            return err;
        }
    }
}