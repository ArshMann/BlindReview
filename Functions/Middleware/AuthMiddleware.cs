using System.Security.Claims;
using Functions.Utils;
using Microsoft.Azure.Functions.Worker.Middleware;
using Microsoft.Extensions.DependencyInjection;

namespace Functions.Middleware;

public class AuthMiddleware() : IFunctionsWorkerMiddleware
{
    
    public async Task Invoke(FunctionContext context, FunctionExecutionDelegate next)
    {
        var tokenService =
            context.InstanceServices.GetRequiredService<TokenService>();
 
        var functionName = context.FunctionDefinition.Name;
        if (functionName == "Login" || functionName == "CreateUser")
        {
            await next(context);
            return;
        }
        // Everything below assumes auth is required
        var reqData = await context.GetHttpRequestDataAsync();
        var authHeader = reqData?.Headers.TryGetValues("Authorization", out var values) == true
                         ? values.FirstOrDefault() : null;
        if (authHeader == null)
        {
            var response = reqData!.CreateResponse(HttpStatusCode.Unauthorized);
            await response.WriteAsJsonAsync(new { message = "Invalid or expired token", code = nameof(HttpStatusCode.Unauthorized) });
            context.GetInvocationResult().Value = response;
            return;
        } 
        
        if (authHeader.StartsWith("Bearer "))
        {
            var token = authHeader.Substring(7);
            ClaimsPrincipal? principal;
            try
            {
                principal = tokenService.ValidateToken(token);
            }
            catch (Exception)
            {
                var response = reqData!.CreateResponse(HttpStatusCode.Unauthorized);
                await response.WriteAsJsonAsync(new { message = "Invalid or expired token", code = nameof(HttpStatusCode.Unauthorized) });
                context.GetInvocationResult().Value = response;
                return;
            }

            if (principal != null)
            {
                var userId = principal.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                context.Items["UserId"] = userId;

                await next(context);
                return;
            }
           
        }
        await next(context);
    }
}