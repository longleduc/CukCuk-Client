using System;
using System.Collections.Generic;

namespace MISA.CukCuk08.Models
{
    public partial class Staff
    {
        public Guid? StaffId { get; set; }
        public string StaffCode { get; set; }
        public string StaffName { get; set; }
        public DateTime? Birthday { get; set; }
        public string Gender { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
        public string IdCard { get; set; }
        public DateTime? GivenDate { get; set; }
        public string GivenPlace { get; set; }
        public string Position { get; set; }
        public string Department { get; set; }
        public string DebitNumber { get; set; }
        public int? Salary { get; set; }
        public DateTime? StartDate { get; set; }
        public string Status { get; set; }
    }
}
