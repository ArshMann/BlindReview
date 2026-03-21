namespace Functions.Models;

public class Assignment
{
    public string id { get; set; } = Guid.NewGuid().ToString();
    public string reviewableId { get; set; } = string.Empty;
    public string ownerUserId { get; set; } = string.Empty;
    public string reviewerUserId { get; set; } = string.Empty;
    public string status { get; set; } = "pending";
    public DateTime assignedAt { get; set; } = DateTime.UtcNow;
    public DateTime? deadline { get; set; }
}
