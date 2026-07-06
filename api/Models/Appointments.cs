using System.ComponentModel.DataAnnotations;

namespace api.Models;

public class Appointment
{
    [Key]
    public int Id { get; set; }

    // Foreign Keys
    public int PatientId { get; set; }
    public int DoctorId { get; set; }

    // Navigation Properties
    public Patient Patient { get; set; } = null!;
    public Doctor Doctor { get; set; } = null!;

    public DateTime AppointmentDate { get; set; }

    public string AppointmentTime { get; set; } = "";

    public string AppointmentType { get; set; } = "";

    public int DurationMinutes { get; set; }

    public string Status { get; set; } = "Scheduled";

    public string? ReasonForVisit { get; set; }

    public string? Notes { get; set; }
}