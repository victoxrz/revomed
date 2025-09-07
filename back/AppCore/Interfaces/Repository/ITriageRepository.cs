using Domain.Entities.Visits;

namespace AppCore.Interfaces.Repository;
public interface ITriageRepository
{
    Task<MightFail<bool>> AddAsync(Triage triage);
    //Task<Triage?> GetByIdAsync(int id);
    Task<Triage?> GetByPatientId(int patientId, CancellationToken ct);
}
