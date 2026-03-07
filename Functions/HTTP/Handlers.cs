
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Functions.Models;
using Functions.Utils;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Primitives;
using User = Functions.Models.User;

namespace Functions.HTTP;

public static class Handlers
{
    public static async Task<T> RequestBody<T>(this HttpRequestData request)
    {
        var body = await new StreamReader(request.Body).ReadToEndAsync();
        return JsonSerializer.Deserialize<T>(body) ?? throw new NullReferenceException("Request converted to null");
    }
    public static async Task<HttpResponseData> JsonResponse<T>(this HttpRequestData req, T result, HttpStatusCode code)
    {
        var res = req.CreateResponse(code);
        await res.WriteAsJsonAsync(result);
        return res;
    }
    public static async Task<Result<T>> RequestBodyResult<T>(this HttpRequestData request)
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
    public static async Task<HttpResponseData> ErrorResponse(this HttpRequestData req, Exception error, ILogger? logger = null)
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
    public static Result<string> GetUserId(this FunctionContext context) =>
        context.Items.TryGetValue("UserId", out var value)
            ? string.IsNullOrEmpty(value.ToString())
                ? Result<string>.Fail(new Exception("UserId is null or empty"))
                : Result<string>.Ok(value.ToString()!)
            : Result<string>.Fail(new Exception("UserId is null or empty"));

    public static  Result<string?> GetContinuationToken(this HttpRequestData req)
    {
        try
        {
            var query = System.Web.HttpUtility.ParseQueryString(req.Url.Query);
            return Result<string?>.Ok(query["continuationToken"]);
        }
        catch (Exception ex)
        {
            return Result<string?>.Fail(ex.Message);
        }
    }
    
    public static Result<int> GetPageSize(this HttpRequestData req)
    {
        try
        {
            var query = System.Web.HttpUtility.ParseQueryString(req.Url.Query);
            return Result<int>.Ok(int.TryParse(query["pageSize"], out var size) ? size : 10);
        }
        catch (Exception ex)
        {
            return Result<int>.Fail(ex.Message);
        }
    }
}