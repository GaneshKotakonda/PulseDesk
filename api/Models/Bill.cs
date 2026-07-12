using api.Models;
using Microsoft.AspNetCore.Mvc.ModelBinding.Validation;

public class Bill
{
    public int Id { get; set; }

    public int AppointmentId { get; set; }
    [ValidateNever]
    public Appointment Appointment { get; set; } = null!;

    public decimal Amount { get; set; }

    public DateTime BillDate { get; set; }

    public string PaymentStatus { get; set; } = "Pending";
}
