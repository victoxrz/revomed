using Domain.Entities;
using Domain.Entities.Users;
using Domain.Enums;
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
        public DbSet<Medic> Medics { get; set; }
        public DbSet<Visit> Visits { get; set; }
        public DbSet<VisitTemplate> Templates { get; set; }

        //protected override void ConfigureConventions(ModelConfigurationBuilder configurationBuilder)
        //{
        //    configurationBuilder.Conventions.Remove<ForeignKeyIndexConvention>();
        //    base.ConfigureConventions(configurationBuilder);
        //}

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<VisitTemplate>(e =>
            {
                e.HasIndex(e => e.MedicSpecialty).IsUnique();
                e.ToTable(t => t.HasCheckConstraint("CK_VisitTemplate_Name_NotEmpty", "char_length(\"Name\") >= 1"));
            });
            
            modelBuilder.Entity<Patient>().HasIndex(e => e.IDNP).IsUnique();
            
            modelBuilder.Entity<User>()
                .UseTphMappingStrategy()
                .HasDiscriminator(e => e.UserRole)
                .HasValue<User>(UserRole.Patient)
                .HasValue<Medic>(UserRole.Medic);

            modelBuilder.Entity<Medic>()
                .HasOne(e => e.VisitTemplate)
                .WithMany()
                .HasForeignKey(e => e.TemplateId)
                .OnDelete(DeleteBehavior.NoAction);

            modelBuilder.Entity<Visit>(e =>
            {
                e.HasOne<Patient>()
                    .WithMany()
                    .HasForeignKey(e => e.PatientId)
                    .OnDelete(DeleteBehavior.NoAction)
                    .IsRequired();

                e.HasOne(e => e.Template)
                    .WithMany()
                    .HasForeignKey(e => e.TemplateId)
                    .OnDelete(DeleteBehavior.Restrict)
                    .IsRequired();
            });
        }
    }
}
