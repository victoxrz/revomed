using AppCore.Interfaces.Repository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


using Infrastructure.BL;
using Microsoft.EntityFrameworkCore;
using Domain.Entities.Users;

namespace Infrastructure.Repositories
{
    public class GenericRepository<TEntity>:IGenericRepository<TEntity> where TEntity : class
    {
        private DbContext _context;
        private DbSet<TEntity>? _dbSet;

        public GenericRepository(PacientiDbContext context)
        {
            this._context = context ?? throw new ArgumentNullException(nameof(context));
            this._dbSet = context.Set<TEntity>();
        }

        public void AddGeneric(TEntity pacient)
        {
            _dbSet.Add(pacient);
        }

        public async Task DeletByIdGenericAsync(ushort Id)
        {
            var entityToDelete = await _dbSet.FindAsync(Id);
            if(entityToDelete != null)
            {
                _dbSet.Remove(entityToDelete);                
            }
        }
    }
}
