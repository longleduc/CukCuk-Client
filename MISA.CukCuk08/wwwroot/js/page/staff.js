
$(document).ready(function () {
    //load dữ liệu:
    staffJs = new StaffJS();
})

/**
 * Object JS quản lý các sự kiện cho trang danh mục khách hàng.
 * */
class StaffJS {
    constructor() {
        var me = this;
        me.loadData();
        me.initEvent();
    }

    /**
     * Thực hiện gán các sự kiện cho các thành phần trong trang
     * CreatedBy: LDLONG (24/07/2020)
     * */
    initEvent() {
        // Khi ấn thêm, sửa, xóa, nhân bản
        $("#btnAdd").on("click", Enum.FormMode.Add, this.btnAddOnClick);
        $("#btnEdit").on("click", Enum.FormMode.Edit, this.btnEditOnClick);
        $("#btnDelete").on("click", Enum.FormMode.Delete, this.btnDeleteOnClick.bind(this));
        $("#btnDuplicate").on("click", Enum.FormMode.Duplicate, this.btnDuplicateOnClick);

        //Khi ấn nút đóng
        $("#btnClose").on("click", 0, this.btnCloseOnClick.bind(this));
        $("#btnCloseHeader").on("click", 0, this.btnCloseHeaderOnClick.bind(this));

        //Khi ấn nút cất
        $("#btnSave").click(this.saveFile.bind(this));

        //Khi ấn nút cất và thêm
        $("#btnSaveAdd").click(this.saveAndAddData.bind(this));

        // Khi ấn vào 1 thành phần ở trong table
        $("table").on("click", "tbody tr", this.rowOnClick);

        // Validate ngay khi nhập
        $("input[required]").blur(this.checkEmpty);

        // Search bar
        $('.search-input').on('keyup', this.filterFunction);

        // Khi ấn nút chọn page số bao nhiêu
        $('#page-number').on('change', this.loadData);

        // Khi ấn nút chọn số row trong 1 page
        $('#select-num-row').on('change', this.loadData);

        // Khi ấn các thao tác chuyển page
        $('.btnFirstPage').on('click', this.btnFirstPageOnClick.bind(this));
        $('.btnPrePage').on('click', this.btnPrePageOnClick.bind(this));
        $('.btnNextPage').on('click', this.btnNextPageOnClick.bind(this));
        $('.btnEndPage').on('click', this.btnEndPageOnClick.bind(this));
        $('.btnReload').on('click', this.btnFirstPageOnClick.bind(this));

        // Khi ấn nút Yes trên warning-box => xóa nhân viên
        $('#btn-yes-warning').on('click', Enum.FormMode.Delete, this.deleteStaff.bind(this));

        // Khi ấn nút No trên warning-box => ko xóa nhân viên
        $('#btn-close-warning').on('click', 0, this.notDeleteStaff);

        // Khi ấn nút Yes trên confirm-dialog
        $('#btn-yes-confirm').on('click', this.btnYesConfirmOnClick.bind(this));

        // Khi ấn nút Yes trên confirm-dialog
        $('#btn-close-confirm').on('click', this.btnNoConfirmOnClick);

        // Khi uploaded ảnh
        $('#file-ava-image').on('change', this.showImageFromInput);

        // Khi xóa ảnh
        $('.delete-avatar').on('click', this.deleteImage);
    }

    /**
     * Sự kiện click Thêm trên dialog
     * @param {any} sender
     * CreatedBy: LDLONG (24/7/2020)
     */
    btnAddOnClick(sender) {
        //action = hành động ADD
        action = sender.data;
        //Show dialog
        $("#frmDialogDetail").show();
        // Focus vào ô input đầu tiên của dialog
        $('#txtStaffCode').focus();
        // Mã nhân viên = mã nhân viên lớn nhất hiện tại + 1
        $('#txtStaffCode').val(commonJS.formatCode(maxCode));
    }

