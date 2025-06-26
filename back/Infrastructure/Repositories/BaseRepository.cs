using Infrastructure.Data;

namespace Infrastructure.Repositories
{
    public abstract class BaseRepository<TEntity>(PostgresDbContext context) where TEntity : class
    {
        protected readonly PostgresDbContext _context = context;

        public async Task<bool> AddAsync(TEntity entity)
        {
            await _context.Set<TEntity>().AddAsync(entity);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteAsync(TEntity entity)
        {
            _context.Set<TEntity>().Remove(entity);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<TEntity?> GetByIdAsync(int id)
        {
            return await _context.Set<TEntity>().FindAsync(id);
        }

        public async Task<bool> UpdateAsync(TEntity entity)
        {
            _context.Set<TEntity>().Update(entity);
            await _context.SaveChangesAsync();

            return true;
        }

        public IQueryable<TEntity> GetAll()
        {
            return _context.Set<TEntity>();
        }
    }
}
