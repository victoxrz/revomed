using AppCore.Interfaces.Repository;
using AppCore.Interfaces.Services;
using Domain.Entities;
using Infrastructure.Data;
using Microsoft.Extensions.Logging;

namespace Infrastructure.Repositories;

public class VisitRepository : BaseRepository<Visit>, IVisitRepository
{
    public VisitRepository(PostgresDbContext context, ILogger<BaseRepository<Visit>> logger /* TODO: idk if this template param */) : base(context)
    {
    }

    public new async Task<Result<bool>> AddAsync(Visit entity)
    {
        var existingPatient = _context.Patients.FirstOrDefault(e => e.Id == entity.PatientId);
        if (existingPatient == null) 
            return new(error: "Patient with this ID not found");

        var template = _context.Templates.FirstOrDefault(e => e.Id == entity.TemplateId);
        if (template?.Titles.Length != entity.Fields.Length) 
            return new(error: "Fields count does not match template titles count");

        entity.CreatedAt = DateTime.UtcNow;

        await base.AddAsync(entity);
        return new(data: true);
    }

    public IQueryable<Visit> GetByPatientId(int patientId)
    {
        return _context.Visits.Where(e => e.PatientId == patientId);
    }
}
