using Microsoft.Azure.Cosmos;

namespace Functions.Database;

public interface ICosmos
{
    public CosmosClient client { get; set; }

    public CosmosClient GetClient();
}