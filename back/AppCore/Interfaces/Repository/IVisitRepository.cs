using Domain.Entities.Visits;

namespace AppCore.Interfaces.Repository;

public interface IVisitRepository
{
    Task<MightFail<bool>> AddAsync(Visit visit);
    // maybe not bool
    //Task<bool> DeleteAsync(Visit visit);
    Task<Visit?> GetByIdAsync(int id, CancellationToken ct);
    IQueryable<Visit> GetByPatientId(int id);
    IQueryable<Visit> GetById(int id);
    // maybe not bool
    //Task<bool> UpdateAsync(Visit visit);
    //IQueryable<Visit> GetAll();
}
