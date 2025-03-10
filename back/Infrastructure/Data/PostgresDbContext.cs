using Domain.Entities;
using Microsoft.EntityFrameworkCore;


namespace Infrastructure.Data
{
    public class PostgresDbContext : DbContext
    {
        public PostgresDbContext(DbContextOptions<PostgresDbContext> options) : base(options)
        {
        }

        public DbSet<Patient> Patients { get; set; }
        public DbSet<User> Users { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Patient>().HasIndex(e => e.IDNP).IsUnique();
        }
    }
}
