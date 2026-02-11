using Functions.Database;

namespace Functions;

// Requires Cosmos to be setup first to work
// public class PlaceHolder(ILogger<PlaceHolder> logger, ICosmos cosmos)
// {
//     [Function("PlaceHolder")]
//     public async Task<HttpResponseData> Run(
//         [HttpTrigger(AuthorizationLevel.Anonymous, "get")] HttpRequestData req)
//     {
//         var client = cosmos.GetClient();
//
//         var container = client.GetContainer(
//             Environment.GetEnvironmentVariable("CosmosDatabase")!,
//             Environment.GetEnvironmentVariable("CosmosContainer")!
//         );
//
//         var created = await container.CreateItemAsync(new { name = "asdf" });
//
//         var res = req.CreateResponse(HttpStatusCode.OK);
//         await res.WriteStringAsync(created.Resource.ToString());
//         return res;
//     }
// }



// HTTP Test (No Cosmos)
public class PlaceHolder(ILogger<PlaceHolder> logger)
{
    [Function("PlaceHolder")]
    public async Task<HttpResponseData> Run(
        [HttpTrigger(AuthorizationLevel.Anonymous, "get")] HttpRequestData req)
    {
        logger.LogInformation("PlaceHolder hit");
        var res = req.CreateResponse(HttpStatusCode.OK);
        await res.WriteStringAsync("Functions API is working ✅");
        return res;
    }
}