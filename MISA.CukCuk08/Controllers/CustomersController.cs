using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MISA.CukCuk08.Models;

namespace MISA.CukCuk08.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CustomersController : ControllerBase
    {
        private readonly CustomerdbContext _context;

        public CustomersController(CustomerdbContext context)
        {
            _context = context;
        }

        // GET: api/Customers
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Customer>>> GetCustomer()
        {
            var customer = await _context.Customer.OrderBy(c => c.CustomerCode).ToListAsync();
            return customer;
        }

        // GET: api/Customers
        [HttpGet("{CustomerID}")]
        public async Task<ActionResult<Customer>> GetCustomer(Guid CustomerID)
        {
            var customer = await _context.Customer.FindAsync(CustomerID);

            if (customer == null)
            {
                return NotFound();
            }

            return customer;
        }

        /// <summary>
        /// Hàm để tìm kiếm theo 1 trường trong DB
        /// </summary>
        /// <param name="key"></param>
        /// <param name="filter"></param>
        /// <returns></returns>
        // GET: api/Customers
        [HttpGet("{key}/{filter}")]
        public async Task<ActionResult<IEnumerable<Customer>>> GetCustomer(int key, string filter)
        {
            List<Customer> res = new List<Customer>();
            var customer = await _context.Customer.ToListAsync();

            if (filter == "NullValueException") return customer;

            switch (key)
            {
                case 0:
                    // Tìm theo CustomerCode
                    foreach (var item in customer)
                    {
                        if (item.CustomerCode.Contains(filter))
                        {
                            res.Add(item);
                        }
                    }
                    break;
                case 1:
                    // Tìm theo CustomerName
                    foreach (var item in customer)
                    {
                        if (item.CustomerName.Contains(filter))
                        {
                            res.Add(item);
                        }
                    }
                    break;
                case 2:
                    // Tìm theo CompanyName
                    foreach (var item in customer)
                    {
                        if (item.CompanyName.Contains(filter))
                        {
                            res.Add(item);
                        }
                    }
                    break;
                case 4:
                    // Tìm theo Address
                    foreach (var item in customer)
                    {
                        if (item.Address.Contains(filter))
                        {
                            res.Add(item);
                        }
                    }
                    break;
                case 5:
                    // Tìm theo PhoneNumber
                    foreach (var item in customer)
                    {
                        if (item.PhoneNumber.Contains(filter))
                        {
                            res.Add(item);
                        }
                    }
                    break;
                case 6:
                    // Tìm theo Email
                    foreach (var item in customer)
                    {
                        if (item.Email.Contains(filter))
                        {
                            res.Add(item);
                        }
                    }
                    break;
            }

            if (res == null)
            {
                return NotFound();
            }

            return res;
        }

        // PUT: api/Customers/5
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPut("{CustomerID}")]
        public async Task<IActionResult> PutCustomer(Guid CustomerID, [FromBody] Customer customer)
        {
            if (CustomerID != customer.CustomerId)
            {
                return BadRequest();
            }

            _context.Entry(customer).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CustomerExists(CustomerID))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Customers
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPost]
        public async Task<ActionResult<Customer>> PostCustomer([FromBody] Customer customer)
        {
            customer.CustomerId = Guid.NewGuid();
            _context.Customer.Add(customer);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetCustomer", new { id = customer.CustomerId }, customer);
        }

        // POST: api/Customers
        [HttpPost("uploadimg")]
        public async Task<ActionResult<String>> PostFile(IFormFile formFile)
        {
            // Create Path to save file
            string filePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot\\content\\images\\uploaded", formFile.FileName);

            // Create a new local file and copy content of uploaded file
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await formFile.CopyToAsync(stream);
            }

            return filePath;
        }

        // DELETE: api/Customers/5
        [HttpDelete("{CustomerID}")]
        public async Task<ActionResult<Customer>> DeleteCustomer(Guid CustomerID)
        {
            var customer = await _context.Customer.FindAsync(CustomerID);
            if (customer == null)
            {
                return NotFound();
            }

            _context.Customer.Remove(customer);
            await _context.SaveChangesAsync();

            return customer;
        }

        private bool CustomerExists(Guid id)
        {
            return _context.Customer.Any(e => e.CustomerId == id);
        }
    }
}
