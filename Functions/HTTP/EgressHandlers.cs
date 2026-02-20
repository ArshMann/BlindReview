using Functions.Models;

namespace Functions.HTTP;

public static class EgressHandlers
{
    public static async Task<HttpResponseData> JsonResponse<T>(T result, HttpStatusCode code, HttpRequestData req)
    {
        var res = req.CreateResponse(code);
        await res.WriteAsJsonAsync(result);
        return res;
    }

    // Don't think we'll need different error types 
    public static async Task<HttpResponseData> JsonErrorResponse(Exception error, HttpRequestData req)
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

    public static async Task<T> RequestBody<T>(HttpRequestData request)
    {
        var body = await new StreamReader(request.Body).ReadToEndAsync();
        return JsonSerializer.Deserialize<T>(body) ?? throw new NullReferenceException("Request converted to null");
    }
}