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
            //_context = context;
            //_Patientcontext = context ?? throw new ArgumentNullException($"the PacientiDbContext is null ${nameof(context)}");
        }

        public override Task<bool> DeleteByIdAsync(int id)
        {
            throw new NotImplementedException();
        }

        public Task<IEnumerable<Patient>> GetAllAsync()
        {
            throw new NotImplementedException();
        }

        public Task<Patient> GetByIdAsync(int id)
        {
            throw new NotImplementedException();
        }
    }
}