    /**
      * Sự kiện click Sửa trên dialog
      * @param {any} sender
      * CreatedBy: LDLONG (24/7/2020)
      */
    btnEditOnClick(sender) {
        try {
            // action = hành động Edit
            action = sender.data;
            //Nếu tìm thấy row có class là row-selected
            if ($('.row-selected').length !== 0) {
                // Lấy ra ID của hàng đang được chọn
                var staffId = $('.row-selected').data('id');
                // Call API GET để lấy ra data với ID ở trên
                $.ajax({
                    url: "/api/v1/Staffs/" + staffId,
                    method: "GET",
                    data: {},
                    dataType: "json",
                    contentType: "application/json",
                }).done(function (res) {
                    // Lấy ra link ava
                    avaLink = res.ImageLink;

                    // Gán data lấy ra vào dialog
                    commonJS.bindDataToForm(res);
                }).fail(function () {
                    alert("Lỗi");
                });

                //Show dialog
                $('#frmDialogDetail').show();

                // Focus vào ô input đầu tiên của dialog
                $('#txtStaffCode').focus();
            } else {
                alert(Resource.Language[commonJS.LanguageCode].CantEdit);
            }
        } catch (e) {
            console.log(e);
        }
    }

    /**
     * Sự kiện click Sửa trên dialog
     * @param {any} sender
     * CreatedBy: LDLONG (24/7/2020)
     */
    btnDeleteOnClick(sender) {
        try {
            //action = hành động xóa
            action = sender.data;
            // Nếu tìm thấy row có class là row-selected
            if ($('.row-selected').length !== 0) {
                // Show ra warning-box
                $('#warning-box').show();
            } else {
                alert(Resource.Language[commonJS.LanguageCode].CantDelete);
            }
        } catch (e) {
            console.log(e);
        }
    }

    /**
     * Hàm khi ấn nút Xóa
     * CreatedBy: LDLONG (10/08/2020)
     * @param {any} sender
     */
    deleteStaff(sender) {
        try {
            var staffJS = this;
            // Đóng cửa số warning-box
            $('#warning-box').hide();
            //action = hành động xóa
            action = sender.data;
            // Nếu tìm thấy row có class là row-selected
            if ($('.row-selected').length !== 0) {
                // Call API DELETE với ID ở trên
                $.ajax({
                    url: "/api/v1/staffs",
                    method: "DELETE",
                    data: JSON.stringify(listDeleteStaff),
                    //dataType: "",
                    contentType: "application/json"
                }).done(function () {
                    // Hiện thị thông báo thêm thành công
                    alert(Resource.Language[commonJS.LanguageCode].Delete);

                    // Reset lại list id bị xóa
                    listDeleteStaff = [];

                    // Load lại dữ liệu ra trang để render
                    staffJS.loadData();
                }).fail(function () {
                    alert("Lỗi");
                })
            } else {
                alert(Resource.Language[commonJS.LanguageCode].CantDelete);
            }

            // Đóng/ ẩn Form:
            $("#frmDialogDetail").hide();

            // Reset lại dialog
            staffJS.resetDialog();
        } catch (e) {
            console.log(e);
        }
    }

    /**
     * Khi ấn nút đóng warning
     * CreatedBy: LDLONG (10/08/2020)
     * @param {any} sender
     */
    notDeleteStaff(sender) {
        try {
            //action = hành động xóa
            action = sender.data;
            // Nếu tìm thấy row có class là row-selected
            if ($('.row-selected').length !== 0) {
                // Show ra warning-box
                $('#warning-box').hide();
            }
        } catch (e) {
            console.log(e);
        }
    }

