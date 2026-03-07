namespace Functions.Models;

public record Comment
{
    public string id { get; set; } = Guid.NewGuid().ToString();
    public string userId { get; set; }  // Who wrote it
    public string userName { get; set; }  // Display name (optional, for convenience)
    public string text { get; set; }
    public DateTime createdAt { get; set; } = DateTime.UtcNow;
    public DateTime? updatedAt { get; set; }  // If you allow editing
}