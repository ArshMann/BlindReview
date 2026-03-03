
using System.IdentityModel.Tokens.Jwt;
using Functions.Models;
using Functions.Utils;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Primitives;
using User = Functions.Models.User;

namespace Functions.HTTP;

public static class Handlers
{
    public static async Task<T> RequestBody<T>(HttpRequestData request)
    {
        var body = await new StreamReader(request.Body).ReadToEndAsync();
        return JsonSerializer.Deserialize<T>(body) ?? throw new NullReferenceException("Request converted to null");
    }
    public static async Task<HttpResponseData> JsonResponse<T>(T result, HttpStatusCode code, HttpRequestData req)
    {
        var res = req.CreateResponse(code);
        await res.WriteAsJsonAsync(result);
        return res;
    }
    public static async Task<Result<T>> RequestBodyResult<T>(HttpRequestData request)
    {
        try
        {
            var body = await new StreamReader(request.Body).ReadToEndAsync();
            
            
            var data = JsonSerializer.Deserialize<T>(body);
            
            if (data == null)
                return Result<T>.Fail("Failed to deserialize request body");
            
            return Result<T>.Ok(data);
        }
        catch (Exception ex)
        {
            return Result<T>.Fail(new Exception($"Failed to parse request: {ex.Message}", ex));
        }
    }
    // Don't think we'll need different error types 
    public static async Task<HttpResponseData> ErrorResponse(Exception error, HttpRequestData req, ILogger? logger = null)
    {
        var res = req.CreateResponse(HttpStatusCode.BadRequest);
        var errorObject = new Error()
        {
            error = error,
            statusCode = HttpStatusCode.BadRequest,
            message = error.Message, 
        };
        logger?.LogError(error, errorObject.message);
        await res.WriteAsJsonAsync(errorObject);
        return res;
    }

    public static Result<User> VerifyCaller(this HttpRequestData req, TokenService tokenService)
    {
        try
        {
            req.Headers.TryGetValues("Authorization", out var tokenOut);
            var token = tokenOut?.FirstOrDefault();
            var validatedToken =
                tokenService.ValidateToken(token ?? throw new InvalidOperationException("Token is null"));
            if (validatedToken == null) throw new NullReferenceException("Token is null");
            return Result<User>.Ok(new User
            {
                id = validatedToken.FindFirst(JwtRegisteredClaimNames.Sub)?.Value ??
                     throw new NullReferenceException("Email is null or empty in token"),
                email = validatedToken.FindFirst(JwtRegisteredClaimNames.Email)?.Value ??
                        throw new NullReferenceException("Email is null or empty in token"),
            });
        }
        catch (Exception ex)
        {
            return Result<User>.Fail(ex);
        }
    }
}