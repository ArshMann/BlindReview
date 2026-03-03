using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using Functions.Utils;

namespace Functions.Storage;

public interface IBlobService
{
    // Upload: Returns Uri on success
    Task<Result<BlobClient>> UploadAsync(
        string container,
        string name,
        Stream content,
        string contentType = null,
        CancellationToken ct = default);

    // Download: Returns the BlobFile record on success
    Task<Result<BlobDownloadStreamingResult>> DownloadAsync(
        string container,
        string name,
        CancellationToken ct = default);

    // Delete: Now uses <bool> to fix error CS0305
    Task<Result<bool>> DeleteAsync(
        string container,
        string name,
        CancellationToken ct = default);
}

// public record BlobFile(Stream Stream, string ContentType);