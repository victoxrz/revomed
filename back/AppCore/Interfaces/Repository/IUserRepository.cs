namespace AppCore.Interfaces.Repository
{
    public interface IUserRepository
    {
        Task<bool> LoginAsync(string email, string password);
        Task<bool> SignupAsync(string email, string password);
    }
}
