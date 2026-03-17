using Functions.Utils;

namespace Functions.Database;

public interface ICosmos
{
    public CosmosClient client { get; set; }

    public CosmosClient GetClient();


    public Task<Result<T>> CreateItem<T>(
        string databaseName,
        string containerName,
        T item,
        PartitionKey? partitionKey = null,
        ItemRequestOptions? requestOptions = null,
        CancellationToken cancellationToken = default);
    
    public Task<Result<T>> GetItem<T>(
        string databaseName,
        string containerName,
        string id,
        PartitionKey? partitionKey = null,
        ItemRequestOptions? requestOptions = null,
        CancellationToken cancellationToken = default);

    
    public Task<Result<T>> PatchItem<T>(
        string databaseName,
        string containerName,
        T item,
        PartitionKey? partitionKey = null,
        ItemRequestOptions? requestOptions = null,
        CancellationToken cancellationToken = default);

    public Task<Result<List<T>>> QueryItemFixed<T>(
        string databaseName,
        string containerName,
        Func<IQueryable<T>, IQueryable<T>> query,
        string? continuationToken = null,
        QueryRequestOptions? requestOptions = null
    ); 
    public Task<Result<FeedResponse<T>>> QueryItemsPaged<T>(
        string databaseName,
        string containerName,
        Func<IQueryable<T>, IQueryable<T>> query,
        string? continuationToken = null,
        int pageSize = 10,
        QueryRequestOptions? requestOptions = null
    );
    public Task<Result<T>> UpsertItem<T>(
        string databaseName,
        string containerName,
        T item,
        PartitionKey? partitionKey = null,
        ItemRequestOptions? requestOptions = null,
        CancellationToken cancellationToken = default);
}
