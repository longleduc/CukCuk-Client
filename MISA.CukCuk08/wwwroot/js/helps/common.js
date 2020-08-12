
var commonJS = {
    LanguageCode: "VI",
    /**
    * Hàm định dạng hiển thị tiền
    * @param {number} money
    * CreatedBy: NVMANH (20/07/2020)
    */
    formatMoney(money) {
        if (!money) return "";
        return money.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
    },

    /**
    * Tạo chuỗi HTML checkbox tương ứng với trư/false
    * @param {boolean} value true: checked
    * CreatedBy: NVMANH (20/07/2020)
    */
    buildCheckBoxByValue(value) {
        var checkBoxHTML = $(`<input type="checkbox" />`);
        if (value) {
            checkBoxHTML = checkBoxHTML.attr("checked", true);
        }
        return checkBoxHTML[0].outerHTML;
    },

    /**
     * Hàm định dạng ngày hiển thị (dd/MM/yyyy)
     * @param {any} date
     * CreatedBy: LDLONG (24/7/2020)
     */
    formatDate(date) {
        var day = date.getDate();
        var month = date.getMonth() + 1;
        var year = date.getFullYear();
        month = (month < 10) ? "0" + month : month;
        day = (day < 10) ? "0" + day : day;
        return day + "/" + month + "/" + year;
    },

    /**
     * Hàm định dạng ngày (yyyy-mm-dd) để bind dữ liệu vào dialog
     * @param {any} date
     * CreatedBy: LDLONG(24/7/2020)
     */
    formatDateToBind(date) {
        var day = date.getDate();
        var month = date.getMonth() + 1;
        var year = date.getFullYear();
        month = (month < 10) ? "0" + month : month;
        day = (day < 10) ? "0" + day : day;
        return year + "-" + month + "-" + day;
    },
    /**
     * Hàm trả về mã nhân viên lớn nhất + 1
     * @param {any} maxCode
     * CreatedBy: LDLONG(10/8/2020)
     */
    formatCode(maxCode) {
        var tmp = (parseInt(maxCode.substr(2, 5)) + 1).toString();
        while (tmp.length < 5) {
            tmp = '0' + tmp;
        }
        return "NV" + tmp;
    },
    /**
     * Hàm trả về tiền dưới dạng string để gửi dữ liệu DB
     * @param {any} money
     * CreatedBy: LDLONG(10/8/2020)
     */
    formatMoneyToBind(money) {
        return money.replace(/[.]/g, "");
    },

    /**
     * Hàm trả về link ảnh có thể bind được để hiển thị
     * @param {any} imageLink
     * CreatedBy: LDLONG(10/8/2020)
     */
    formatImageLink(imageLink) {
        if (!imageLink) return "/content/images/avatardefault.png";
        var startLink = imageLink.indexOf("\\content");
        imageLink = imageLink.replace(/[\\]/g, "/");
        return imageLink.substr(startLink, imageLink.length - 1);
    },

    /**
     * Hàm chuyển null về rỗng để hiện thị 
     * @param {any} staff
     * CreatedBy: LDLONG(11/8/2020)
     */
    changeNull(staff) {
        if (staff['Gender'] == null) staff['Gender'] = "";
        if (staff['Birthday'] == null) staff['Birthday'] = "";
        if (staff['Position'] == null) staff['Position'] = "";
        if (staff['Department'] == null) staff['Department'] = "";
        if (staff['Status'] == null) staff['Status'] = "";
        return staff;
    },

    /**
     * Hàm render dữ liệu ra table
     * @param {any} staff
     * CreatedBy: LDLONG(11/8/2020)
     */
    renderData(staff) {
        // Số row trên 1 page
        var numberOfRow = $('#select-num-row').val();
        // Page thứ bao nhiêu
        var pageNumber = $('#page-number').val();
        // Tổng số khách hàng
        allRow = staff.length;
        // Với số khách hàng đó thì sẽ có tối đa bao nhiêu page
        var totalPage = parseInt(allRow / numberOfRow);
        if (allRow % numberOfRow !== 0) totalPage += 1;
        // Gán dữ liệu cho thanh paging
        $('.total-page').html(totalPage);
        $('.start-row').html(numberOfRow * (pageNumber - 1) + 1);
        $('.end-row').html(Math.min(numberOfRow * pageNumber, allRow));
        $('.total-row').html(allRow);

        // Lấy ra mã nhân viên lớn nhất
        maxCode = staff[staff.length - 1].StaffCode;

        // Duyệt qua các phần tử để render dữ liệu
        for (var i = numberOfRow * (pageNumber - 1); i <= numberOfRow * pageNumber - 1; i++)
            if (i < allRow && i < staff.length) {
                var item = staff[i];
                item = commonJS.changeNull(item);
                var customerInfoHTML = $(`<tr>
                                <td>`+ item['StaffCode'] + `</td>
                                <td>`+ item['StaffName'] + `</td>
                                <td>`+ item['Gender'] + `</td>
                                <td style="text-align: center;">`+ commonJS.formatDate(new Date(item['Birthday'])) + `</td>
                                <td>`+ item['PhoneNumber'] + `</td>
                                <td>`+ item['Email'] + `</td>
                                <td>`+ item['Position'] + `</td>
                                <td>`+ item['Department'] + `</td>
                                <td style="text-align: right;">`+ commonJS.formatMoney(item['Salary']) + `</td>
                                <td>`+ item['Status'] + `</td>
                            </tr>`);

                // Ko để hiện ID ra cho người dùng => Ẩn dưới dạng data của row đó
                customerInfoHTML.data("id", item["StaffId"]);
                // Render data vào table để render
                $('table#tbListCustomer tbody').append(customerInfoHTML);
            }
    },

    /**
     * Hàm bind data của 1 object staff vào Form
     * @param {any} res
     * CreatedBy: LDLONG(11/8/2020)
     */
    bindDataToForm (res) {
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
    }
}