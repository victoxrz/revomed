using AppCore.Contracts;
using AppCore.Interfaces.Repository;
using AppCore.Interfaces.Services;
using Domain.Entities;
using Infrastructure.Data;
using Microsoft.Extensions.Logging;

namespace Infrastructure.Services
{
    public sealed class PatientService : IPatientService
    {
        private readonly IPatientRepository _generic;
        private readonly ILogger<PatientService> _logger;
        private readonly PostgresDbContext _context;

        public PatientService(PostgresDbContext context, ILogger<PatientService> logger, IPatientRepository generic)
        {
            _logger = logger ?? throw new ArgumentNullException("Logger is null");
            _generic = generic ?? throw new ArgumentNullException("Generic Repository is null");
            _context = context ?? throw new ArgumentNullException("PostgresDbContext is null");
        }

        public async Task<Patient> AddPacientAsync(Patient pacient)
        {

            await _generic.AddAsync(pacient);
            return pacient;

        }

        public async Task DeletePacientAsync(int Id)
        {
            await _generic.DeleteByIdAsync(Id);
        }

        public async Task UpdatePacientByIdAsync(int Id, PacientRequest pacient)
        {
            try
            {

                var existingPacient = await _generic.GetByIdAsync(Id);
                if (existingPacient == null) throw new NullReferenceException($"Pacient with id {Id} was not found");

                existingPacient.Id = Id;
                existingPacient.FirstName = pacient.FirstName;
                existingPacient.LastName = pacient.LastName;
                existingPacient.IDNP = pacient.IDNP;
                existingPacient.Sex = pacient.Sex;
                existingPacient.Phone = pacient.Phone;
                existingPacient.StreetAdress = pacient.StreetAdress;
                existingPacient.Country = pacient.Country;
                existingPacient.DateTime = DateTime.Now;

                await _context.SaveChangesAsync();

            }
            catch (Exception ex)
            {
                _logger.LogError($"Error while updading pacient {Id} {ex.Message}");
            }
        }


        public async Task<Patient> GetPacientByIdAsync(int id)
        {
            return await _generic.GetByIdAsync(id);
        }

        public async Task<IEnumerable<Patient>> GetAllPacient()
        {
            return await _generic.GetAllAsync();
        }

    }
}
