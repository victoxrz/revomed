using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AppCore.Interfaces.Services;
using AppCore.Interfaces.UnitOfwork;
using Domain.Entities.Users;
namespace AppCore.Services
{
    internal class PacientService : IPacientService
    {
        private readonly IPacientService? _pacientService;

        private IUnitOfWork _unitOfWork;

        public PacientService(IPacientService pacientService, IUnitOfWork unitOfWork)
        {
            _pacientService = pacientService;
            _unitOfWork = unitOfWork;
        }

        public async Task AddPacientAsync(Pacient pacient)
        {
            _unitOfWork.Pacienti.AddGeneric(pacient);
            await _unitOfWork.SaveChangesAsync();
        }

        public async Task DeletePacientAsync(ushort Id)
        {
            await _unitOfWork.Pacienti.DeletByIdGenericAsync(Id);
            await _unitOfWork.SaveChangesAsync();
        }

    }
}
