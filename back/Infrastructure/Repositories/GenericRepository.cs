using AppCore.Interfaces.Repository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Infrastructure.BL;
using Microsoft.EntityFrameworkCore;
using Domain.Entities.Users;
using Microsoft.Extensions.Logging;
using Microsoft.EntityFrameworkCore.Metadata.Conventions;

namespace Infrastructure.Repositories
{
    public class GenericRepository<TEntity, IId> : IGenericRepository<TEntity, IId> where TEntity : class
    {
        private DbContext _context;
        private DbSet<TEntity>? _dbSet;
        private readonly ILogger<GenericRepository<TEntity, IId>> _logger;

        public GenericRepository(PacientiDbContext context, ILogger<GenericRepository<TEntity, IId>> logger)
        {
            this._context = context ?? throw new ArgumentNullException($"the PacientiDbContext is null ${nameof(context)}");
            this._dbSet = context.Set<TEntity>();
            this._logger = logger;
        }

        public async Task AddGeneric(TEntity entity)
        {
            if (_dbSet != null)
                await _dbSet.AddAsync(entity);
            else throw new NullReferenceException($"_dbSet is null");
        }

        public async Task<bool> DeletByIdGenericAsync(int Id)
        {
            try
            {
                if (_dbSet != null)
                {
                    var entityToDelete = await _dbSet.FindAsync(Id);
                    if (entityToDelete != null)
                    {
                        _dbSet.Remove(entityToDelete);
                        _logger.LogInformation($"Pacient with id {Id} was deleted successfully");
                        return true;
                    }
                }
                else throw new NullReferenceException($"_dbSet is null");
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error while deleting pacient {Id} {ex.Message}");
                throw ex;
            }
            return false;

        }



        public async Task<TEntity> GetEntityById(IId Id)
        {
            return await _dbSet.FindAsync(Id) ?? throw new NullReferenceException($"GetEntityById query returned null");
        }


        public async Task<IEnumerable<TEntity>> GetAllEntities()
        {
            return await _dbSet.ToListAsync() ?? throw new NullReferenceException($"GetAllEntities query returned null");
        }
    }
}
