using System;
using System.Collections.Generic;

namespace MISA.CukCuk08.Models
{
    public partial class Staff
    {
        /// <summary>
        /// Id nhân viên
        /// </summary>
        public Guid? StaffId { get; set; }

        /// <summary>
        /// Mã khách hàng
        /// </summary>
        public string StaffCode { get; set; }

        /// <summary>
        /// Tên nhân viên
        /// </summary>
        public string StaffName { get; set; }

        /// <summary>
        /// Ngày sinh
        /// </summary>
        public DateTime? Birthday { get; set; }

        /// <summary>
        /// Giới tính
        /// </summary>
        public string Gender { get; set; }

        /// <summary>
        /// Email
        /// </summary>
        public string Email { get; set; }

        /// <summary>
        /// Số điện thoại
        /// </summary>
        public string PhoneNumber { get; set; }

        /// <summary>
        /// Số chứng minh thứ
        /// </summary>
        public string IdCard { get; set; }

        /// <summary>
        /// Ngày cấp CMT
        /// </summary>
        public DateTime? GivenDate { get; set; }

        /// <summary>
        /// Nơi cấp CMT
        /// </summary>
        public string GivenPlace { get; set; }

        /// <summary>
        /// Vị trí
        /// </summary>
        public string Position { get; set; }

        /// <summary>
        /// Phòng ban
        /// </summary>
        public string Department { get; set; }

        /// <summary>
        /// Mã số thuế
        /// </summary>
        public string DebitNumber { get; set; }

        /// <summary>
        /// Lương
        /// </summary>
        public int? Salary { get; set; }

        /// <summary>
        /// Ngày bắt đầu 
        /// </summary>
        public DateTime? StartDate { get; set; }

        /// <summary>
        /// Tình trạng công việc
        /// </summary>
        public string Status { get; set; }
        public string ImageLink { get; set; }
    }
}
