using System.ComponentModel.DataAnnotations;

namespace api.Models;

public class Patient
{
    [Key]
    public int Id { get; set; }

    [Required]
    public string Name { get; set; } = "";

    public int Age { get; set; }

    public string Gender { get; set; } = "";

    public string Phone { get; set; } = "";

    public string Disease { get; set; } = "";
public ICollection<Appointment> Appointments { get; set; } = new List<Appointment>();

}