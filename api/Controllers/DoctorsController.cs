using api.Data;
using api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
namespace api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DoctorsController : ControllerBase
{
    private readonly AppDbContext _context;

    public DoctorsController(AppDbContext context)
    {
        _context = context;
    }
    [HttpGet]
public async Task<IActionResult> GetAllDoctors()
{
    var doctors = await _context.Doctors.ToListAsync();
    return Ok(doctors);
}
    [HttpGet("{id}")]
    public async Task<IActionResult> GetDoctorById(int id)
    {
        var doctor = await _context.Doctors.FindAsync(id);
        if (doctor == null)
            return NotFound();

        return Ok(doctor);
    }

    [HttpPost]
    public async Task<IActionResult> AddDoctor(Doctor doctor)
    {
        _context.Doctors.Add(doctor);
        await _context.SaveChangesAsync();
        return Ok(doctor);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateDoctor(int id, Doctor doctor)
    {
        var existingDoctor = await _context.Doctors.FindAsync(id);
        if (existingDoctor == null)
            return NotFound();

        existingDoctor.Name = doctor.Name;
        existingDoctor.Specialization = doctor.Specialization;
        existingDoctor.Phone = doctor.Phone;
        existingDoctor.Email = doctor.Email;
        existingDoctor.Experience = doctor.Experience;

        await _context.SaveChangesAsync();
        return Ok(existingDoctor);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteDoctor(int id)
    {
        var doctor = await _context.Doctors.FindAsync(id);
        if (doctor == null)
            return NotFound();

        _context.Doctors.Remove(doctor);
        await _context.SaveChangesAsync();
        return Ok();
    }

    [HttpGet("count")]
    public async Task<IActionResult> GetDoctorsCount()
    {
        var count = await _context.Doctors.CountAsync();
        return Ok(count);
    }
}
