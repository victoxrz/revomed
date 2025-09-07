using System.ComponentModel.DataAnnotations;

namespace Domain.Entities.Users;

public class Medic : User
{
    [Required]
    public string Specialty { get; set; } = string.Empty;
}