    /**
     * Hàm khi ấn nút nhân bản
     * CreatedBy: LDLONG(10/08/2020)
     * @param {any} sender
     */
    btnDuplicateOnClick(sender) {
        try {
            // action = hành động Edit
            action = sender.data;
            //Nếu tìm thấy row có class là row-selected
            if ($('.row-selected').length !== 0) {
                // Lấy ra ID của hàng đang được chọn
                var staffId = $('.row-selected').data('id');
                // Call API GET để lấy ra data với ID ở trên
                $.ajax({
                    url: "/api/v1/Staffs/" + staffId,
                    method: "GET",
                    data: {},
                    dataType: "json",
                    contentType: "application/json",
                }).done(function (res) {
                    // Lấy ra link ava
                    avaLink = res.ImageLink;

                    // Gán data lấy ra vào dialog
                    commonJS.bindDataToForm(res);

                    // Reset ô mã nhân viên
                    $('#txtStaffCode').val("");
                }).fail(function () {
                    alert("Lỗi");
                });

                //Show dialog
                $('#frmDialogDetail').show();

                // Focus vào ô input đầu tiên của dialog
                $('#txtStaffCode').focus();
            } else {
                alert(Resource.Language[commonJS.LanguageCode].CantDuplicate);
            }
        } catch (e) {
            console.log(e);
        }
    }

    /**
     * Sự kiện khi ấn phím yes trong confirm dialog
     * CreatedBy: LDLONG (12/8/2020)
     * */
    btnYesConfirmOnClick() {
        // Reset action
        action = 0;
        // Đóng thông báo confirm
        $('#confirm-dialog').hide();
        // Hide dialog
        $("#frmDialogDetail").hide();
        // Reset lại dialog chuẩn bị cho lần nhập sau
        this.resetDialog();
    }

    /**
     * Sự kiện khi ấn phím no trong confirm dialog
     * CreatedBy: LDLONG (12/8/2020)
     * */
    btnNoConfirmOnClick() {
        // Đóng thông báo confirm
        $('#confirm-dialog').hide();
    }

    /**
    * Sự kiện khi click button đóng dưới footer của Dialog
    * CreatedBy: LDLONG (24/07/2020)
    * */
    btnCloseOnClick() {
        // Mở thông báo confirm
        $('#confirm-dialog').show();
    }

    /**
    * Sự kiện khi click Đóng trên tiêu đề của Dialog
    * CreatedBy: LDLONG (24/07/2020)
    * */
    btnCloseHeaderOnClick(sender) {
        // Mở thông báo confirm
        $('#confirm-dialog').show();
    }

    /**
    * Sự kiện khi click chọn 1 dòng trong table
    * CreatedBy: LDLONG (24/07/2020)
    * */
    rowOnClick() {
        if (event.ctrlKey) {
            this.classList.toggle("row-selected");
            $('#btnEdit').prop('disabled', true);
            $('#btnDuplicate').prop('disabled', true);
            if (this.classList.contains("row-selected")) {
                // Add phần tử vào list để xóa
                listDeleteStaff.push($(this).data("id"));
            } else {
                var tmp = listDeleteStaff.indexOf($(this).data("id"));
                listDeleteStaff.splice(tmp, 1);
            }
        } else {
            this.classList.toggle("row-selected");
            $(this).siblings().removeClass("row-selected");
            $('#btnEdit').prop('disabled', false);
            $('#btnDuplicate').prop('disabled', false);
            // Khi ko ấn bằng Ctrl => Reset list chứa phần tử để xóa
            listDeleteStaff = [];
            if (this.classList.contains("row-selected")) {
                // Add phần tử vào list để xóa
                listDeleteStaff.push($(this).data("id"));
            }
        }
    }

    /**
    * Load dữ liệu
    * CreatedBy: LDLONG (24/07/2020)
    * */
    loadData() {
        try {
            //Xóa data trong table đi để render lại
            $('table#tbListCustomer tbody').empty();

            // Call API GET để lấy toàn bộ data về render vào table
            $.ajax({
                url: "/api/v1/Staffs",
                method: "GET",
                data: {},
                dataType: "json",
                contentType: "application/json",
            }).done(function (res) {
                if (res) {
                    commonJS.renderData(res);
                }
            }).fail(function () {
                alert("Lỗi");
            })
        } catch (e) {
            console.log(e);
        }
    }

