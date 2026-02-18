using System.Text.Json.Serialization;

namespace Functions.Models;

public record Error
{
    
    [JsonIgnore]
    public string internalMessage {get; set;} = null!;
    [JsonIgnore]
    public Exception error {get; set;} = null!;
    public HttpStatusCode statusCode { get; set; }
    public string message  {get; set;} = null!;
    public string code => statusCode.ToString();
}