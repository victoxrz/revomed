using AppCore.Interfaces.Services;
using Domain.Entities;

namespace AppCore.Interfaces.Repository
{
    public interface IPatientRepository
    {
        Task<Result<bool>> AddAsync(Patient pacient);
        // maybe not bool
        Task<bool> DeleteAsync(Patient patient);
        Task<Patient?> GetByIdAsync(int id);
        // maybe not bool
        Task<bool> UpdateAsync(Patient patient);
        IQueryable<Patient> GetAll();
    }
}
