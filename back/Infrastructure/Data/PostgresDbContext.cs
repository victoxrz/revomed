using Domain.Entities;
using Domain.Entities.Users;
using Domain.Entities.Visits;
using Domain.Enums;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;

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
        public DbSet<Triage> Triages { get; set; }
        public DbSet<VisitTemplate> Templates { get; set; }
        public DbSet<VisitSuggestion> Suggestions { get; set; }

        //protected override void ConfigureConventions(ModelConfigurationBuilder configurationBuilder)
        //{
        //    configurationBuilder.Conventions.Remove<ForeignKeyIndexConvention>();
        //    base.ConfigureConventions(configurationBuilder);
        //}


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.HasPostgresExtension("pg_trgm");
            modelBuilder.HasPostgresExtension("unaccent");

            modelBuilder.Entity<VisitTemplate>(e =>
            {
                e.HasIndex(e => e.Name).IsUnique();
                e.ToTable(t => t.HasCheckConstraint("CK_VisitTemplate_Name_NotEmpty", "char_length(\"Name\") >= 1"));
            });

            modelBuilder.Entity<Patient>().HasIndex(e => e.Idnp).IsUnique();

            modelBuilder.Entity<User>()
                .UseTphMappingStrategy()
                .HasDiscriminator(e => e.UserRole)
                .HasValue<User>(UserRole.Patient)
                .HasValue<Medic>(UserRole.Medic);

            modelBuilder.Entity<Visit>(e =>
            {
                e.HasOne(e => e.Patient)
                    .WithMany()
                    .HasForeignKey(e => e.PatientId)
                    .OnDelete(DeleteBehavior.NoAction)
                    .IsRequired();

                e.HasOne(e => e.Medic)
                    .WithMany()
                    .HasForeignKey(e => e.MedicId)
                    .OnDelete(DeleteBehavior.NoAction)
                    .IsRequired();

                e.HasOne(e => e.Template)
                    .WithMany()
                    .HasForeignKey(e => e.TemplateId)
                    .OnDelete(DeleteBehavior.Restrict)
                    .IsRequired();

                e.HasOne(e => e.Triage)
                    .WithMany()
                    .HasForeignKey(e => e.TriageId)
                    .OnDelete(DeleteBehavior.Restrict)
                    .IsRequired(false);
            });

            modelBuilder.Entity<VisitSuggestion>(e =>
            {
                e.HasOne(e => e.Visit)
                    .WithMany()
                    .HasForeignKey(e => e.VisitId)
                    .OnDelete(DeleteBehavior.Cascade)
                    .IsRequired();

                e.HasOne<VisitTemplate>()
                    .WithMany()
                    .HasForeignKey(e => e.TemplateId)
                    .OnDelete(DeleteBehavior.Cascade)
                    .IsRequired();

                e.HasIndex(e => new { e.TitlePath, e.Value }).IsUnique();
            });
        }

        private void UpdateTimestamps()
        {
            var entries = ChangeTracker.Entries<BaseEntity>();

            foreach (var e in entries)
            {
                if (e.State == EntityState.Added)
                {
                    var now = DateTime.UtcNow;
                    e.Entity.CreatedAt = now;
                    e.Entity.UpdatedAt = now;
                }

                if (e.State == EntityState.Modified)
                    e.Entity.UpdatedAt = DateTime.UtcNow;
            }
        }

        public override int SaveChanges()
        {
            UpdateTimestamps();
            return base.SaveChanges();
        }

        public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            UpdateTimestamps();
            return base.SaveChangesAsync(cancellationToken);
        }
    }
}
