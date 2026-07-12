using api.Data;
using api.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PatientsController : ControllerBase
{
  private readonly AppDbContext _context;


public PatientsController(AppDbContext context)
{
    _context = context;
}

    [HttpGet]
    public async Task<IActionResult> GetAllPatients()
    {
        var patients = await _context.Patients.ToListAsync();
        return Ok(patients);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetPatientById(int id)
    {
        var patient = await _context.Patients.FindAsync(id);
        if (patient == null)
            return NotFound();

        return Ok(patient);
    }

    [HttpPost]
    public async Task<IActionResult> AddPatient(Patient patient)
    {
 _context.Patients.Add(patient);
await _context.SaveChangesAsync();

return Ok(patient); 
   }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdatePatient(int id, Patient patient)
    {
            var existingPatient = await _context.Patients.FindAsync(id) ;
        if (existingPatient == null)
        {
            return NotFound();
        }
    existingPatient.Name = patient.Name;
    existingPatient.Age = patient.Age;
    existingPatient.Gender = patient.Gender;
    existingPatient.Phone = patient.Phone;
    existingPatient.Disease = patient.Disease;
    await _context.SaveChangesAsync();
    return Ok(existingPatient);

    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeletePatient(int id)
    {
        var patient =await _context.Patients.FindAsync(id);
        if (patient == null)
    return NotFound();
    _context.Patients.Remove(patient);
    await _context.SaveChangesAsync();
    return Ok();

    }
    [HttpGet("count")]
    public async Task<IActionResult> GetPatientsCounnt()
    {
        var count = await _context.Patients.CountAsync();
            return Ok(count);

    }
}
