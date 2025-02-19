﻿using Domain.Entities.Users;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AppCore.Interfaces.Repository
{
    public interface IPacientRepository : IGenericRepository<Pacient, int>
    {
        //Task<Pacient> GetPacientById(int Id);
    }
}
