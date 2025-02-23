using AppCore.Interfaces.Repository;
using Domain.Entities.Users;
using Infrastructure.BL;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Repositories
{
    public class PacientRepository : GenericRepository<Pacient, int>, IPacientRepository
    {
        private readonly PacientiDbContext _Pacientcontext;


        public PacientRepository(PacientiDbContext context, ILogger<GenericRepository<Pacient, int>> logger) : base(context, logger) 
        {
            _Pacientcontext = context ?? throw new ArgumentNullException($"the PacientiDbContext is null ${nameof(context)}");
        }
    }
}x`
