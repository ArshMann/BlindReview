using System.Security.Claims;
using Functions.Utils;
using Microsoft.Azure.Functions.Worker.Middleware;

namespace Functions.Middleware;

public class AuthMiddleware(TokenService tokenService) : IFunctionsWorkerMiddleware
{
    public async Task Invoke(FunctionContext context, FunctionExecutionDelegate next)
    {
        var functionName = context.FunctionDefinition.Name;
        if (functionName == "Login" || functionName == "CreateUser")
        {
            await next(context);
            return;
        }

        var reqData = await context.GetHttpRequestDataAsync();
        var authHeader = reqData?.Headers.TryGetValues("Authorization", out var values) == true
                         ? values.FirstOrDefault() : null;

        if (authHeader != null && authHeader.StartsWith("Bearer "))
        {
            var token = authHeader.Substring(7);
            var principal = tokenService.ValidateToken(token);

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