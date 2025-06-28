using Domain.Entities;

namespace AppCore.Interfaces.Repository;

public interface IVisitTemplateRepository
{
    IQueryable<VisitTemplate> SearchByNameAsync(string name);
    IQueryable<VisitTemplate> GetAll();
    Task<VisitTemplate?> GetByIdAsync(int id);
}
