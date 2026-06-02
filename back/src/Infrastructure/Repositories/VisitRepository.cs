using AppCore.Interfaces;
using AppCore.Interfaces.Repository;
using AppCore.Interfaces.Services;
using Domain.Entities.Visits;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Infrastructure.Repositories;

public class VisitRepository : BaseRepository<Visit>, IVisitRepository
{
    private readonly IProcessVisitService _svc;

    public VisitRepository(PostgresDbContext context, IProcessVisitService svc)
        : base(context)
    {
        _svc = svc;
    }

    public new async Task<MightFail<bool>> AddAsync(Visit entity)
    {
        // TODO: test performance of this query, compared to multiple queries
        var data = await _context
            .Templates.Where(e => e.Id == entity.TemplateId)
            .Select(e => new
            {
                Template = e,
                PatientExists = _context.Patients.Any(p => p.Id == entity.PatientId),
            })
            .AsNoTracking()
            .SingleOrDefaultAsync();

        if (data?.Template == null)
            return new(error: "Template with this ID not found");

        if (!data.PatientExists)
            return new(error: "Patient with this ID not found");

        if (!entity.FollowsTemplate(data.Template))
            return new(error: "Visit does not follow the template");

        if (data.Template.RequireTriage)
        {
            var triage = await _context
                .Triages.Where(e => e.PatientId == entity.PatientId)
                .OrderByDescending(e => e.UpdatedAt)
                .FirstOrDefaultAsync();
            //  || (DateTime.UtcNow - triage.CreatedAt).TotalDays > 1
            if (triage == null)
                return new(error: "No valid triage was found");

            entity.TriageId = triage.Id;
        }

        await base.AddAsync(entity);
        await _svc.ProcessAsync(entity);

        return new(data: true);
    }

    public IQueryable<Visit> GetByPatientId(int patientId)
    {
        return _context.Visits.Where(e => e.PatientId == patientId);
    }

    public IQueryable<Visit> GetById(int id) => _context.Visits.Where(e => e.Id == id);
}
