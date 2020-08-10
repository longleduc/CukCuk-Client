
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
     */
    formatCode(maxCode) {
        var tmp = (parseInt(maxCode.substr(2, 5)) + 1).toString();
        while (tmp.length < 5) {
            tmp = '0' + tmp;
        }
        return "NV" + tmp;
    }
}