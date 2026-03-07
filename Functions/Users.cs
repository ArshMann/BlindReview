using Functions.Database;
using Functions.HTTP;
using Functions.Utils;
using static Functions.HTTP.Handlers;

namespace Functions;

public class Users(ILogger<Users> logger, ICosmos cosmos, TokenService tokenService)
{
    [Function("CreateUser")]
    public async Task<HttpResponseData> CreateUser(
        [HttpTrigger(AuthorizationLevel.Anonymous, "post")] HttpRequestData req)
    {
        var requestResult = await req.RequestBodyResult<Models.User>();
        if (!requestResult.isSuccess) return await req.ErrorResponse(requestResult.error);

        var user = requestResult.value;

        user.password = BCrypt.Net.BCrypt.HashPassword(user.password);

        var result = await cosmos.CreateItem("blind-review", "users", user);

        if (!result.isSuccess) return await req.ErrorResponse(result.error);

        user.password = null; // Don't return the hashed password
        return await req.JsonResponse(user, HttpStatusCode.Created);
    }

    [Function("PatchUser")]
    public async Task<HttpResponseData> PatchUser(
        [HttpTrigger(AuthorizationLevel.Anonymous, "patch")] HttpRequestData req)
    {
        var result = await 
            req.RequestBodyResult<Models.User>()
                .ThenAsync(user => cosmos.PatchItem("blind-review", "users", user));
        
        if (!result.isSuccess)
        {
            logger.LogError(result.error, "Failed to create user");
            return await req.ErrorResponse(result.error);
        }
        logger.LogInformation("Created user {UserId}", result.value.id);
        return await req.JsonResponse(result.value, HttpStatusCode.Created);
    }
    
    [Function("QueryUsers")]
    public async Task<HttpResponseData> QueryUsers(
        [HttpTrigger(AuthorizationLevel.Anonymous, "get")] HttpRequestData req)
    {
        var result = await 
            req.RequestBodyResult<Models.User>()
                .ThenAsync(user => cosmos.QueryItemFixed<Models.User>("blind-review", "users", queryable => queryable));
        
        if (!result.isSuccess)
        {
            logger.LogError(result.error, "Failed to create user");
            return await req.ErrorResponse(result.error);
        }
        return await req.JsonResponse(result.value, HttpStatusCode.Created);
    }
    [Function("Login")]
    public async Task<HttpResponseData> Login(
        [HttpTrigger(AuthorizationLevel.Anonymous, "post")] HttpRequestData req)
    {
        var result = await req.RequestBodyResult<Models.User>();
        if (!result.isSuccess) return await req.ErrorResponse(result.error);

        var loginData = result.value;

        var queryResult = await cosmos.QueryItemFixed<Models.User>(
            "blind-review",
            "users",
            q => q.Where(u => u.email == loginData.email)
        );

        var user = queryResult.value.FirstOrDefault();

        if (user == null || !BCrypt.Net.BCrypt.Verify(loginData.password, user.password))
        {
            return await req.ErrorResponse(new Exception("Invalid email or password."));
        }

        var token = tokenService.CreateToken(user);

        user.password = "";

        var responseData = new
        {
            Token = token,
            User = user
        };

        return await req.JsonResponse(responseData, HttpStatusCode.OK);
    }
}