    /**
     * Cất dữ liệu
     * CreatedBy: LDONG (24/07/2020)
     * */
    saveData(staffJS, imageLink) {
        try {
            //Khởi tạo các biến để lấy data
            var staffId = null,
                staffCode = "",
                staffName = "",
                birthday = "",
                gender = "",
                email = "",
                phoneNumber = "",
                idCard = "",
                givenDate = "",
                givenPlace = "",
                position = "",
                department = "",
                debitNumber = "",
                salary = 0,
                startDate = "",
                status = "";

            // Lấy dữ liệu được nhập từ các input:
            if ($('.row-selected').length !== 0 && action == Enum.FormMode.Edit) {
                staffId = $('.row-selected').data('id');
            }
            staffCode = $("#txtStaffCode").val();
            staffName = $("#txtStaffName").val();
            birthday = new Date($("#dtBirthday").val()) || null;
            gender = $("#slGender").val();
            email = $("#txtEmail").val();
            phoneNumber = $("#txtPhoneNumber").val();
            idCard = $("#txtIdCard").val();
            givenDate = new Date($("#dtGivenDate").val()) || null;
            givenPlace = $("#txtGivenPlace").val();
            position = $("#slPosition").val();
            department = $("#slDepartment").val();
            debitNumber = $("#txtDebitNumber").val();
            salary = parseInt(commonJS.formatMoneyToBind($("#txtSalary").val()));
            startDate = new Date($("#dtStartDate").val()) || null;
            status = $("#slStatus").val();

            // Từ các dữ liệu thu thập được thì build thành object khách hàng (staff)
            var staff = {
                StaffId: staffId,
                StaffCode: staffCode,
                StaffName: staffName,
                Birthday: birthday,
                Gender: gender,
                Email: email,
                PhoneNumber: phoneNumber,
                IdCard: idCard,
                GivenDate: givenDate,
                GivenPlace: givenPlace,
                Position: position,
                Department: department,
                DebitNumber: debitNumber,
                Salary: salary,
                StartDate: startDate,
                Status: status,
                ImageLink: imageLink
            };

            // Kiểm tra validate
            if (staffJS.validateDialog(staff)) {
                if (action == Enum.FormMode.Add || action == Enum.FormMode.Duplicate) {
                    $.ajax({
                        url: "/api/v1/Staffs",
                        method: "POST",
                        data: JSON.stringify(staff),
                        dataType: "text",
                        contentType: "application/json"
                    }).done(function (res) {
                        // Chuyển kết quả nhận đc về dạng object
                        res = JSON.parse(res);

                        // Nếu bị trùng mã nhân viên => Result = Fail
                        if (res.Result == "Fail") {
                            alert("Mã nhân viên trùng với mã nhân viên " + res.existStaff.StaffName);
                        } else {
                            // Hiện thị thông báo thêm thành công
                            alert(Resource.Language[commonJS.LanguageCode].AddNew);

                            // Load lại dữ liệu ra trang để render
                            staffJS.loadData();
                        }
                    }).fail(function (res) {
                        alert("Lỗi AddNew");
                    })
                }
                else if (action == Enum.FormMode.Edit) {
                    $.ajax({
                        url: "/api/v1/Staffs/" + staffId,
                        method: "PUT",
                        data: JSON.stringify(staff),
                        dataType: "text",
                        contentType: "application/json"
                    }).done(function () {
                        // Hiện thị thông báo SỬA thành công
                        alert(Resource.Language[commonJS.LanguageCode].Edit);

                        // Load lại dữ liệu ra trang để render
                        staffJS.loadData();
                    }).fail(function () {
                        alert("Lỗi");
                    })
                }

                // Ẩn Form:
                $("#frmDialogDetail").hide();

                // Reset lại dialog
                staffJS.resetDialog();
            }
        } catch (e) {
            console.log(e);
        }
    }

