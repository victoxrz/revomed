using Domain.Entities.Visits;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AppCore.Interfaces.Repository;
public interface IVisitSuggestionRepository
{
    IEnumerable<string> SearchByValueAsync(string value, int templateId, string titlePath, int limit = 10);

    Task<bool> AddAsync(VisitSuggestion entity);

    /// <summary>
    /// Upsert exact normalized phrase(increment popularity) or insert if missing.
    /// </summary>
    Task<bool> UpsertAsync(IEnumerable<VisitSuggestion> entities, CancellationToken ct = default);
    //Task UpsertExactAsync(int templateId, string path, string value, CancellationToken ct = default);

    /// <summary>
    /// Optionally: try fuzzy-merge (pg_trgm). Returns true if merged/updated existing row.
    /// </summary>
    //Task<bool> TryMergeFuzzyAsync(int formId, string path, string normalizedValue, double threshold, CancellationToken ct = default);
}
