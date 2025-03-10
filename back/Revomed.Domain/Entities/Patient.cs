using Domain.Enums;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

//nu trebie sa lasam doar demunirea pentru class poject ca Domain, sau infrastructure, treb sa file Revomed.Domain etc., asa este mai explicit.
namespace Domain.Entities
{
    public sealed class Patient
    {

        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required]
        [StringLength(30, MinimumLength = 1)]
        public string FirstName { get; set; } = string.Empty;

        [Required]
        [StringLength(30)]
        public string LastName { get; set; } = string.Empty;

        [Required]
        [StringLength(30)]
        public string Patronymic { get; set; } = string.Empty;

        [Required]
        [Column(TypeName = "smallint")]
        public Gender Gender { get; set; }

        //[Required]
        //public Lang Language { get; set; }

        //[Required]
        //public Curr Currency { get; set; }

        [Required]
        [Column(TypeName = "smallint")]
        public BloodType BloodType { get; set; }

        [Required]
        public DateOnly Birthday { get; set; }

        // UNIQUE, TODO: try implement custom attribute
        [Required]
        [StringLength(13, MinimumLength = 13)]
        public string IDNP { get; set; } = string.Empty;

        [StringLength(30)]
        public string Job { get; set; } = string.Empty;

        //[Required]
        //[StringLength(30)]
        //public string Citizenship { get; set; } = string.Empty;

        [Required]
        [StringLength(30)]
        public string StreetAddress { get; set; } = string.Empty;

        [Required]
        [StringLength(30)]
        public string Country { get; set; } = string.Empty;

        [Required]
        [StringLength(15)]
        public string Phone { get; set; } = string.Empty;

        [Required]
        public DateTime DateAdded { get; set; }
    }
}
