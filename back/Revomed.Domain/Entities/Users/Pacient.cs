using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
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
        [Display(Name = "Nume")]
        [StringLength(30, MinimumLength = 5, ErrorMessage = "Numele nu poate fi mai lung decat 30 de caractere si mai scurt decat 5.")]
        public string FirstName { get; set; } = string.Empty;

        [Required]
        [Display(Name = "Prenume")]
        [StringLength(30, MinimumLength = 5, ErrorMessage = "Prenumele nu poate fi mai lung de 30 decat caractere si mai scurt decat 5.")]
        public string LastName { get; set; } = string.Empty;

        [Required]
        [Display(Name = "IDNP")]
        [StringLength(13, ErrorMessage = "Prenumele nu poate fi mai lung de 30 decat caractere si mai scurt decat 5.")]
        public string IDNP { get; set; } = string.Empty;

        [Required]
        [Display(Name = "Genul pacientului")]
        [StringLength(1, ErrorMessage = "Umpleti campul cu valorile corespunzatoare")]
        public bool Sex { get; set; }

        [Required]
        [Display(Name = "Adresa pacientului")]
        [StringLength(30, MinimumLength = 10, ErrorMessage = "Umpleti campul cu valorile corespunzatoare")]
        public string StreetAdress = string.Empty;

        [Required]
        [Display(Name = "Tara pacientului")]
        [StringLength(30, MinimumLength = 10, ErrorMessage = "Umpleti campul cu valorile corespunzatoare")]
        public string Country { get; set; } = string.Empty;

        [Required]
        [Display(Name = "Numatul de telefon al pacientului")]
        public string Phone { get; set; } = string.Empty;

        public DateTime DateTime { get; set; }

    }
}   
