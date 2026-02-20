using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using Functions.Utils;
using Microsoft.Azure.Cosmos.Linq;

namespace Functions.Storage;

public class Blob: IBlob 
{
    public BlobServiceClient client { get; set; }
    
    public Blob()
    {
        var blobUrl = Environment.GetEnvironmentVariable("BlobConnection")
                        ?? throw new InvalidOperationException("Missing BlobConnection");
    
        client = new BlobServiceClient(new Uri(blobUrl), new DefaultAzureCredential()); 
    }

    public BlobServiceClient GetClient()
    {
        return client;
    }

    public async Task<Result<BlobContentInfo>> CreateItem(
        string blobContainerName,
        string blobName,
        Stream blobStream
    )
    {
        try
        {
            var container = client.GetBlobContainerClient(blobContainerName);
            var blobClient = container.GetBlobClient(blobName);
            var res = await blobClient.UploadAsync(blobStream);
            return Result<BlobContentInfo>.Ok(res);
        }
        catch (Exception ex)
        {
            return Result<BlobContentInfo>.Fail(ex);
        }
    }
    
    public async Task<Result<BlobDownloadResult>> GetItem(
        string blobContainerName,
        string blobName
    )
    {
        try
        {
            var container = client.GetBlobContainerClient(blobContainerName);
            var blobClient = container.GetBlobClient(blobName);
            var content = await blobClient.DownloadContentAsync();
            if (content.HasValue) 
                return Result<BlobDownloadResult>.Ok(content.Value);
            throw new Exception($"Blob {blobContainerName}/{blobName} not found");
        }
        catch (Exception ex)
        {
            return Result<BlobDownloadResult>.Fail(ex);
        }
    }
}