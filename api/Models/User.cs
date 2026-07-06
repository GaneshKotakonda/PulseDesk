using System.ComponentModel.DataAnnotations;

namespace api.Models;

public class User
{
    [Key]
    public int Id { get; set; }

    public string FullName { get; set; } = "";
    public string Email { get; set; } = "";
    public string PhoneNumber { get; set; } = "";

    public string Role { get; set; } = "User";
    public string Status { get; set; } = "Active";
}