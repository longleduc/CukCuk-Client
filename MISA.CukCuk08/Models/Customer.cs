using System;
using System.Collections.Generic;

namespace MISA.CukCuk08.Models
{
    public partial class Customer
    {
        public Guid CustomerId { get; set; }
        public string CustomerCode { get; set; }
        public string CustomerName { get; set; }
        public string MemberCode { get; set; }
        public string GroupCustomer { get; set; }
        public string CompanyName { get; set; }
        public string DebitNumber { get; set; }
        public DateTime? Birthday { get; set; }
        public string Address { get; set; }
        public string PhoneNumber { get; set; }
        public string Email { get; set; }
        public bool? Is5FoodMember { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string MiddleName { get; set; }
        public string ImageLink { get; set; }
    }
}
