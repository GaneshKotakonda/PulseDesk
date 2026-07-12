using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using api.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BillController : ControllerBase
    {
        private readonly AppDbContext _context;

        public BillController(AppDbContext context)
        {
            _context=context;
        }
        
    [HttpGet]
    public async Task<IActionResult> GetBills()
        {   
            var bills = await  _context.Bills
            .Include(b=>b.Appointment)
            .ThenInclude(a=>a.Patient)
            .Include(b=>b.Appointment)
            .ThenInclude(a=>a.Doctor).ToListAsync();
            return Ok(bills);
        }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetBillById(int id)
        {
            var bill = await _context.Bills
            .Include(b=>b.Appointment)
            .ThenInclude(a=>a.Patient)
            .Include(b=>b.Appointment)
            .ThenInclude(a=>a.Doctor)
            .FirstOrDefaultAsync(b => b.Id == id);

            if (bill == null)
                return NotFound();

            return Ok(bill);
        }

    [HttpPost]
    public async Task<IActionResult> AddBill([FromBody] Bill bill)
        {
            bill.Appointment = null!;
            _context.Bills.Add(bill);
            await _context.SaveChangesAsync();
            return Ok(bill);
        }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateBill(int id, [FromBody] Bill bill)
        {
            var existingBill = await _context.Bills.FindAsync(id);
            if (existingBill == null)
                return NotFound();

            existingBill.AppointmentId = bill.AppointmentId;
            existingBill.Amount = bill.Amount;
            existingBill.BillDate = bill.BillDate;
            existingBill.PaymentStatus = bill.PaymentStatus;

            await _context.SaveChangesAsync();
            return Ok(existingBill);
        }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteBill(int id)
        {
            var bill = await _context.Bills.FindAsync(id);
            if (bill == null)
                return NotFound();

            _context.Bills.Remove(bill);
            await _context.SaveChangesAsync();
            return Ok();
        }

      
    }
}
