using AppCore.Interfaces.Repository;
using Domain.Entities.Visits;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Npgsql;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Text;
using System.Threading.Tasks;
using static QuestPDF.Helpers.Colors;

namespace Infrastructure.Repositories;
public class VisitSuggestionRepository : BaseRepository<VisitSuggestion>, IVisitSuggestionRepository
{
    public VisitSuggestionRepository(PostgresDbContext context) : base(context)
    {
    }

    // TODO: add index, try per word fuzzy match
    public IEnumerable<string> SearchByValueAsync(string value, int templateId, string titlePath, int limit = 10)
    {
        value = value.Normalize(NormalizationForm.FormD);

        return _context.Suggestions
            .Where(s => s.TitlePath == titlePath && s.TemplateId == templateId)
            .Select(s => new {
                Suggestion = s,
                IsPrefix = EF.Functions.ILike(EF.Functions.Unaccent(s.Value), value + "%"),
                Similarity = EF.Functions.TrigramsSimilarity(EF.Functions.Unaccent(s.Value), value)
            })
            .Where(x => x.IsPrefix || x.Similarity > 0.4)
            .OrderByDescending(x => x.IsPrefix)
            .ThenByDescending(x => x.Similarity)
            .Take(limit)
            .Select(x => x.Suggestion.Value).AsEnumerable();
    }


    // TODO: try catch, maybe use BulkExtensions, or another library for Upsert
    //UPDATE
    //SET "Popularity" = "Suggestions"."Popularity" + 1,
    //"UpdatedAt" = NOW()
    public async Task<bool> UpsertAsync(IEnumerable<VisitSuggestion> entities, CancellationToken ct = default)
    {
        foreach (var entity in entities)
        {
            await _context.Database.ExecuteSqlAsync($"""
                INSERT INTO "Suggestions" ("TemplateId", "TitlePath", "Value", "VisitId")
                VALUES ({entity.TemplateId}, {entity.TitlePath}, {entity.Value}, {entity.VisitId})
                ON CONFLICT ("TitlePath", "Value") DO NOTHING;
                """, ct);
        }

        return true;
    }
}
