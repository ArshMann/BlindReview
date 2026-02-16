namespace Functions.Models;

public record Reviewable
{
    public string? id { get; init; }
    public string userId { get; set; } = null!;
    public string? name { get; init; }
    public string? type { get; init; } // could be enum typeish thing
    public string? blobUrl { get; init; }
    public DateTime? createdAt { get; init; }
    public DateTime? updatedAt { get; init; }
    public int cost { get; init; } // maybe like projects would cost more in reviews than something like a resume
}