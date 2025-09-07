using Domain.Entities.Users;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Domain.Entities.Visits;
public class Triage : BaseEntity
{
    [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    public int PatientId { get; set; }

    // in Celsius
    public float Temperature { get; set; }

    // Systolic/Diastolic pressure in mmHg
    public int SystolicPressure { get; set; }

    public int DiastolicPressure { get; set; }

    public int HeartRate { get; set; }

    public int RespiratoryRate { get; set; }

    // in kg
    public float Weight { get; set; }

    // in cm
    public int Height { get; set; }

    // in cm
    public float WaistCircumference { get; set; }

    public Patient Patient { get; set; } = null!;
}
