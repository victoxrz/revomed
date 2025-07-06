using System.ComponentModel.DataAnnotations;

namespace Domain.Entities.Users;

public class Medic : User
{
    // This attributes don't work - ForeignKey
    //[ForeignKey(nameof(VisitTemplate))]
    public int TemplateId { get; set; }

    public VisitTemplate VisitTemplate { get; set; } = null!;
}