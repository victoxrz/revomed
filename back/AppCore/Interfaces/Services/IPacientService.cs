using AppCore.Contracts;
using Domain.Entities.Users;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


namespace AppCore.Interfaces.Services
{
    // Implement Bussiness Rule / USE CASES
    public interface IPacientService
    {
        public Task<Pacient> AddPacientAsync(Pacient pacient);
        public Task DeletePacientAsync(int Id);
        public Task UpdatePacientByIdAsync(int Id, PacientRequest pacint);
        public Task<Pacient> GetPacientByIdAsync(int id);
        public Task<IEnumerable<Pacient>> GetAllPacient();
    }
}
