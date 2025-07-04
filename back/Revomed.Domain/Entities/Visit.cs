using System.ComponentModel.DataAnnotations;

namespace Domain.Entities;

public class Visit
{
    [Key]
    public int Id { get; set; }

    public int PatientId { get; set; }

    public int MedicId { get; set; }

    public int TemplateId { get; set; }

    public string[] Fields { get; set; } = [];

    public DateTime CreatedAt { get; set; }
    public VisitTemplate Template { get; set; } = null!;
}
