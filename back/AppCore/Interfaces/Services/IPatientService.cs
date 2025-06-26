using AppCore.Contracts;
using Domain.Entities;


namespace AppCore.Interfaces.Services
{
    // Implement Bussiness Rule / USE CASES
    public interface IPatientService
    {
        public Task<Patient> AddPacientAsync(Patient pacient);
        //public Task DeletePacientAsync(int Id);
        public Task UpdatePacientByIdAsync(int Id, PacientRequest pacint);
        public Task<Patient> GetPacientByIdAsync(int id);
        public Task<IEnumerable<Patient>> GetAllPacient();
    }
}
