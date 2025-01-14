using AppCore.Interfaces.Repository;
using AppCore.Interfaces.UnitOfwork;
using Domain.Entities.Users;
using Infrastructure.BL;
using Microsoft.EntityFrameworkCore;
using Microsoft.Identity.Client;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Repositories
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly PacientiDbContext _context;

        public IPacientRepository Pacienti {get;}

        public UnitOfWork(PacientiDbContext context,  IPacientRepository pacienti) 
        {
            _context = context;
            Pacienti = pacienti;
        }

        public async Task SaveChangesAsync()
        {
            await _context.SaveChangesAsync();
        }
    }
}
