using AppCore.Interfaces.Repository;
using AppCore.Interfaces.Services;
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

        public new async Task<Result<bool>> AddAsync(Patient entity)
        {
            var existingPatient = _context.Patients.FirstOrDefault(e => e.IDNP == entity.IDNP);
            if (existingPatient != null) return new(error: "Patient with this IDNP already exists")

            entity.DateAdded = DateTime.UtcNow;

            await base.AddAsync(entity);
            return new(data: true);
        }

        //public Task<IEnumerable<Patient>> GetAllAsync()
        //{
        //    throw new NotImplementedException();
        //}
    }
}