using Domain.Entities.Visits;

namespace AppCore.Interfaces.Services;

public interface IProcessVisitService
{
    Task ProcessAsync(Visit visit, CancellationToken ct = default);
}
