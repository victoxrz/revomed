using Domain.Entities.Users;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AppCore.Interfaces.Repository
{
    public interface IGenericRepository<TEntity> where TEntity : class
    {
        public void AddGeneric(TEntity pacient);
        public Task DeletByIdGenericAsync(ushort Id);
    }
}
