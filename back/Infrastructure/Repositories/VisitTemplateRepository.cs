using AppCore.Interfaces.Repository;
using Domain.Entities;
using Infrastructure.Data;

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
}
