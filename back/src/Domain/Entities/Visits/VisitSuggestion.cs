namespace Domain.Entities.Visits;

// TODO: related https://github.com/medspacy/medspacy
public class VisitSuggestion
{
    public int Id { get; set; }

    // daca permit modificarea continutului vizitei de unde provine sugestia
    public int VisitId { get; set; }
    public Visit Visit { get; set; } = null!;

    public int TemplateId { get; set; }
    public string TitlePath { get; set; } = string.Empty;
    public string Value { get; set; } = string.Empty;
}
