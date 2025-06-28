using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Domain.Entities;

public class Visit
{
    [Key]
    public int Id { get; set; }

    [Required]
    [ForeignKey("Patient")]
    public int PatientId { get; set; }

    [Required]
    [ForeignKey("VisitTemplate")]
    public int TemplateId { get; set; }

    [Required]
    public string[] Fields { get; set; } = [];

    [Required]
    public DateTime CreatedAt { get; set; }
}
