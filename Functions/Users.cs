using Functions.Database;
using Functions.HTTP;
using Functions.Utils;

namespace Functions;

public class Users(ILogger<Users> logger, ICosmos cosmos, TokenService _tokenService)
{
    [Function("CreateUser")]
    public async Task<HttpResponseData> CreateUser(
        [HttpTrigger(AuthorizationLevel.Anonymous, "post")] HttpRequestData req)
    {
        var requestResult = await Handlers.RequestBodyResult<Models.User>(req);
        if (!requestResult.isSuccess) return await Handlers.ErrorResponse(requestResult.error, req);

        var user = requestResult.value;

        user.password = BCrypt.Net.BCrypt.HashPassword(user.password);

        var result = await cosmos.CreateItem("blind-review", "users", user);

        if (!result.isSuccess) return await Handlers.ErrorResponse(result.error, req);

        user.password = null; // Don't return the hashed password
        return await Handlers.JsonResponse(user, HttpStatusCode.Created, req);
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
    [Function("Login")]
    public async Task<HttpResponseData> Login(
        [HttpTrigger(AuthorizationLevel.Anonymous, "post")] HttpRequestData req)
    {
        var result = await Handlers.RequestBodyResult<Models.User>(req);
        if (!result.isSuccess) return await Handlers.ErrorResponse(result.error, req);

        var loginData = result.value;

        var queryResult = await cosmos.QueryItemFixed<Models.User>(
            "blind-review",
            "users",
            q => q.Where(u => u.email == loginData.email)
        );

        var user = queryResult.value.FirstOrDefault();

        if (user == null || !BCrypt.Net.BCrypt.Verify(loginData.password, user.password))
        {
            return await Handlers.ErrorResponse(new Exception("Invalid email or password."), req);
        }

        var token = _tokenService.CreateToken(user);

        user.password = "";

        var responseData = new
        {
            Token = token,
            User = user
        };

        return await Handlers.JsonResponse(responseData, HttpStatusCode.OK, req);
    }
}
