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

    public async Task<Result<Uri>> UploadAsync(
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

            var options = new BlobUploadOptions
            {
                HttpHeaders = new BlobHttpHeaders { ContentType = contentType ?? "application/octet-stream" }
            };

            await blobClient.UploadAsync(content, options, ct);
            return Result<Uri>.Ok(blobClient.Uri);
        }
        catch (Exception ex)
        {
            return Result<Uri>.Fail(ex);
        }
    }

    public async Task<Result<BlobFile>> DownloadAsync(
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

            return Result<BlobFile>.Ok(new BlobFile(
                download.Content,
                download.Details.ContentType
            ));
        }
        catch (RequestFailedException ex) when (ex.Status == 404)
        {
            return Result<BlobFile>.Fail("The specified blob does not exist.");
        }
        catch (Exception ex)
        {
            return Result<BlobFile>.Fail(ex);
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