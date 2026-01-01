using AppCore.Interfaces.Repository;
using Domain.Entities.Users;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories.Users;

public class MedicRepository : BaseRepository<Medic>, IMedicRepository
{
    public MedicRepository(PostgresDbContext context)
        : base(context) { }

    /// <summary>
    /// Assumes no tracking
    /// </summary>
    /// <param name="email"></param>
    /// <returns></returns>
    public IQueryable<Medic> FindByEmail(string email)
    {
        return _context.Medics.Where(e => e.Email == email).AsNoTracking();
    }
}
