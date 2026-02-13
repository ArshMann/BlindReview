namespace Functions.Models;

public record User
{
    [JsonProperty("id")] string id { get; init; } = null!;
    string? name { get; init; }
    string? email { get; init; }
}