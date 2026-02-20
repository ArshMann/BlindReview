using Functions.Database;
using Functions.Storage;

namespace Functions;

public class Reviews(ILogger<Reviews> logger, ICosmos cosmos, IBlobService blobService)
{
    [Function("UploadImage")]
    public async Task<HttpResponseData> UploadImage(
        [HttpTrigger(AuthorizationLevel.Anonymous, "post")] HttpRequestData req)
    {
        logger.LogInformation("Processing image upload...");

        var imageStream = req.Body;

        if (imageStream == null || imageStream.Length == 0)
        {
            var badRes = req.CreateResponse(HttpStatusCode.BadRequest);
            await badRes.WriteStringAsync("Please provide an image in the request body.");
            return badRes;
        }

        string container = "user-images";
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
}