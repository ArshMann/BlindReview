using System.Reflection.Metadata;
using Azure;
using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using Functions.Utils;

namespace Functions.Storage;

public class AzureBlobService : IBlobService
{
    private readonly BlobServiceClient _blobServiceClient;

    public AzureBlobService()
    {
        var connectionString = Environment.GetEnvironmentVariable("BlobConnection");
        _blobServiceClient = new BlobServiceClient(connectionString);
    }

    public async Task<Result<BlobClient>> UploadAsync(
        string container,
        string name,
        Stream content,
        string contentType = null,
        CancellationToken ct = default)
    {
        try
        {
            var containerClient = _blobServiceClient.GetBlobContainerClient(container);
            var blobClient = containerClient.GetBlobClient(name);

            await blobClient.UploadAsync(content, ct);
            return Result<BlobClient>.Ok(blobClient);
        }
        catch (Exception ex)
        {
            return Result<BlobClient>.Fail(ex);
        }
    }

    public async Task<Result<BlobDownloadStreamingResult>> DownloadAsync(
        string container,
        string name,
        CancellationToken ct = default)
    {
        try
        {
            var containerClient = _blobServiceClient.GetBlobContainerClient(container);
            var blobClient = containerClient.GetBlobClient(name);

            // DownloadStreamingAsync is efficient for large files
            BlobDownloadStreamingResult download = await blobClient.DownloadStreamingAsync(cancellationToken: ct);

            return Result<BlobDownloadStreamingResult>.Ok(download);
        }
        catch (RequestFailedException ex) when (ex.Status == 404)
        {
            return Result<BlobDownloadStreamingResult>.Fail("The specified blob does not exist.");
        }
        catch (Exception ex)
        {
            return Result<BlobDownloadStreamingResult>.Fail(ex);
        }
    }

    public async Task<Result<bool>> DeleteAsync(
        string container,
        string name,
        CancellationToken ct = default)
    {
        try
        {
            var containerClient = _blobServiceClient.GetBlobContainerClient(container);
            var blobClient = containerClient.GetBlobClient(name);

            var deleted = await blobClient.DeleteIfExistsAsync(DeleteSnapshotsOption.IncludeSnapshots, cancellationToken: ct);

            return Result<bool>.Ok(deleted);
        }
        catch (Exception ex)
        {
            return Result<bool>.Fail(ex);
        }
    }
}