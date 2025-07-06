using Domain.Entities.Users;

namespace AppCore.Interfaces.Repository
{
    public interface IUserRepository
    {
        //Task<MightFail<User>> LoginAsync(string email, string password);
        Task<bool> SignupAsync(string email, string password);

        /// <summary>
        /// Assumes no tracking
        /// </summary>
        /// <param name="email"></param>
        /// <returns></returns>
        IQueryable<User> FindByEmail(string email);
        //Task<bool> UpdateAsync(User entity);
        Task<User?> GetByIdAsync(int id);
        Task<User?> UpdateAsync(User original, User modified);
    }
}
