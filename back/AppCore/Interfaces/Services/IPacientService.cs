using Domain.Entities.Users;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


namespace AppCore.Interfaces.Services
{
    // Implement Bussiness Rule / USE CASES
    internal interface IPacientService
    {
        Task AddPacientAsync(Pacient pacient);
        Task DeletePacientAsync(ushort Id);
    }
}
