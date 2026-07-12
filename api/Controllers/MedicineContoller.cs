using api.Data;
using api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace api.Controllers;

[Route("api/[controller]")]
[ApiController]
public class MedicinesController : ControllerBase
{
    private readonly AppDbContext _context;

    public MedicinesController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetMedicines()
    {
        var medicines = await _context.Medicines.ToListAsync();
        return Ok(medicines);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetMedicineById(int id)
    {
        var medicine = await _context.Medicines.FindAsync(id);
        if (medicine == null)
            return NotFound();

        return Ok(medicine);
    }

    [HttpPost]
    public async Task<IActionResult> AddMedicine(Medicine medicine)
    {
        _context.Medicines.Add(medicine);
        await _context.SaveChangesAsync();
        return Ok(medicine);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateMedicine(int id, Medicine medicine)
    {
        var existingMedicine = await _context.Medicines.FindAsync(id);
        if (existingMedicine == null)
            return NotFound();

        existingMedicine.name = medicine.name;
        existingMedicine.Category = medicine.Category;
        existingMedicine.Stock = medicine.Stock;
        existingMedicine.Price = medicine.Price;

        await _context.SaveChangesAsync();
        return Ok(existingMedicine);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteMedicine(int id)
    {
        var medicine = await _context.Medicines.FindAsync(id);
        if (medicine == null)
            return NotFound();

        _context.Medicines.Remove(medicine);
        await _context.SaveChangesAsync();
        return Ok();
    }
}
