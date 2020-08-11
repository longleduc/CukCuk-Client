// Các key báo nút vừa nhập
var Enum = {
    FormMode: {
        Add: 1,
        Duplicate: 2,
        Edit: 3,
        Delete: 4,
        DeleteALot: 5
    },
};

// Các thông báo
var Resource = {
    Language: {
        VI: {
            AddNew: "Thêm mới thành công",
            LackOfInfo: "Vui lòng điền đầy đủ thông tin cần thiết",
            InvalidEmail: "Email không hợp lệ",
            Edit: "Sửa thành công",
            CantEdit: "Vui lòng chọn khách hàng để sửa",
            Delete: "Xóa thành công",
            CantDelete: "Vui lòng chọn khách hàng để xóa",
            Duplicate: "Nhân bản thành công",
            CantDuplicate: "Vui lòng chọn khách hàng để nhân bản"
        },
        EN: {
        }
    }
};

// Tổng số bản ghi
var allRow;

// Mã nhân viên lớn nhất
var maxCode;

// Nút vừa bấm
var action;

// Linh avatar 
var avaLink;

// List chứa id bị xóa
var listDeleteStaff = [];