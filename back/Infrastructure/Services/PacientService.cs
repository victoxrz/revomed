using AppCore.Contracts;
using AppCore.Interfaces.Repository;
using AppCore.Interfaces.Services;
using Domain.Entities.Users;
using Microsoft.Extensions.Logging;
using Infrastructure.BL;

namespace AppCore.Services
{
    public sealed class PacientService : IPacientService
    {
        private readonly IGenericRepository<Pacient, int> _generic;
        private readonly ILogger<PacientService> _logger;
        private readonly PacientiDbContext _context;

        public PacientService(PacientiDbContext context, ILogger<PacientService> logger, IGenericRepository<Pacient, int> generic)
        {
            _logger = logger ?? throw new ArgumentNullException("Logger is null");
            _generic = generic ?? throw new ArgumentNullException("Generic Repository is null");
            _context = context ?? throw new ArgumentNullException("PacientiDbContext is null");
        }   

        public async Task<Pacient> AddPacientAsync(Pacient pacient)
        {

            await _generic.AddGeneric(pacient);
            return pacient;

        }

        public async Task DeletePacientAsync(int Id)
        {
            await _generic.DeletByIdGenericAsync(Id);
        }

        public async Task UpdatePacientByIdAsync(int Id, PacientRequest pacient)
        {
            try
            {

                var existingPacient = await _generic.GetEntityById(Id);
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


        public async Task<Pacient> GetPacientByIdAsync(int id)
        {
            return await _generic.GetEntityById(id);
        }

        public async Task<IEnumerable<Pacient>> GetAllPacient()
        {
            return await _generic.GetAllEntities();
        }

    }
}
