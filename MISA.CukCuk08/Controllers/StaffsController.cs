﻿using System;
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
    [Route("api/v1/[controller]")]
    [ApiController]
    public class StaffsController : ControllerBase
    {
        private readonly StaffdbContext _context;

        public StaffsController(StaffdbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// API GET gửi về tất cả object staff
        /// </summary>
        /// <returns></returns>
        // GET: api/Staffs
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Staff>>> GetStaff()
        {
            return await _context.Staff.OrderBy(s => s.StaffCode).ToListAsync();
        }

        /// <summary>
        /// API GET lấy về 1 object có ID được gửi lên
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        // GET: api/Staffs/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Staff>> GetStaff(Guid? id)
        {
            var staff = await _context.Staff.FindAsync(id);

            if (staff == null)
            {
                return NotFound();
            }

            return staff;
        }

        /// <summary>
        /// API GET để tìm kiếm 1 trường trong của object bằng filter
        /// </summary>
        /// <param name="key"></param>
        /// <param name="filter"></param>
        /// <returns></returns>
        // GET: api/Staffs
        [HttpGet("{key}/{filter}")]
        public async Task<ActionResult<IEnumerable<Staff>>> GetStaff(int key, string filter)
        {
            List<Staff> res = new List<Staff>();
            var Staff = await _context.Staff.ToListAsync();

            if (filter == "NullValueException") return Staff;

            switch (key)
            {
                case 0:
                    // Tìm theo StaffCode
                    foreach (var item in Staff)
                    {
                        if (item.StaffCode.Contains(filter))
                        {
                            res.Add(item);
                        }
                    }
                    break;
                case 1:
                    // Tìm theo StaffName
                    foreach (var item in Staff)
                    {
                        if (item.StaffName.Contains(filter))
                        {
                            res.Add(item);
                        }
                    }
                    break;
                //case 2:
                //    // Tìm theo Gender
                //    foreach (var item in Staff)
                //    {
                //        if (item.Gender.Contains(filter))
                //        {
                //            res.Add(item);
                //        }
                //    }
                //    break;
                case 4:
                    // Tìm theo PhoneNumber
                    foreach (var item in Staff)
                    {
                        if (item.PhoneNumber.Contains(filter))
                        {
                            res.Add(item);
                        }
                    }
                    break;
                case 5:
                    // Tìm theo Email
                    foreach (var item in Staff)
                    {
                        if (item.Email.Contains(filter))
                        {
                            res.Add(item);
                        }
                    }
                    break;
                //case 6:
                //    // Tìm theo Position
                //    foreach (var item in Staff)
                //    {
                //        if (item.Position.Contains(filter))
                //        {
                //            res.Add(item);
                //        }
                //    }
                //    break;
                //case 7:
                //    // Tìm theo Department
                //    foreach (var item in Staff)
                //    {
                //        if (item.Department.Contains(filter))
                //        {
                //            res.Add(item);
                //        }
                //    }
                //    break;
                case 8:
                    // Tìm theo Salary
                    foreach (var item in Staff)
                    {
                        if (item.Salary.ToString().Contains(filter))
                        {
                            res.Add(item);
                        }
                    }
                    break;
                    //case 9:
                    //    // Tìm theo Status
                    //    foreach (var item in Staff)
                    //    {
                    //        if (item.Status.Contains(filter))
                    //        {
                    //            res.Add(item);
                    //        }
                    //    }
                    //    break;
            }

            if (res == null)
            {
                return NotFound();
            }

            return res;
        }

        /// <summary>
        /// API PUT gửi về 1 object staff
        /// </summary>
        /// <param name="id"></param>
        /// <param name="staff"></param>
        /// <returns></returns>
        // PUT: api/Staffs/5
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPut("{id}")]
        public async Task<IActionResult> PutStaff(Guid? id, [FromBody] Staff staff)
        {
            if (id != staff.StaffId)
            {
                return BadRequest();
            }

            _context.Entry(staff).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!StaffExists(id))
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

        /// <summary>
        /// API POST gửi object staff lên và có kèm check trùng mã nhân viên
        /// </summary>
        /// <param name="staff"></param>
        /// <returns></returns>
        // POST: api/Staffs
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPost]
        public async Task<ActionResult<Staff>> PostStaff([FromBody]Staff staff)
        {
            Staff existStaff = _context.Staff.Where(s => s.StaffCode == staff.StaffCode).FirstOrDefault();
            if (existStaff != null)
            {
                return Ok(new { Result = "Fail", existStaff });
            }
            staff.StaffId = Guid.NewGuid();
            _context.Staff.Add(staff);
            await _context.SaveChangesAsync();

            return Ok(new { Result = "Success", staff });
        }

        /// <summary>
        /// API POST để gửi file được đính kèm về thư mục "wwwroot\\content\\images\\uploaded"
        /// </summary>
        /// <param name="formFile"></param>
        /// <returns></returns>
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

        // DELETE: api/Staffs/5
        //[HttpDelete("{id}")]
        //public async Task<ActionResult<Staff>> DeleteStaff(Guid? id)
        //{
        //    var staff = await _context.Staff.FindAsync(id);
        //    if (staff == null)
        //    {
        //        return NotFound();
        //    }

        //    _context.Staff.Remove(staff);
        //    await _context.SaveChangesAsync();

        //    return staff;
        //}

        /// <summary>
        /// API DELETE xóa nhiều phần tử có ID được gửi về trong List
        /// </summary>
        /// <param name="IdList"></param>
        /// <returns></returns>
        // DELETE: api/Staffs/5
        [HttpDelete]
        public async Task<ActionResult<Staff>> DeleteStaff([FromBody] List<Guid> IdList)
        {
            List<Staff> deleteStaff = new List<Staff>();
            foreach (var id in IdList)
            {
                var staff = await _context.Staff.FindAsync(id);
                if (staff == null)
                {
                    return NotFound();
                }

                deleteStaff.Add(staff);
            }

            _context.Staff.RemoveRange(deleteStaff);
            await _context.SaveChangesAsync();

            return Ok();
        }

        /// <summary>
        /// Hàm kiểm tra xem có object nào có id gửi lên ko
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        private bool StaffExists(Guid? id)
        {
            return _context.Staff.Any(e => e.StaffId == id);
        }
    }
}
