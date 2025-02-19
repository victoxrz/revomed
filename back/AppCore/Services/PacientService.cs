using AppCore.Contracts;
using AppCore.Interfaces.Services;
using AppCore.Interfaces.UnitOfwork;
using Domain.Entities.Users;
using Microsoft.Extensions.Logging;


namespace AppCore.Services
{
    public sealed class PacientService : IPacientService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly ILogger<PacientService> _logger;

        public PacientService(IUnitOfWork unitOfWork, ILogger<PacientService> logger)
        {
            _unitOfWork = unitOfWork ?? throw new ArgumentNullException("IUnitofWork is null ");
            _logger = logger ?? throw new ArgumentNullException("Logger is null");
        }

        public async Task<Pacient> AddPacientAsync(Pacient pacient)
        {

            await _unitOfWork.Pacienti.AddGeneric(pacient);
            await _unitOfWork.SaveChangesAsync();
            return pacient;

        }

        public async Task DeletePacientAsync(int Id)
        {
            await _unitOfWork.Pacienti.DeletByIdGenericAsync(Id);
            await _unitOfWork.SaveChangesAsync();
        }

        public async Task UpdatePacientByIdAsync(int Id, PacientRequest pacient)
        {
            try
            {

                var existingPacient = await _unitOfWork.Pacienti.GetEntityById(Id);
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

                await _unitOfWork.SaveChangesAsync();

            }
            catch (Exception ex)
            {
                _logger.LogError($"Error while updading pacient {Id} {ex.Message}");
            }
        }


        public async Task<Pacient> GetPacientByIdAsync(int id)
        {
            return await _unitOfWork.Pacienti.GetEntityById(id);
        }

        public async Task<IEnumerable<Pacient>> GetAllPacient()
        {
            return await _unitOfWork.Pacienti.GetAllEntities();
        }

    }
}
