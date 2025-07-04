using Domain.Entities.Users;

namespace AppCore.Interfaces.Repository;
public interface IMedicRepository
{
    Task<Medic?> FindByEmailAsync(string email);
}
