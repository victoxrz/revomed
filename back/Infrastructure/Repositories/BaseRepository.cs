using Infrastructure.Data;

namespace Infrastructure.Repositories
{
    public abstract class BaseRepository<TEntity>(PostgresDbContext context) where TEntity : class
    {
        protected readonly PostgresDbContext _context = context;

        public async Task AddAsync(TEntity entity)
        {
            await _context.Set<TEntity>().AddAsync(entity);
        }
        public abstract Task<bool> DeleteByIdAsync(int id);
        //public Task<TEntity> GetByIdAsync(int id);
        //public Task<IEnumerable<TEntity>> GetAllAsync();
    }
}
