using System.ComponentModel.DataAnnotations;

namespace Domain.Entities;

public class VisitTemplate
{
    [Key]
    public int Id { get; set; }

    [Required]
    public string[] Titles { get; set; } = [];
}
