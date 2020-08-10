
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

        // Khi ấn nút Yes trên warning-box
        $('#btn-yes-warning').on('click', Enum.FormMode.Delete, this.DeleteStaff.bind(this));

        // Khi ấn nút No trên warning-box
        $('#btn-close-warning').on('click', 0, this.NotDeleteStaff);

        // Khi uploaded ảnh
        $('#fileUpload').on('change', this.showImageFromInput);

        // Khi xóa ảnh
        $('.delete-avatar').on('click', this.DeleteImage);
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
                    // Gán data lấy ra vào dialog
                    $('#txtStaffCode').val(res['StaffCode']);
                    $('#txtStaffName').val(res['StaffName']);
                    $('#dtBirthday').val(commonJS.formatDateToBind(new Date(res['Birthday'])));
                    $('#slGender').val(res['Gender']);
                    $('#txtEmail').val(res['Email']);
                    $('#txtPhoneNumber').val(res['PhoneNumber']);
                    $('#txtIdCard').val(res['IdCard']);
                    $('#dtGivenDate').val(commonJS.formatDateToBind(new Date(res['GivenDate'])));
                    $('#txtGivenPlace').val(res['GivenPlace']);
                    $('#slPosition').val(res['Position']);
                    $('#slDepartment').val(res['Department']);
                    $('#txtDebitNumber').val(res['DebitNumber']);
                    $('#txtSalary').val(commonJS.formatMoney(res['Salary']));
                    $('#dtStartDate').val(commonJS.formatDateToBind(new Date(res['StartDate'])));
                    $('#slStatus').val(res['Status']);
                    var imageUrl = commonJS.formatImageLink(res['ImageLink']);
                    $(".ava-img").attr("src", imageUrl);
                    $(".ava-img").css("visibility", "visible");
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
                //// Gán tên nhân viên vào warning-box
                //$('#staff-name').html($('.row-selected').find('td:eq(1)').text());

                // Show ra warning-box
                $('#warning-box').show();
            }
        } catch (e) {
            console.log(e);
        }
    }

    DeleteStaff(sender) {
        try {
            var staffJS = this;

            // Đóng cửa số warning-box
            $('#warning-box').hide();

            //action = hành động xóa
            action = sender.data;
            // Nếu tìm thấy row có class là row-selected
            if ($('.row-selected').length !== 0) {
                // Lấy ra ID của hàng đang được chọn
                var staffId = $('.row-selected').data('id')

                // Call API DELETE với ID ở trên
                $.ajax({
                    url: "/api/v1/Staffs/" + staffId,
                    method: "DELETE",
                    data: {},
                    dataType: "text",
                    contentType: "application/json"
                }).done(function () {
                    // Hiện thị thông báo thêm thành công
                    alert(Resource.Language[commonJS.LanguageCode].Delete);

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

    NotDeleteStaff(sender) {
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
                    // Gán data lấy ra vào dialog
                    $('#txtStaffName').val(res['StaffName']);
                    $('#dtBirthday').val(commonJS.formatDateToBind(new Date(res['Birthday'])));
                    $('#slGender').val(res['Gender']);
                    $('#txtEmail').val(res['Email']);
                    $('#txtPhoneNumber').val(res['PhoneNumber']);
                    $('#txtIdCard').val(res['IdCard']);
                    $('#dtGivenDate').val(commonJS.formatDateToBind(new Date(res['GivenDate'])));
                    $('#txtGivenPlace').val(res['GivenPlace']);
                    $('#slPosition').val(res['Position']);
                    $('#slDepartment').val(res['Department']);
                    $('#txtDebitNumber').val(res['DebitNumber']);
                    $('#txtSalary').val(res['Salary']);
                    $('#dtStartDate').val(commonJS.formatDateToBind(new Date(res['StartDate'])));
                    $('#slStatus').val(res['Status']);
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
    * Sự kiện khi click button đóng dưới footer của Dialog
    * CreatedBy: LDLONG (24/07/2020)
    * */
    btnCloseOnClick(sender) {
        // action = hành động close
        action = sender.data;
        // Hide dialog
        $("#frmDialogDetail").hide();
        // Reset lại dialog  chuẩn bị cho lần nhập sau
        this.resetDialog();
    }

    /**
    * Sự kiện khi click Đóng trên tiêu đề của Dialog
    * CreatedBy: LDLONG (24/07/2020)
    * */
    btnCloseHeaderOnClick(sender) {
        // action = hành động close
        action = sender.data;
        //Hide dialog
        $("#frmDialogDetail").hide();
        // Reset lại dialog  chuẩn bị cho lần nhập sau
        this.resetDialog();
    }

    /**
    * Sự kiện khi click chọn 1 dòng trong table
    * CreatedBy: LDLONG (24/07/2020)
    * */
    rowOnClick() {
        this.classList.toggle("row-selected");
        $(this).siblings().removeClass("row-selected");
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
                    // Số row trên 1 page
                    var numberOfRow = $('#select-num-row').val();

                    // Page thứ bao nhiêu
                    var pageNumber = $('#page-number').val();

                    // Tổng số khách hàng
                    allRow = res.length;

                    // Với số khách hàng đó thì sẽ có tối đa bao nhiêu page
                    var totalPage = parseInt(allRow / numberOfRow);
                    if (allRow % numberOfRow !== 0) totalPage += 1;

                    // Gán dữ liệu cho thanh paging
                    $('.total-page').html(totalPage);
                    $('.start-row').html(numberOfRow * (pageNumber - 1) + 1);
                    $('.end-row').html(Math.min(numberOfRow * pageNumber, allRow));
                    $('.total-row').html(allRow);

                    //Lấy ra mã nhân viên lớn nhất
                    maxCode = res[res.length - 1].StaffCode;

                    // Duyệt qua các phần tử để render dữ liệu
                    for (var i = numberOfRow * (pageNumber - 1); i <= numberOfRow * pageNumber - 1; i++)
                        if (i < allRow && i < res.length) {
                            var item = res[i];
                            var customerInfoHTML = $(`<tr>
                                <td>`+ item['StaffCode'] + `</td>
                                <td>`+ item['StaffName'] + `</td>
                                <td>`+ item['Gender'] + `</td>
                                <td>`+ commonJS.formatDate(new Date(item['Birthday'])) + `</td>
                                <td>`+ item['PhoneNumber'] + `</td>
                                <td>`+ item['Email'] + `</td>
                                <td>`+ item['Position'] + `</td>
                                <td>`+ item['Department'] + `</td>
                                <td>`+ commonJS.formatMoney(item['Salary']) + `</td>
                                <td>`+ item['Status'] + `</td>
                            </tr>`);

                            // Ko để hiện ID ra cho người dùng => Ẩn dưới dạng data của row đó
                            customerInfoHTML.data("id", item["StaffId"]);
                            // Render data vào table để render
                            $('table#tbListCustomer tbody').append(customerInfoHTML);
                        }
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
                // Nếu hành động đang là THÊM
                if (action == Enum.FormMode.Add) {
                    $.ajax({
                        url: "/api/v1/Staffs",
                        method: "POST",
                        data: JSON.stringify(staff),
                        dataType: "text",
                        contentType: "application/json"
                    }).done(function (res) {
                        res = JSON.parse(res);
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
                // Nếu hành động đang là SỬA
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
                else if (action == Enum.FormMode.Duplicate) {
                    $.ajax({
                        url: "/api/v1/Staffs",
                        method: "POST",
                        data: JSON.stringify(staff),
                        dataType: "text",
                        contentType: "application/json"
                    }).done(function (res) {
                        // Hiện thị thông báo thêm thành công
                        alert(Resource.Language[commonJS.LanguageCode].Duplicate);

                        // Load lại dữ liệu ra trang để render
                        staffJS.loadData();
                    }).fail(function () {
                        alert("Lỗi Duplicate");
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
            $("#fileUpload").val("");
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
            setTimeout(function () {
                //wait for 3 seconds
            }, 3000);

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
                    // Sắp xếp lại theo mã khách hàng
                    //res.sort((a, b) => (a.StaffCode > b.StaffCode) ? 1 : -1)
                    // Số row trên 1 page
                    var numberOfRow = $('#select-num-row').val();
                    // Page thứ bao nhiêu
                    var pageNumber = $('#page-number').val();
                    // Tổng số khách hàng
                    allRow = res.length;
                    // Với số khách hàng đó thì sẽ có tối đa bao nhiêu page
                    var totalPage = parseInt(allRow / numberOfRow);
                    if (allRow % numberOfRow !== 0) totalPage += 1;
                    // Gán dữ liệu cho thanh paging
                    $('.total-page').html(totalPage);
                    $('.start-row').html(numberOfRow * (pageNumber - 1) + 1);
                    $('.end-row').html(Math.min(numberOfRow * pageNumber, allRow));
                    $('.total-row').html(allRow);

                    // Duyệt qua các phần tử để render dữ liệu
                    for (var i = numberOfRow * (pageNumber - 1); i <= numberOfRow * pageNumber - 1; i++)
                        if (i < allRow && i < res.length) {
                            var item = res[i];
                            var customerInfoHTML = $(`<tr>
                                <td>`+ item['StaffCode'] + `</td>
                                <td>`+ item['StaffName'] + `</td>
                                <td>`+ item['Gender'] + `</td>
                                <td>`+ commonJS.formatDate(new Date(item['Birthday'])) + `</td>
                                <td>`+ item['PhoneNumber'] + `</td>
                                <td>`+ item['Email'] + `</td>
                                <td>`+ item['Position'] + `</td>
                                <td>`+ item['Department'] + `</td>
                                <td>`+ commonJS.formatMoney(item['Salary']) + `</td>
                                <td>`+ item['Status'] + `</td>
                            </tr>`);

                            // Ko để hiện ID ra cho người dùng => Ẩn dưới dạng data của row đó
                            customerInfoHTML.data("id", item["StaffId"]);
                            // Render data vào table để render
                            $('table#tbListCustomer tbody').append(customerInfoHTML);
                        }
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
            var image = $("#fileUpload").get(0).files;
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
                    // Gửi dữ liệu staff sau khi có link ảnh về DB
                    staffJS.saveData(staffJS, imageLink);
                }).fail(function () {
                    alert("Lỗi saveFile");
                });
            } else {
                // Gửi dữ liệu staff sau khi có link ảnh về DB
                staffJS.saveData(staffJS, null);
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
    DeleteImage() {
        var imageUrl = "/content/images/avatardefault.png";
        $(".ava-img").attr("src", imageUrl);
        $(".ava-img").css("visibility", "visible");
    }
}

// Lưu nút vừa được bấm
var action;

// Lưu tổng số khách hàng
var allRow;

// Lưu mã nhân viên lớn nhất
var maxCode;