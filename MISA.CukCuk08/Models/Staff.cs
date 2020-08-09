using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MISA.CukCuk08.Models
{
    public class Staff
    {
        /// <summary>
        /// ID khách hàng
        /// </summary>
        public Guid? StaffId { get; set; }

        /// <summary>
        /// Mã khách hàng
        /// </summary>
        public string StaffCode { get; set; }

        /// <summary>
        /// Tên khách hàng
        /// </summary>
        public string StaffName { get; set; }

        /// <summary>
        /// Mã thành viên
        /// </summary>
        public DateTime? Birthday { get; set; }

        /// <summary>
        /// Nhóm khách hàng
        /// </summary>
        public string Gender { get; set; }

        /// <summary>
        /// Tên công ty
        /// </summary>
        public string Email { get; set; }

        /// <summary>
        /// Mã số thuế
        /// </summary>
        public string PhoneNumber { get; set; }

        /// <summary>
        /// Ngày sinh
        /// </summary>
        public string IdCard { get; set; }

        /// <summary>
        /// Địa chỉ
        /// </summary>
        public DateTime? GivenDate { get; set; }

        /// <summary>
        /// Số điện thoại
        /// </summary>
        public string GivenPlace { get; set; }

        /// <summary>
        /// Email
        /// </summary>
        public string Position { get; set; }

        /// <summary>
        /// Là thành viên 5 Food
        /// </summary>
        public string Department { get; set; }

        /// <summary>
        /// Link avatar
        /// </summary>
        public string DebitNumber { get; set; }
        public int? Salary { get; set; }
        public DateTime? StartDate { get; set; }
        public string Status { get; set; }
        public DateTime? CreatedDate { get; set; }
        public DateTime? ModifiedDate { get; set; }

    }
}
