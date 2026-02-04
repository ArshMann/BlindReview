using Azure.Identity;

namespace Functions.Database;

public class Cosmos: ICosmos
{
    public CosmosClient client { get; set; }
    
    public Cosmos()
    {
        var cosmosUrl = Environment.GetEnvironmentVariable("CosmosConnection")
                        ?? throw new InvalidOperationException("Missing CosmosConnection");
    
        client = new CosmosClient(cosmosUrl, new DefaultAzureCredential());
    }

    public CosmosClient GetClient()
    {
        return client;
    }
}