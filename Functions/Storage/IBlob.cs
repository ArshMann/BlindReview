using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using Functions.Utils;

namespace Functions.Storage;

public interface IBlob
{
    public BlobServiceClient client { get; set; }

    public BlobServiceClient GetClient();


    public Task<Result<BlobContentInfo>> CreateItem(
        string blobContainerName,
        string blobName,
        Stream blobStream
    );
    
    public Task<Result<BlobDownloadResult>> GetItem(
        string blobContainerName,
        string blobName
    );
}
