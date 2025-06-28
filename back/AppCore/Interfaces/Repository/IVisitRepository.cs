using Domain.Entities;

namespace AppCore.Interfaces.Repository;

public interface IVisitRepository
{
    Task<MightFail<bool>> AddAsync(Visit visit);
    // maybe not bool
    //Task<bool> DeleteAsync(Visit visit);
    Task<Visit?> GetByIdAsync(int id);
    IQueryable<Visit> GetByPatientId(int id);
    // maybe not bool
    //Task<bool> UpdateAsync(Visit visit);
    //IQueryable<Visit> GetAll();
}
