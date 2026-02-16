namespace Functions.Models;

public record Reviewable
{
    string? id { get; init; }
    string? name { get; init; }
    string? type { get; init; } // could be enum typeish thing
    
}