    /**
     * Hàm khi ấn nút cất và thêm
     * CreatedBy: LDLONG (3/8/2020)
     * */
    saveAndAddData() {
        this.saveFile();
        $("#frmDialogDetail").show();
    }

    /**
     * Hàm reset lại dialog sau khi dialog nhận data từ row đc chọn
     * CreatedBy: LDLONG (24/7/2020)
     * */
    resetDialog() {
        try {
            $('#txtStaffCode').val("");
            $('#txtStaffCode').removeClass("required-error");
            $('#txtStaffName').val("");
            $('#txtStaffName').removeClass("required-error");
            $('#dtBirthday').val("");
            $('#slGender').val("");
            $('#txtEmail').val("");
            $('#txtEmail').removeClass("required-error");
            $('#txtPhoneNumber').val("");
            $('#txtPhoneNumber').removeClass("required-error");
            $('#txtIdCard').val("");
            $('#dtGivenDate').val("");
            $('#txtGivenPlace').val("");
            $('#slPosition').val("");
            $('#slDepartment').val("");
            $('#txtDebitNumber').val("");
            $('#txtSalary').val("");
            $('#dtStartDate').val("");
            $('#slStatus').val("");
            var imageUrl = "/content/images/avatardefault.png";
            $(".ava-img").attr("src", imageUrl);
            $(".ava-img").css("visibility", "visible");
            $("#file-ava-image").val("");
        } catch (e) {
            console.log(e);
        }
    }

    /**
     * Kiểm tra Mã khách hàng, Tên, Số điện thoại có trống hay không
     * CreatedBy: LDLONG (3/8/2020)
     */
    checkEmpty() {
        try {
            var value = this.value;
            // Nếu ô input chưa được điền thông tin
            if (!value) {
                $(this).addClass("required-error");
                $(this).attr("title", "Bạn phải điền thông tin này");
                return false;
            }

            // Nếu ô input đã được điền thông tin
            $(this).removeClass("required-error");
            $(this).removeAttr("title");
            return true;
        } catch (e) {
            console.log(e);
        }
    }

    /**
     * Kiểm tra Mã khách hàng, Tên, Số điện thoại có trống hay không
     * và kiểm tra xem nếu có email thì đã đúng định dạng chưa
     * @param {any} staff
     * CreatedBy: LDLONG (28/7/2020)
     */
    validateDialog(staff) {
        try {
            // Nếu ko có Mã, Tên, Số điện thoại thì ko thể Cất
            if (!staff.StaffCode.trim()) {
                alert("Bạn chưa điền mã khách hàng!");
                return false;
            }
            if (!staff.StaffName.trim()) {
                alert("Bạn phải điền tên khách hàng");
                return false;
            }
            if (!staff.PhoneNumber.trim()) {
                alert("Bạn phải điền số điện thoại");
                return false;
            }
            if (!staff.Email.trim()) {
                alert("Bạn phải điền Email");
                return false;
            }

            // Nếu có email thì phải test xem đúng định dạng chưa
            var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;

            if (!reg.test(staff.Email)) {
                alert(Resource.Language[commonJS.LanguageCode].InvalidEmail);
                return false;
            }

            return true;
        } catch (e) {
            console.log(e);
        }
    }

    /**
     * Hàm filter search cho table
     * CreatedBy: LDLONG (06/08/2020)
     * */
    filterFunction() {
        try {
            //Xóa data trong table đi để render lại
            $('table#tbListCustomer tbody').empty();
            // filter = Giá trị ô vừa điền 
            var filter = $(this).val().trim();
            // key = số thứ tự của cột đang search
            var key = $(this).parent().index();
            // Nếu ô filter ko có giá trị
            if (!filter) {
                filter = "NullValueException";
            }
            // Call API GET để lấy toàn bộ data về render vào table
            $.ajax({
                url: "/api/v1/Staffs/" + key + "/" + filter,
                method: "GET",
                data: {},
                dataType: "json",
                contentType: "application/json",
            }).done(function (res) {
                if (res) {
                    commonJS.renderData(res);
                }
            }).fail(function () {
                alert("Lỗi");
            })
        } catch (e) {
            console.log(e);
        }
    }

