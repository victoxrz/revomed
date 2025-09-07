using AppCore.Interfaces;
using AppCore.Interfaces.Repository;
using AppCore.Interfaces.Services;
using Domain.Entities.Users;
using Infrastructure.Data;
using Microsoft.Extensions.Logging;

namespace Infrastructure.Repositories.Users
{
    public class PatientRepository : BaseRepository<Patient>, IPatientRepository
    {
        private readonly IInsuranceProvider _insuranceProvider;

        public PatientRepository(PostgresDbContext context, IInsuranceProvider provider, ILogger<BaseRepository<Patient>> logger /* TODO: idk if this template param */) : base(context)
        {
            //_Patientcontext = context ?? throw new ArgumentNullException($"the PacientiDbContext is null ${nameof(context)}");
            _insuranceProvider = provider;
        }

        public new async Task<MightFail<bool>> AddAsync(Patient entity)
        {
            var exists = _context.Patients.Any(e => e.Idnp == entity.Idnp);
            if (exists) return new(error: "Patient with this IDNP already exists");

            var isInsured = await _insuranceProvider.GetInsuranceStatusAsync(entity.InsurancePolicy);
            entity.IsInsured = isInsured;

            await base.AddAsync(entity);
            return new(data: true);
        }

        public new async Task<MightFail<bool>> UpdateAsync(Patient entity)
        {
            var exists = _context.Patients.Any(e => e.Idnp == entity.Idnp && e.Id != entity.Id);
            if (exists) return new(error: "Patient with this IDNP already exists");

            // TODO: short-circuit this maybe
            var isInsured = await _insuranceProvider.GetInsuranceStatusAsync(entity.InsurancePolicy);
            entity.IsInsured = isInsured;

            await base.UpdateAsync(entity);
            return new(data: true);
        }
    }
}