using AppCore.Interfaces.Repository;
using Domain.Entities;
using Infrastructure.Data;
using Infrastructure.Identity;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories
{
    public class UserRepository : BaseRepository<User>, IUserRepository
    {
        private readonly HashProvider _hashProvider;
        public UserRepository(PostgresDbContext context, HashProvider hashProvider) : base(context)
        {
            _hashProvider = hashProvider;
        }

        public async Task<bool> LoginAsync(string email, string password)
        {
            var existingUser = await _context.Users.SingleOrDefaultAsync(e => e.Email == email);
            if (existingUser == null) return false;

            return _hashProvider.Verify(password, existingUser.Password);
        }

        public async Task<bool> SignupAsync(string email, string password)
        {
            var existingUser = await _context.Users.SingleOrDefaultAsync(e => e.Email == email);
            if (existingUser == null) return false;

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
