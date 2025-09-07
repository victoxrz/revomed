using Domain.Entities.Visits;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AppCore.Interfaces.Services;
public interface IProcessVisitService
{
    Task ProcessAsync(Visit visit, CancellationToken ct = default);
}
