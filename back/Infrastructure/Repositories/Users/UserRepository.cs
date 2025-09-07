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


        public IQueryable<User> FindByEmail(string email)
        {
            return _context.Users.Where(e => e.Email == email).AsNoTracking();
        }

        //public async Task<MightFail<User>> LoginAsync(string email, string password)
        //{
        //    var user = await FindByEmail(email).AsNoTracking().SingleOrDefaultAsync();
        //    if (user == null) return new(error: "The user was not found");

        //    if (!_hashProvider.Verify(password, user.Password)) return new(error: "Provided credentials are incorect");

        //    return new(data: user);
        //}

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

        // TODO: still under question, maybe ask on github
        public async Task<User?> UpdateAsync(User original, User modified)
        {
            _context.Entry(original).State = EntityState.Detached;

            //if (modified is Medic medic)
            //{
            //    var exists = _context.Templates.Any(e => e.Id == medic.TemplateId);
            //    if (!exists) return null;
            //}

            _context.Users.Update(modified);
            await _context.SaveChangesAsync();

            return original;
        }
    }
}
