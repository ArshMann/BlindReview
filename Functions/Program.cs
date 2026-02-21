using Functions.Database;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Functions.Storage;
using Functions.Middleware;
using Functions.Utils;

var host = new HostBuilder()
    .ConfigureFunctionsWebApplication(workerApp =>
    {
        workerApp.UseMiddleware<AuthMiddleware>();
    })
    .ConfigureServices(services =>
    {
        services.AddSingleton<TokenService>();
        services.AddApplicationInsightsTelemetryWorkerService();
        services.AddSingleton<ICosmos, Cosmos>();
        services.AddSingleton<IBlobService, AzureBlobService>();
        services.Configure<JsonSerializerOptions>(options =>
        {
            options.WriteIndented = true;
        });
    })
    .Build();

host.Run();