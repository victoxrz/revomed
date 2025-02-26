using Domain.Entities;

namespace AppCore.Interfaces.Repository
{
    public interface IPatientRepository
    {
        Task AddAsync(Patient pacient);
        Task<bool> DeleteByIdAsync(int id);
        Task<Patient> GetByIdAsync(int id);
        Task<IEnumerable<Patient>> GetAllAsync();
    }
}
