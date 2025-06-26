using AppCore.Interfaces.Services;
using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AppCore.Interfaces.Repository;

public interface IVisitTemplateRepository
{
    Task<VisitTemplate?> GetByIdAsync(int id);
}
