using Functions.Database;
using Functions.HTTP;
using Functions.Storage;
using Functions.Utils;

namespace Functions;

 public class Reviews(ILogger<PlaceHolder> logger, IBlob blob)
 {
     [Function("Upload")]
     public async Task<HttpResponseData> Run(
         [HttpTrigger(AuthorizationLevel.Anonymous, "get")] HttpRequestData req)
     {
        
         var result = await 
             IngressHandlers.RequestBodyStreamResult(req)
                 .ThenAsync(file => blob.CreateItem("reviewables", "blah", file));
        
         if (!result.isSuccess)
         {
             logger.LogError(result.error, "Failed to create user");
             return await EgressHandlers.JsonErrorResponse(result.error, req);
         }
         return await EgressHandlers.JsonResponse(result.value, HttpStatusCode.Created, req);
     }
 }
