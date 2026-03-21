using System.Text.Json.Serialization;

namespace Functions.Models;

public class User
{
    [JsonIgnore]
    public string id { get; set; } = Guid.NewGuid().ToString();
    public string name { get; set; } = string.Empty;
    public string email { get; set; } = string.Empty;
    [JsonIgnore]
    public string password { get; set; } = string.Empty;
    public string role { get; set; } = "Student"; 
    public int credits { get; set; } = 0;
    public DateTime createdAt { get; set; } = DateTime.UtcNow;
}