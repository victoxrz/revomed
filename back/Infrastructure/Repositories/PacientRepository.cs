using AppCore.Interfaces.Repository;
using Domain.Entities.Users;
using Infrastructure.BL;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Repositories
{
    public class PacientRepository: GenericRepository<Pacient>, IPacientRepository
    {
        private PacientiDbContext _Pacientcontext;

        public PacientRepository(PacientiDbContext context) : base(context) {  }
        
        public async Task<Pacient> GetPacientById(int Id)
        {
            return await _Pacientcontext.Patienti.FirstOrDefaultAsync(p => p.Id == Id) ?? throw new NullReferenceException("GetPacientById query returned null"); 
        }
    }
}
