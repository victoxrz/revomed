using System.ComponentModel.DataAnnotations;

namespace Domain.Entities.Users;

public class Medic
{
    [Key]
    public int UserId { get; set; }

    // This attributes don't work - ForeignKey
    //[ForeignKey(nameof(VisitTemplate))]
    public int TemplateId { get; set; }

    public User User { get; set; } = null!;
    public VisitTemplate VisitTemplate { get; set; } = null!;
}