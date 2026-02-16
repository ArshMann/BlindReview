
using Functions.Models;
using Functions.Utils;

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
    public static async Task<HttpResponseData> ErrorResponse(Exception error, HttpRequestData req)
    {
        var res = req.CreateResponse(HttpStatusCode.BadRequest);
        var errorObject = new Error()
        {
            internalMessage = error.Message,
            error = error,
            statusCode = HttpStatusCode.BadRequest,
            message = "Bad Request", // TODO update this, probably function sig
        };
        await res.WriteAsJsonAsync(errorObject);
        return res;
    }
}