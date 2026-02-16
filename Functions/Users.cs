using Functions.Database;
using Functions.HTTP;
using Functions.Utils;

namespace Functions;

public class Users(ILogger<Users> logger, ICosmos cosmos)
{
    [Function("CreateUser")]
    public async Task<HttpResponseData> CreateUser(
        [HttpTrigger(AuthorizationLevel.Anonymous, "post")] HttpRequestData req)
    {
        var result = await 
            Handlers.RequestBodyResult<Models.User>(req)
            .ThenAsync(user => cosmos.CreateItem("blind-review", "users", user));
        
        if (!result.isSuccess)
        {
            logger.LogError(result.error, "Failed to create user");
            return await Handlers.ErrorResponse(result.error, req);
        }
        logger.LogInformation("Created user {UserId}", result.value.id);
        return await Handlers.JsonResponse(result.value, HttpStatusCode.Created, req);
    }
    
    [Function("PatchUser")]
    public async Task<HttpResponseData> PatchUser(
        [HttpTrigger(AuthorizationLevel.Anonymous, "patch")] HttpRequestData req)
    {
        var result = await 
            Handlers.RequestBodyResult<Models.User>(req)
                .ThenAsync(user => cosmos.PatchItem("blind-review", "users", user));
        
        if (!result.isSuccess)
        {
            logger.LogError(result.error, "Failed to create user");
            return await Handlers.ErrorResponse(result.error, req);
        }
        logger.LogInformation("Created user {UserId}", result.value.id);
        return await Handlers.JsonResponse(result.value, HttpStatusCode.Created, req);
    }
    
    [Function("QueryUsers")]
    public async Task<HttpResponseData> QueryUsers(
        [HttpTrigger(AuthorizationLevel.Anonymous, "get")] HttpRequestData req)
    {
        var result = await 
            Handlers.RequestBodyResult<Models.User>(req)
                .ThenAsync(user => cosmos.QueryItemFixed<Models.User>("blind-review", "users", queryable => queryable));
        
        if (!result.isSuccess)
        {
            logger.LogError(result.error, "Failed to create user");
            return await Handlers.ErrorResponse(result.error, req);
        }
        return await Handlers.JsonResponse(result.value, HttpStatusCode.Created, req);
    }
}
