using Functions.Database;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

var host = new HostBuilder()
    .ConfigureFunctionsWebApplication()
    .ConfigureFunctionsWorkerDefaults()
    .ConfigureServices(services =>
    {
        services.AddSingleton<ICosmos, Cosmos>();
        services.Configure<JsonSerializerOptions>(options =>
        {
            options.WriteIndented = true;
        });
    })
    .Build();

host.Run();