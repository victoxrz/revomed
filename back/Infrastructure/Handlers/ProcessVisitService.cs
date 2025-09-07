using AppCore.Interfaces.Repository;
using AppCore.Interfaces.Services;
using Domain.Entities.Visits;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Handlers;
public class ProcessVisitService : IProcessVisitService
{
    private readonly IVisitSuggestionRepository _repo;

    public ProcessVisitService(IVisitSuggestionRepository repo)
    {
        _repo = repo;
    }

    public async Task ProcessAsync(Visit visit, CancellationToken ct = default)
    {
        List<(string TitlePath, string Value)> suggestions = [];
        
        foreach (var (path, value) in visit.Fields)
        {
            var txt = value.Split([',', ';', '.'], StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries).ToHashSet();
            suggestions.AddRange(txt.Select(e => (path, e)));
        }

        await _repo.UpsertAsync(suggestions.Select(e => new VisitSuggestion()
        {
            Visit = visit,
            VisitId = visit.Id,
            TemplateId = visit.TemplateId,
            TitlePath = e.TitlePath,
            Value = e.Value
        }), ct);
    }
}
