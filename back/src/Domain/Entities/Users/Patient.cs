using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Domain.Enums;

namespace Domain.Entities.Users;

public class Patient : User
{
    [StringLength(30)]
    public string? Patronymic { get; set; }

    [Column(TypeName = "smallint")]
    public Gender Gender { get; set; }

    //[Required]
    //public Lang Language { get; set; }

    //[Required]
    //public Curr Currency { get; set; }

    [Column(TypeName = "smallint")]
    public BloodType BloodType { get; set; }

    public DateOnly Birthday { get; set; }

    // UNIQUE, TODO: try implement custom attribute
    [StringLength(13, MinimumLength = 13)]
    public string Idnp { get; set; } = string.Empty;

    [StringLength(30)]
    public string Job { get; set; } = string.Empty;

    //[Required]
    //[StringLength(30)]
    //public string Citizenship { get; set; } = string.Empty;

    [StringLength(30)]
    public string StreetAddress { get; set; } = string.Empty;

    [StringLength(30)]
    public string Country { get; set; } = string.Empty;

    [StringLength(15)]
    public string Phone { get; set; } = string.Empty;

    [StringLength(15)]
    public string InsurancePolicy { get; set; } = string.Empty;

    //TODO: https://www.pollydocs.org/ for retrying if aoam.cnam.gov.md is not available
    public bool? IsInsured { get; set; }
}
