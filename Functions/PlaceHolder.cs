using Functions.Database;

namespace Functions;

public class PlaceHolder(ILogger<PlaceHolder> logger, ICosmos cosmos)
{
    [Function("PlaceHolder")]
    public async Task<HttpResponseData> Run([HttpTrigger(AuthorizationLevel.Function, "get", "post")] HttpRequestData req)
    {
        logger.LogInformation("C# HTTP trigger function processed a request.");
        var res = req.CreateResponse(HttpStatusCode.OK);
        var blah = cosmos.GetClient().GetContainer("this should break", "this should break");
        var response = blah.CreateItemAsync(new { name = "asdf" } );
        var item = response.Result;
        await res.WriteStringAsync(item.Resource.ToString());
        return res;
    }
}