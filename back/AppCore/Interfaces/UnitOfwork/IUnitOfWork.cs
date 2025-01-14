using AppCore.Interfaces.Repository;
using Domain.Entities.Users;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AppCore.Interfaces.UnitOfwork
{
    public interface IUnitOfWork
    {
        public IPacientRepository Pacienti { get; }


        Task SaveChangesAsync();
    }
}
