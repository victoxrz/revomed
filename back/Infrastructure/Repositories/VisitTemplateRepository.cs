using AppCore.Interfaces.Repository;
using Domain.Entities;
using Infrastructure.Data;

namespace Infrastructure.Repositories;

public class VisitTemplateRepository : BaseRepository<VisitTemplate>, IVisitTemplateRepository
{
    public VisitTemplateRepository(PostgresDbContext context) : base(context)
    {
    }

    public IQueryable<VisitTemplate> SearchBySpecialtyAsync(string name)
    {
        name = name.ToLower();
        return _context.Templates.Where(e => e.MedicSpecialty.ToLower().Contains(name));
    }
}
