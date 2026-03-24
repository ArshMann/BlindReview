namespace Functions.Models;

public class ReviewableAssignment
{
    public string reviewerUserId { get; set; } = string.Empty;
    public string status { get; set; } = "pending";
    public DateTime assignedAt { get; set; } = DateTime.UtcNow;
    public DateTime? deadline { get; set; }
}
