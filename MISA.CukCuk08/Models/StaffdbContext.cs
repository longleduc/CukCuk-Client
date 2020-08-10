using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

namespace MISA.CukCuk08.Models
{
    public partial class StaffdbContext : DbContext
    {
        public StaffdbContext()
        {
        }

        public StaffdbContext(DbContextOptions<StaffdbContext> options)
            : base(options)
        {
        }

        public virtual DbSet<Customer> Customer { get; set; }
        public virtual DbSet<Staff> Staff { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
//#warning To protect potentially sensitive information in your connection string, you should move it out of source code. See http://go.microsoft.com/fwlink/?LinkId=723263 for guidance on storing connection strings.
                optionsBuilder.UseMySql("server=35.194.166.58;port=3306;user=nvmanh;password=12345678@Abc;database=MISACukCuk_LDLONG", x => x.ServerVersion("10.3.22-mariadb"));
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Customer>(entity =>
            {
                entity.HasComment("Bảng thông tin khách hàng");

                entity.Property(e => e.CustomerId)
                    .HasColumnName("CustomerID")
                    .HasComment("ID khách hàng")
                    .HasCharSet("utf8mb4")
                    .HasCollation("utf8mb4_general_ci");

                entity.Property(e => e.Address)
                    .HasColumnType("varchar(255)")
                    .HasComment("Địa chỉ")
                    .HasCharSet("utf8mb4")
                    .HasCollation("utf8mb4_general_ci");

                entity.Property(e => e.Birthday)
                    .HasColumnType("date")
                    .HasComment("Ngày sinh");

                entity.Property(e => e.CompanyName)
                    .HasColumnType("varchar(255)")
                    .HasComment("Tên công ty")
                    .HasCharSet("utf8mb4")
                    .HasCollation("utf8mb4_general_ci");

                entity.Property(e => e.CustomerCode)
                    .IsRequired()
                    .HasColumnType("varchar(20)")
                    .HasComment("Mã khách hàng")
                    .HasCharSet("utf8mb4")
                    .HasCollation("utf8mb4_general_ci");

                entity.Property(e => e.CustomerName)
                    .IsRequired()
                    .HasColumnType("varchar(100)")
                    .HasComment("Tên khách hàng")
                    .HasCharSet("utf8mb4")
                    .HasCollation("utf8mb4_general_ci");

                entity.Property(e => e.DebitNumber)
                    .HasColumnType("varchar(25)")
                    .HasComment("Mã số thuế")
                    .HasCharSet("utf8mb4")
                    .HasCollation("utf8mb4_general_ci");

                entity.Property(e => e.Email)
                    .HasColumnType("varchar(100)")
                    .HasComment("Email")
                    .HasCharSet("utf8mb4")
                    .HasCollation("utf8mb4_general_ci");

                entity.Property(e => e.FirstName)
                    .HasColumnType("varchar(100)")
                    .HasComment("Họ")
                    .HasCharSet("utf8mb4")
                    .HasCollation("utf8mb4_general_ci");

                entity.Property(e => e.GroupCustomer)
                    .HasColumnType("varchar(255)")
                    .HasComment("Nhóm thành viên")
                    .HasCharSet("utf8mb4")
                    .HasCollation("utf8mb4_general_ci");

                entity.Property(e => e.ImageLink)
                    .HasColumnType("varchar(255)")
                    .HasComment("Link ảnh")
                    .HasCharSet("utf8mb4")
                    .HasCollation("utf8mb4_general_ci");

                entity.Property(e => e.Is5FoodMember).HasComment("Là thành viên 5 Food");

                entity.Property(e => e.LastName)
                    .HasColumnType("varchar(100)")
                    .HasComment("Tên")
                    .HasCharSet("utf8mb4")
                    .HasCollation("utf8mb4_general_ci");

                entity.Property(e => e.MemberCode)
                    .HasColumnType("varchar(20)")
                    .HasComment("Mã thẻ thành viên")
                    .HasCharSet("utf8mb4")
                    .HasCollation("utf8mb4_general_ci");

                entity.Property(e => e.MiddleName)
                    .HasColumnType("varchar(100)")
                    .HasComment("Tên Đệm")
                    .HasCharSet("utf8mb4")
                    .HasCollation("utf8mb4_general_ci");

                entity.Property(e => e.PhoneNumber)
                    .IsRequired()
                    .HasColumnType("varchar(50)")
                    .HasComment("Số điện thoại")
                    .HasCharSet("utf8mb4")
                    .HasCollation("utf8mb4_general_ci");
            });

            modelBuilder.Entity<Staff>(entity =>
            {
                entity.HasComment("Bảng nhân viên");

                entity.HasIndex(e => e.StaffId)
                    .HasName("StaffId")
                    .IsUnique();

                entity.Property(e => e.StaffId)
                    .HasColumnType("varchar(36)")
                    .HasComment("ID nhân viên")
                    .HasCharSet("utf8mb4")
                    .HasCollation("utf8mb4_general_ci");

                entity.Property(e => e.Birthday)
                    .HasColumnType("date")
                    .HasComment("Ngày sinh");

                entity.Property(e => e.DebitNumber)
                    .HasColumnType("varchar(20)")
                    .HasComment("Mã số thuế")
                    .HasCharSet("utf8mb4")
                    .HasCollation("utf8mb4_general_ci");

                entity.Property(e => e.Department)
                    .HasColumnType("varchar(255)")
                    .HasComment("Phòng ban")
                    .HasCharSet("utf8mb4")
                    .HasCollation("utf8mb4_general_ci");

                entity.Property(e => e.Email)
                    .IsRequired()
                    .HasColumnType("varchar(100)")
                    .HasComment("Email")
                    .HasCharSet("utf8mb4")
                    .HasCollation("utf8mb4_general_ci");

                entity.Property(e => e.Gender)
                    .HasColumnType("varchar(100)")
                    .HasComment("Giới tính")
                    .HasCharSet("utf8mb4")
                    .HasCollation("utf8mb4_general_ci");

                entity.Property(e => e.GivenDate)
                    .HasColumnType("date")
                    .HasComment("Ngày cấp");

                entity.Property(e => e.GivenPlace)
                    .HasColumnType("varchar(255)")
                    .HasComment("Nơi cấp")
                    .HasCharSet("utf8mb4")
                    .HasCollation("utf8mb4_general_ci");

                entity.Property(e => e.IdCard)
                    .HasColumnType("varchar(20)")
                    .HasComment("Chứng minh thư")
                    .HasCharSet("utf8mb4")
                    .HasCollation("utf8mb4_general_ci");

                entity.Property(e => e.PhoneNumber)
                    .IsRequired()
                    .HasColumnType("varchar(20)")
                    .HasComment("Số điện thoại")
                    .HasCharSet("utf8mb4")
                    .HasCollation("utf8mb4_general_ci");

                entity.Property(e => e.Position)
                    .HasColumnType("varchar(255)")
                    .HasComment("Vị trí")
                    .HasCharSet("utf8mb4")
                    .HasCollation("utf8mb4_general_ci");

                entity.Property(e => e.Salary)
                    .HasColumnType("int(20)")
                    .HasComment("Lương");

                entity.Property(e => e.StaffCode)
                    .IsRequired()
                    .HasColumnType("varchar(20)")
                    .HasComment("Mã nhân viên")
                    .HasCharSet("utf8mb4")
                    .HasCollation("utf8mb4_general_ci");

                entity.Property(e => e.StaffName)
                    .IsRequired()
                    .HasColumnType("varchar(100)")
                    .HasComment("Tên nhân viên")
                    .HasCharSet("utf8mb4")
                    .HasCollation("utf8mb4_general_ci");

                entity.Property(e => e.StartDate)
                    .HasColumnType("date")
                    .HasComment("Ngày bắt đầu");

                entity.Property(e => e.Status)
                    .HasColumnType("varchar(255)")
                    .HasComment("Tình trạng")
                    .HasCharSet("utf8mb4")
                    .HasCollation("utf8mb4_general_ci");
            });

            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}
