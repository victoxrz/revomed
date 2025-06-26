using AppCore.Interfaces.Repository;
using Domain.Entities;
using Infrastructure.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Repositories;

public class VisitTemplateRepository : BaseRepository<VisitTemplate>, IVisitTemplateRepository
{
    public VisitTemplateRepository(PostgresDbContext context) : base(context)
    {
    }
}
