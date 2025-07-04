using Domain.Entities.Users;

namespace AppCore.Interfaces.Repository
{
    public interface IPatientRepository
    {
        Task<MightFail<bool>> AddAsync(Patient pacient);
        // maybe not bool
        Task<bool> DeleteAsync(Patient patient);
        Task<Patient?> GetByIdAsync(int id);
        // maybe not bool
        Task<MightFail<bool>> UpdateAsync(Patient patient);
        IQueryable<Patient> GetAll();
    }
}
