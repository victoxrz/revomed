using AppCore.Interfaces.Repository;
using Domain.Entities.Users;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories.Users;
public class MedicRepository : BaseRepository<Medic>, IMedicRepository
{
    public MedicRepository(PostgresDbContext context) : base(context)
    {

    }

    public Task<Medic?> FindByEmailAsync(string email)
    {
        return _context.Medics.Include(e => e.User).SingleOrDefaultAsync(e => e.User.Email == email);
    }
}
