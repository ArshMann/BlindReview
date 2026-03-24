using Functions.Database;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Functions.Storage;
using Functions.Middleware;
using Functions.Utils;
using Functions.Services.Assignments;

var host = new HostBuilder()
    .ConfigureFunctionsWebApplication(workerApp =>
    {
        workerApp.UseMiddleware<AuthMiddleware>();
    })
    .ConfigureServices(services =>
    {
        services.AddScoped<TokenService>();
        services.AddApplicationInsightsTelemetryWorkerService();
        services.AddSingleton<ICosmos, Cosmos>();
        services.AddSingleton<IBlobService, AzureBlobService>();

        services.AddSingleton<IAssignmentStrategy, DedicatedReviewerStrategy>();
        services.AddSingleton<IAssignmentStrategy, DefaultAssignmentStrategy>();
        services.AddSingleton<IAssignmentService, AssignmentService>();
        
        services.Configure<JsonSerializerOptions>(options =>
        {
            options.WriteIndented = true;
        });
    })
    .Build();

host.Run();