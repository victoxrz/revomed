using AppCore.Interfaces.Repository;
using Domain.Entities;
using Infrastructure.Data;
using Infrastructure.Identity;
using Konscious.Security.Cryptography;
using System.Text;

namespace Infrastructure.Repositories
{
    public class UserRepository : BaseRepository<User>, IUserRepository
    {
        private readonly HashProvider _hashProvider;
        public UserRepository(PostgresDbContext context, HashProvider hashProvider) : base(context)
        {
            _hashProvider = hashProvider;
        }
        public override Task<bool> DeleteByIdAsync(int id)
        {
            throw new NotImplementedException();
        }

        public Task<bool> LoginAsync(string email, string password)
        {
            var existingUser = _context.Users.SingleOrDefault(e => e.Email == email); 
            if (existingUser == null) return Task.FromResult(false);

            return Task.FromResult(_hashProvider.Verify(password, existingUser.Password));
        }

        public async Task<bool> SignupAsync(string email, string password)
        {
            var existingUser = _context.Users.Where(e => e.Email == email);
            if (existingUser.Any()) return false;

            var hashedPassword = Convert.ToHexStringLower(_hashProvider.Hash(password));

            _context.Users.Add(new User {
                Email = email,
                Password = hashedPassword
            });

            await _context.SaveChangesAsync();
            return true;
        }
    }
}
