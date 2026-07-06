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
    [HttpPost]
    public async Task<IActionResult> AddAppointment(Appointment appointment)
    {
        _context.Appointments.Add(appointment);
        
        await _context.SaveChangesAsync();

        return Ok(appointment);
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
