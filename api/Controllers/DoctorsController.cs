using api.Data;
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

    [HttpGet("count")]
    public async Task<IActionResult> GetDoctorsCount()
    {
        var count = await _context.Doctors.CountAsync();
        return Ok(count);
    }
}
