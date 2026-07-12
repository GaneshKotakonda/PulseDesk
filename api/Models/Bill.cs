using api.Models;

public class Bill
{
    public int Id { get; set; }

    public int AppointmentId { get; set; }
    public Appointment Appointment { get; set; } = null!;

    public decimal Amount { get; set; }

    public DateTime BillDate { get; set; }

    public string PaymentStatus { get; set; } = "Pending";
}