    /**
     * Sự kiện khi ấn nút quay về page đầu tiên hoặc nút reload
     * CreatedBy: LDLONG (06/08/2020)
     * */
    btnFirstPageOnClick() {
        if ($('#page-number').val() == 1) return;
        $('#page-number').val(1);
        this.loadData();
    }

    /**
     * Sự kiện khi ấn nút quay về page trước
     * CreatedBy: LDLONG (06/08/2020)
     * */
    btnPrePageOnClick() {
        var PageNumberNow = parseInt($('#page-number').val());
        if (PageNumberNow > 1) {
            $('#page-number').val(PageNumberNow - 1);
        } else return;
        this.loadData();
    }

    /**
     * Sự kiện khi ấn nút chuyển qua page tiếp
     * CreatedBy: LDLONG (06/08/2020)
     * */
    btnNextPageOnClick() {
        var PageNumberNow = parseInt($('#page-number').val());
        var totalPage = parseInt(allRow / $('#select-num-row').val());
        if (allRow % $('#select-num-row').val() !== 0) totalPage += 1;
        if (PageNumberNow < totalPage) {
            $('#page-number').val(PageNumberNow + 1);
        } else return;
        this.loadData();
    }

    /**
     * Sự kiện khi ấn nút chuyển qua page cuối cùng
     * CreatedBy: LDLONG (06/08/2020)
     * */
    btnEndPageOnClick() {
        var totalPage = parseInt(allRow / $('#select-num-row').val());
        if (allRow % $('#select-num-row').val() !== 0) totalPage += 1;
        if ($('#page-number').val() == totalPage) return;
        $('#page-number').val(totalPage);
        this.loadData();
    }

    /**
     * Sự kiện khi ấn nút Cất
     * CreatedBy: LDLONG (06/08/2020)
     * */
    saveFile() {
        try {
            var staffJS = this;
            // Lấy ra object chứa file ảnh
            var image = $("#file-ava-image").get(0).files;
            if (image.length > 0) {
                // Khởi tạo formData để chứa ảnh
                var formData = new FormData();

                // Gán ảnh vào FormData
                formData.append('formFile', image[0]);

                // Call API POST để gửi ảnh về DB
                $.ajax({
                    url: '/api/v1/staffs/uploadimg',
                    type: 'POST',
                    data: formData,
                    processData: false,
                    contentType: false,
                }).done(function (imageLink) {
                    avaLink = imageLink;
                    // Gửi dữ liệu staff sau khi có link ảnh về DB
                    staffJS.saveData(staffJS, avaLink);
                }).fail(function () {
                    alert("Lỗi saveFile");
                });
            } else {
                // Gửi dữ liệu staff sau khi có link ảnh về DB
                staffJS.saveData(staffJS, avaLink);
            }
        } catch (e) {
            console.log(e);
        }
    }

    /**
     * Sự kiện khi tải ảnh lên
     * CreatedBy: LDLONG (07/08/2020)
     * */
    showImageFromInput() {
        var file = $(this)[0].files[0];
        var fileReader = new FileReader();
        fileReader.onload = function (event) {
            var imageUrl = event.target.result;
            $(".ava-img").attr("src", imageUrl);
            $(".ava-img").css("visibility", "visible");
        };
        fileReader.readAsDataURL(file);
    }

    /**
     * Sự kiện khi xóa ảnh
     * CreatedBy: LDLONG (10/08/2020)
     * */
    deleteImage() {
        var imageUrl = "/content/images/avatardefault.png";
        avaLink = null;
        $('#file-ava-image').val(null);
        $(".ava-img").attr("src", imageUrl);
        $(".ava-img").css("visibility", "visible");
    }
}