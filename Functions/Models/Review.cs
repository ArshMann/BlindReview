namespace Functions.Models;

public record Review
{
    public string id { get; init; }
    public string userId { get; set; }
    public string? content { get; init; }
    public string? contentType { get; set; }
    public DateTime createdAt { get; init; }
    public DateTime updatedAt { get; init; }
}