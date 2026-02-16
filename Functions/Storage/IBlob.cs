using Azure.Storage.Blobs;
using Functions.Utils;

namespace Functions.Storage;

public interface IBlob
{
    public BlobServiceClient client { get; set; }

    public BlobServiceClient GetClient();


    public Task<Result<T>> CreateItem<T>(
        string databaseName,
        string containerName,
        T item,
        PartitionKey? partitionKey = null,
        ItemRequestOptions? requestOptions = null,
        CancellationToken cancellationToken = default(CancellationToken));
    
    public Task<Result<T>> PatchItem<T>(
        string databaseName,
        string containerName,
        T item,
        PartitionKey? partitionKey = null,
        ItemRequestOptions? requestOptions = null,
        CancellationToken cancellationToken = default(CancellationToken));

    public Task<Result<List<T>>> QueryItemFixed<T>(
        string databaseName,
        string containerName,
        Func<IQueryable<T>, IQueryable<T>> query,
        string? continuationToken = null,
        QueryRequestOptions? requestOptions = null
    );
}
