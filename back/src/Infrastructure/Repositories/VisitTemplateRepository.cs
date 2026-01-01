using AppCore.Interfaces.Repository;
using Domain.Entities.Visits;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories;

public class VisitTemplateRepository : BaseRepository<VisitTemplate>, IVisitTemplateRepository
{
    public VisitTemplateRepository(PostgresDbContext context) : base(context)
    {
    }

    public IQueryable<VisitTemplate> SearchByNameAsync(string name)
    {
        name = name.ToLower();
        return _context.Templates.Where(e => e.Name.ToLower().Contains(name));
    }

    public new async Task<bool> AddAsync(VisitTemplate entity)
    {
        var exists = await _context.Templates.AnyAsync(e => e.Name == entity.Name);
        if (exists) return false;

        return await base.AddAsync(entity);
    }

    public new async Task<bool> UpdateAsync(VisitTemplate entity)
    {
        var isUsed = await _context.Visits.AnyAsync(e => e.TemplateId == entity.Id);
        if (isUsed) return false;

        return await base.UpdateAsync(entity);
    }
}
