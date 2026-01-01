using System.Text.Json;

namespace Infrastructure.Configuration;

public static class JsonConfiguration
{
    /// <summary>
    /// Shared JSON serializer options with camelCase naming policy.
    /// Used for Redis session serialization and HTTP responses.
    /// </summary>
    public static readonly JsonSerializerOptions CamelCaseOptions = new()
    {
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
        DictionaryKeyPolicy = JsonNamingPolicy.CamelCase,
    };
}
