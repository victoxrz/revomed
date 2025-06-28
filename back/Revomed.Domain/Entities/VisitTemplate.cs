using System.ComponentModel.DataAnnotations;

namespace Domain.Entities;

public class VisitTemplate
{
    [Key]
    public int Id { get; set; }

    //TODO: consider using gin/gist index on this column + pt_trgm
    // https://alexklibisz.com/2022/02/18/optimizing-postgres-trigram-search
    [StringLength(40)]
    public string Name { get; set; } = string.Empty;

    public string[] Titles { get; set; } = [];
}