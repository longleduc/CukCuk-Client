using System;
using System.Collections.Generic;

namespace MISA.CukCuk08.Models
{
    public partial class Customer
    {
        /// <summary>
        /// ID khách hàng
        /// </summary>
        public Guid? CustomerId { get; set; }

        /// <summary>
        /// Mã khách hàng
        /// </summary>
        public string CustomerCode { get; set; }

        /// <summary>
        /// Tên khách hàng
        /// </summary>
        public string CustomerName { get; set; }

        /// <summary>
        /// Mã thành viên
        /// </summary>
        public string MemberCode { get; set; }

        /// <summary>
        /// Nhóm khách hàng
        /// </summary>
        public string GroupCustomer { get; set; }

        /// <summary>
        /// Tên công ty
        /// </summary>
        public string CompanyName { get; set; }

        /// <summary>
        /// Mã số thuế
        /// </summary>
        public string DebitNumber { get; set; }

        /// <summary>
        /// Ngày sinh
        /// </summary>
        public DateTime? Birthday { get; set; }

        /// <summary>
        /// Địa chỉ
        /// </summary>
        public string Address { get; set; }

        /// <summary>
        /// Số điện thoại
        /// </summary>
        public string PhoneNumber { get; set; }

        /// <summary>
        /// Email
        /// </summary>
        public string Email { get; set; }

        /// <summary>
        /// Là thành viên 5 Food
        /// </summary>
        public bool? Is5FoodMember { get; set; }

        /// <summary>
        /// Link avatar
        /// </summary>
        public string ImageLink { get; set; }
    }
}
