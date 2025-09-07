using Domain.Entities.Visits;

namespace AppCore.Interfaces.Repository;

public interface IVisitTemplateRepository
{
    IQueryable<VisitTemplate> SearchByNameAsync(string name);
    IQueryable<VisitTemplate> GetAll();
    Task<VisitTemplate?> GetByIdAsync(int id, CancellationToken ct = default);
    Task<bool> UpdateAsync(VisitTemplate entity);
    Task<bool> AddAsync(VisitTemplate entity);
}
