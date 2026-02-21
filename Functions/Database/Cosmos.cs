using Functions.Utils;
using Microsoft.Azure.Cosmos.Linq;

namespace Functions.Database;

public class Cosmos: ICosmos
{
    public CosmosClient client { get; set; }
    
    public Cosmos()
    {
        var connectionString = Environment.GetEnvironmentVariable("CosmosConnection")
                               ?? throw new InvalidOperationException("Missing CosmosConnection Environment Variable.");

        client = new CosmosClient(connectionString);
    }

    public CosmosClient GetClient()
    {
        return client;
    }

    public async Task<Result<T>> CreateItem<T>(
        string databaseName,
        string containerName,
        T item,
        PartitionKey? partitionKey = null,
        ItemRequestOptions? requestOptions = null,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var container = client.GetContainer(databaseName, containerName);
            var response = await container.CreateItemAsync(item, partitionKey, requestOptions, cancellationToken);
            return Result<T>.Ok(response);
        }
        catch (Exception ex)
        {
            return Result<T>.Fail(ex);
        }
    }
    
    public async Task<Result<T>> GetItem<T>(
        string databaseName,
        string containerName,
        string id,
        PartitionKey? partitionKey = null,
        ItemRequestOptions? requestOptions = null,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var container = client.GetContainer(databaseName, containerName);
            var response = await container.ReadItemAsync<T>(id, partitionKey ?? new PartitionKey(), requestOptions, cancellationToken);
            return Result<T>.Ok(response);
        }
        catch (Exception ex)
        {
            return Result<T>.Fail(ex);
        }
    }
    
    public async Task<Result<T>> PatchItem<T>(
        string databaseName,
        string containerName,
        T item,
        PartitionKey? partitionKey = null,
        ItemRequestOptions? requestOptions = null,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var container = client.GetContainer(databaseName, containerName);
            var response = await container.UpsertItemAsync(item, partitionKey, requestOptions, cancellationToken);
            return Result<T>.Ok(response);
        }
        catch (Exception ex)
        {
            return Result<T>.Fail(ex);
        }
    }
    
    public async Task<Result<List<T>>> QueryItemFixed<T>(
        string databaseName,
        string containerName,
        Func<IQueryable<T>, IQueryable<T>> query,
        string? continuationToken = null, 
        QueryRequestOptions?requestOptions = null
    )
    {
        try
        {
            var container = client.GetContainer(databaseName, containerName);
            var response = container.GetItemLinqQueryable<T>();
            var output = new List<T>();
            
            var result = query(response.AsQueryable());
            using var itererator = result.ToFeedIterator();
            
            while (itererator.HasMoreResults)
            {
                foreach (var item in await itererator.ReadNextAsync())
                {
                    output.Add(item);
                }
            }
            return Result<List<T>>.Ok(output);
        }
        catch (Exception ex)
        {
            return Result<List<T>>.Fail(ex);
        }
    }
}