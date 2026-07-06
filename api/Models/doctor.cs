using System.ComponentModel.DataAnnotations;

namespace api.Models;

public class Doctor
{
    [Key]
    public int Id { get; set; }

    [Required]
    public string Name { get; set; } = "";

    [Required]
    public string Specialization { get; set; } = "";

    public string Phone { get; set; } = "";

    public string Email { get; set; } = "";

    public int Experience { get; set; }

    // Navigation Property
    public ICollection<Appointment> Appointments { get; set; } = new List<Appointment>();
}