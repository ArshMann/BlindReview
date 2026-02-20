using Functions.Database;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Functions.Storage;

var host = new HostBuilder()
    .ConfigureFunctionsWebApplication()
    .ConfigureServices(services =>
    {
        services.AddApplicationInsightsTelemetryWorkerService();
        services.AddSingleton<ICosmos, Cosmos>();
        services.AddSingleton<IBlob, Blob>();
        services.Configure<JsonSerializerOptions>(options =>
        {
            options.WriteIndented = true;
        });
    })
    .Build();

host.Run();