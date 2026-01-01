namespace AppCore.Interfaces.Services;

public interface IInsuranceProvider
{
    Task<bool?> GetInsuranceStatusAsync(string IdnpOrInsuranceNumber, CancellationToken ct = default);
}
