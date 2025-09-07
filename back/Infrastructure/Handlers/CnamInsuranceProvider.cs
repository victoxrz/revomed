using AppCore.Interfaces.Services;
using System.Text.Json;

namespace Infrastructure.Handlers;
public record InsuranceResponse(bool? Insured);

public class CnamInsuranceProvider : IInsuranceProvider
{
    private readonly HttpClient _httpClient;
    // TODO: consider using the same jsonSerializerOPtions as in the Program.cs
    private readonly JsonSerializerOptions _jsonOptions = new() { PropertyNamingPolicy = JsonNamingPolicy.CamelCase };

    public CnamInsuranceProvider(HttpClient httpClient)
    {
        _httpClient = httpClient;
    }

    public async Task<bool?> GetInsuranceStatusAsync(string IdnpOrInsuranceNumber, CancellationToken ct = default)
    {
        var response = await _httpClient.GetAsync($"/aoam/medic/{IdnpOrInsuranceNumber}", ct);
        if (!response.IsSuccessStatusCode) return null;

        await using var stream = await response.Content.ReadAsStreamAsync(ct);
        var data = await JsonSerializer.DeserializeAsync<InsuranceResponse>(stream, _jsonOptions, ct);
        return data?.Insured;
    }
}
