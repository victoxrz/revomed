using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Domain.Entities.Visits;

public class VisitTemplate
{
    [Key]
    public int Id { get; set; }

    //TODO: consider using gin/gist index on this column + pt_trgm
    // https://alexklibisz.com/2022/02/18/optimizing-postgres-trigram-search
    [StringLength(40)]
    public string Name { get; set; } = string.Empty;

    [Column(TypeName = "jsonb")]
    public List<List<string>> Titles { get; set; } = [];

    public bool RequireTriage { get; set; }
}