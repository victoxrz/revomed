using Domain.Entities.Users;

namespace AppCore.Interfaces.Repository;

public interface IMedicRepository
{
    IQueryable<Medic> FindByEmail(string email);
}
