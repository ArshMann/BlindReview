using System.Text.Json.Serialization;

namespace Functions.Models;

public record Comment
{
    public string id { get; set; } = Guid.NewGuid().ToString();
    
    [System.Text.Json.Serialization.JsonIgnore]
    [Newtonsoft.Json.JsonIgnore]
    public string reviewerUserId { get; set; } = string.Empty;

    public string text { get; set; } = string.Empty;
    public DateTime createdAt { get; set; } = DateTime.UtcNow;
    public DateTime? updatedAt { get; set; }  // If you allow editing
}