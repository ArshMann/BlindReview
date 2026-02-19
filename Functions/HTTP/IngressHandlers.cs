
using Functions.Models;
using Functions.Utils;

namespace Functions.HTTP;

public static class IngressHandlers
{
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
    public static Result<Stream> RequestBodyStreamResult<T>(HttpRequestData request)
    {
        try
        {
            var data = request.Body;
            
            
             if (data.Length == 0)
                return Result<Stream>.Fail("The file is empty");

             return Result<Stream>.Ok(data);
        }
        catch (Exception ex)
        {
            return Result<Stream>.Fail(new Exception($"Failed to parse request: {ex.Message}", ex));
        }
    }
}