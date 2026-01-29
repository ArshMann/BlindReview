using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Functions;

public class PlaceHolder
{
    private readonly ILogger<PlaceHolder> _logger;

    public PlaceHolder(ILogger<PlaceHolder> logger)
    {
        _logger = logger;
    }

    [Function("PlaceHolder")]
    public IActionResult Run([HttpTrigger(AuthorizationLevel.Function, "get", "post")] HttpRequest req)
    {
        _logger.LogInformation("C# HTTP trigger function processed a request.");
        return new OkObjectResult("Welcome to Azure Functions!");
        
    }

}