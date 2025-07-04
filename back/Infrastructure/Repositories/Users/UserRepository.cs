using AppCore.Interfaces;
using AppCore.Interfaces.Repository;
using Domain.Entities.Users;
using Infrastructure.Data;
using Infrastructure.Identity;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories.Users
{
    // TODO: Refactor! including the endpoints that are using this
    public class UserRepository : BaseRepository<User>, IUserRepository
    {
        private readonly HashProvider _hashProvider;
        public UserRepository(PostgresDbContext context, HashProvider hashProvider) : base(context)
        {
            _hashProvider = hashProvider;
        }

        public IQueryable<User> FindByEmail(string email) => _context.Users.Where(e => e.Email == email);

        public async Task<bool> SignupAsync(string email, string password)
        {
            var exists = await _context.Users.AnyAsync(e => e.Email == email);
            if (exists) return false;

            _context.Users.Add(new User
            {
                Email = email,
                Password = _hashProvider.Hash(password)
            });

            await _context.SaveChangesAsync();
            return true;
        }
    }
}
