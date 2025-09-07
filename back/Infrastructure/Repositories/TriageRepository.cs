using AppCore.Interfaces;
using AppCore.Interfaces.Repository;
using Domain.Entities.Visits;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories;
public class TriageRepository : BaseRepository<Triage>, ITriageRepository
{
    public TriageRepository(PostgresDbContext context) : base(context)
    {
    }

    public new async Task<MightFail<bool>> AddAsync(Triage triage)
    {
        var exists = _context.Patients.Any(p => p.Id == triage.PatientId);
        if (!exists) return new(error: "Patient does not exist");

        await base.AddAsync(triage);
        return new(data: true);
    }

    public async Task<Triage?> GetByPatientId(int patientId, CancellationToken ct = default)
    {
        return await _context.Triages.Where(t => t.PatientId == patientId).OrderByDescending(e => e.CreatedAt).FirstOrDefaultAsync(ct);
    }
}
