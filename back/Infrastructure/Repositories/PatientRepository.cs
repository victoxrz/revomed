using AppCore.Interfaces.Repository;
using Domain.Entities;
using Infrastructure.Data;
using Microsoft.Extensions.Logging;

namespace Infrastructure.Repositories
{
    public class PatientRepository : BaseRepository<Patient>, IPatientRepository
    {
        public PatientRepository(PostgresDbContext context, ILogger<BaseRepository<Patient>> logger /* TODO: idk if this template param */) : base(context)
        {
            //_Patientcontext = context ?? throw new ArgumentNullException($"the PacientiDbContext is null ${nameof(context)}");
        }

        public new async Task<bool> AddAsync(Patient entity)
        {
            var existingPatient = _context.Patients.FirstOrDefault(e => e.IDNP == entity.IDNP);
            if (existingPatient != null) return false;

            entity.DateAdded = DateTime.UtcNow;

            await base.AddAsync(entity);
            return true;
        }

        //public Task<IEnumerable<Patient>> GetAllAsync()
        //{
        //    throw new NotImplementedException();
        //}
    }
}