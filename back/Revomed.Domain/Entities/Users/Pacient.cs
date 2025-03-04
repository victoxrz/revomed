using Domain.Enum;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Reflection.Metadata;
using System.Text;
using System.Threading.Tasks;
//nu trebie sa lasam doar demunirea pentru class poject ca Domain, sau infrastructure, treb sa file Revomed.Domain etc., asa este mai explicit.
namespace Domain.Entities.Users
{
    public sealed class Pacient
    {

        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required]
        [StringLength(30, MinimumLength = 5, ErrorMessage = "Numele nu poate fi mai lung decat 30 de caractere si mai scurt decat 5.")]
        public string FirstName { get; set; } = string.Empty;

        [Required]
        [StringLength(30, MinimumLength = 5, ErrorMessage = "Prenumele nu poate fi mai lung de 30 decat caractere si mai scurt decat 5.")]
        public string LastName { get; set; } = string.Empty;

        [Required]
        [StringLength(30, MinimumLength = 5, ErrorMessage = "Prenumele nu poate fi mai lung de 30 decat caractere si mai scurt decat 5.")]
        public string Patronymic { get; set; } = string.Empty;

        [Required]
        [StringLength(1, ErrorMessage = "Umpleti campul cu valorile corespunzatoare")]
        public Gender Gender { get; set; }

        [Required]
        [StringLength(1, ErrorMessage = "Umpleti campul cu valorile corespunzatoare")]
        public Lang Language { get; set; }

        [Required]
        [StringLength(1, ErrorMessage = "Umpleti campul cu valorile corespunzatoare")]
        public Curr Currency { get; set; }

        [Required]
        [StringLength(1, ErrorMessage = "Umpleti campul cu valorile corespunzatoare")]
        public BT Blood { get; set; }


        [Required]
        [StringLength(13, ErrorMessage = "IDNP trebuie sa fie exact 13 caractere")]
        public string IDNP { get; set; } = string.Empty;

        [StringLength(50, ErrorMessage = "Campul dat nu trebuie sa fie mai depaseasca limita de 50 caractere")]
        public string Profession { get; set; } = string.Empty;

        [Required]
        [StringLength(50, ErrorMessage = "Campul dat nu trebuie sa fie mai depaseasca limita de 50 caractere")]
        public string Citizenship { get; set; } = string.Empty;
     
        [Required]
        [StringLength(30, MinimumLength = 10, ErrorMessage = "Umpleti campul cu valorile corespunzatoare")]
        public string StreetAddress { get; set; } = string.Empty;

        [Required]
        [StringLength(30, MinimumLength = 10, ErrorMessage = "Umpleti campul cu valorile corespunzatoare")]
        public string Country { get; set; } = string.Empty;

        [Required]
        public string Phone { get; set; } = string.Empty;

        public DateTime DateTime { get; set; }  

    }
}
