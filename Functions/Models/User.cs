namespace Functions.Models;

public record User
{
    public string id { get; init; } = Guid.NewGuid().ToString();
    public string name { get; init; } = string.Empty;
    public string email { get; init; } = string.Empty;
    public string role { get; init; } = "Student"; // student, reviewer, instructor
    public int credits { get; init; } = 0;
    public DateTime createdAt { get; init; } = DateTime.UtcNow;
}