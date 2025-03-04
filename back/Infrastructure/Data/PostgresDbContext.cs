using Domain.Entities;
using Microsoft.EntityFrameworkCore;


namespace Infrastructure.Data
{
    public class PostgresDbContext : DbContext
    {
        public PostgresDbContext(DbContextOptions<PostgresDbContext> options) : base(options)
        {
        }

        //public DbSet<Patient> Patients { get; set; }
        public DbSet<User> Users { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>(
                user =>
                {
                    user.HasKey(x => x.Id);
                    user.Property(x => x.Email).HasColumnType("varchar(40)").IsRequired();
                    user.Property(x => x.Password).HasColumnType("text").IsRequired();
                });
        }
    }
}
