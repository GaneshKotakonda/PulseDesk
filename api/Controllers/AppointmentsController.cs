using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Data;
using api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
namespace api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AppointmentsController :ControllerBase
    {
        private readonly AppDbContext _context;

        public AppointmentsController(AppDbContext context)
        {
            _context=context;
        
        }
        [HttpGet]
        public async Task<IActionResult> GetAppointments()
        {
            var appointments = await _context.Appointments
            .Include(a=>a.Patient)
            .Include(a=>a.Doctor)
            .ToListAsync();
            return Ok(appointments);
        }
    [HttpGet("{id}")]
    public async Task<IActionResult> GetAppointmentById(int id)
    {
        var appointment = await _context.Appointments
            .Include(a=>a.Patient)
            .Include(a=>a.Doctor)
            .FirstOrDefaultAsync(a => a.Id == id);

        if (appointment == null)
            return NotFound();

        return Ok(appointment);
    }

    [HttpPost]
    public async Task<IActionResult> AddAppointment(AppointmentRequest request)
    {
        if (!await _context.Patients.AnyAsync(p => p.Id == request.PatientId))
            return BadRequest("Selected patient was not found.");

        if (!await _context.Doctors.AnyAsync(d => d.Id == request.DoctorId))
            return BadRequest("Selected doctor was not found.");

        var appointment = new Appointment
        {
            PatientId = request.PatientId,
            DoctorId = request.DoctorId,
            AppointmentDate = request.AppointmentDate,
            AppointmentTime = request.AppointmentTime,
            AppointmentType = request.AppointmentType,
            DurationMinutes = request.DurationMinutes,
            Status = string.IsNullOrWhiteSpace(request.Status) ? "Scheduled" : request.Status,
            ReasonForVisit = request.ReasonForVisit,
            Notes = request.Notes
        };

        _context.Appointments.Add(appointment);
        await _context.SaveChangesAsync();

        return Ok(appointment);
    }
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateAppointment(int id, AppointmentRequest appointment)
    {
        var existingAppointment = await _context.Appointments.FindAsync(id);
        if (existingAppointment == null)
            return NotFound();

        if (!await _context.Patients.AnyAsync(p => p.Id == appointment.PatientId))
            return BadRequest("Selected patient was not found.");

        if (!await _context.Doctors.AnyAsync(d => d.Id == appointment.DoctorId))
            return BadRequest("Selected doctor was not found.");

        existingAppointment.PatientId = appointment.PatientId;
        existingAppointment.DoctorId = appointment.DoctorId;
        existingAppointment.AppointmentDate = appointment.AppointmentDate;
        existingAppointment.AppointmentTime = appointment.AppointmentTime;
        existingAppointment.AppointmentType = appointment.AppointmentType;
        existingAppointment.DurationMinutes = appointment.DurationMinutes;
        existingAppointment.Status = appointment.Status;
        existingAppointment.ReasonForVisit = appointment.ReasonForVisit;
        existingAppointment.Notes = appointment.Notes;

        await _context.SaveChangesAsync();
        return Ok(existingAppointment);
    }

    public class AppointmentRequest
    {
        public int PatientId { get; set; }
        public int DoctorId { get; set; }
        public DateTime AppointmentDate { get; set; }
        public string AppointmentTime { get; set; } = "";
        public string AppointmentType { get; set; } = "";
        public int DurationMinutes { get; set; }
        public string Status { get; set; } = "Scheduled";
        public string? ReasonForVisit { get; set; }
        public string? Notes { get; set; }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteAppointment(int id)
    {
        var appointment = await _context.Appointments.FindAsync(id);
        if (appointment == null)
            return NotFound();

        _context.Appointments.Remove(appointment);
        await _context.SaveChangesAsync();
        return Ok();
    }

   [HttpGet("count")]
   public async Task<IActionResult> GetAppointmentsCount()
        {   var count = await _context.Appointments.CountAsync();

            return Ok(count);
        }  

        [HttpGet("recent")] 
        public async Task<IActionResult> GetRecentAppointments()
        {
            var appointments = await _context.Appointments
    .Include(a => a.Patient)
    .Include(a => a.Doctor)
    .OrderByDescending(a => a.AppointmentDate)
    .Take(5)
    .ToListAsync();

return Ok(appointments);
        }
    }
}
