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
        public DbSet<Visit> Visits { get; set; }
        public DbSet<VisitTemplate> Templates { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Patient>().HasIndex(e => e.IDNP).IsUnique();

            modelBuilder.Entity<Visit>(e =>
            {
                e.HasOne<Patient>()
                    .WithMany()
                    .HasForeignKey(e => e.PatientId)
                    .OnDelete(DeleteBehavior.Cascade);
                e.HasOne<VisitTemplate>()
                    .WithMany()
                    .HasForeignKey(e => e.TemplateId)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            modelBuilder.Entity<VisitTemplate>(e =>
            {
                e.Property(e => e.Titles).HasColumnType("varchar(100)[]").IsRequired();
                e.HasIndex(e => e.Name).IsUnique();
                e.ToTable(t => t.HasCheckConstraint("CK_VisitTemplate_Name_NotEmpty", "char_length(\"Name\") >= 1"));
            });
        }
    }
}
