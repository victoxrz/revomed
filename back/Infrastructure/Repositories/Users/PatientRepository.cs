using AppCore.Interfaces;
using AppCore.Interfaces.Repository;
using Domain.Entities.Users;
using Infrastructure.Data;
using Microsoft.Extensions.Logging;

namespace Infrastructure.Repositories.Users
{
    public class PatientRepository : BaseRepository<Patient>, IPatientRepository
    {
        public PatientRepository(PostgresDbContext context, ILogger<BaseRepository<Patient>> logger /* TODO: idk if this template param */) : base(context)
        {
            //_Patientcontext = context ?? throw new ArgumentNullException($"the PacientiDbContext is null ${nameof(context)}");
        }

        public new async Task<MightFail<bool>> AddAsync(Patient entity)
        {
            var exists = _context.Patients.Any(e => e.IDNP == entity.IDNP);
            if (exists) return new(error: "Patient with this IDNP already exists");

            entity.DateAdded = DateTime.UtcNow;

            await base.AddAsync(entity);
            return new(data: true);
        }

        public new async Task<MightFail<bool>> UpdateAsync(Patient entity)
        {
            var exists = _context.Patients.Any(e => e.IDNP == entity.IDNP && e.Id != entity.Id);
            if (exists) return new(error: "Patient with this IDNP already exists");

            entity.DateAdded = DateTime.UtcNow;

            await base.UpdateAsync(entity);
            return new(data: true);
        }
    }
}