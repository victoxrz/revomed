using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Domain.Enums;

namespace Domain.Entities.Users;

public class User : BaseEntity
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    [Required]
    [StringLength(40)]
    public string Email { get; set; } = string.Empty;

    [StringLength(30, MinimumLength = 1)]
    public string FirstName { get; set; } = string.Empty;

    [StringLength(30, MinimumLength = 1)]
    public string LastName { get; set; } = string.Empty;

    [Required]
    [Column(TypeName = "text")]
    public string Password { get; set; } = string.Empty;

    [Column(TypeName = "smallint")]
    public UserRole UserRole { get; set; }
}
