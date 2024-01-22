/// <reference path="utils.js" />
/// <reference path="utils.js" />
/// <reference path="utils.js" />
/// <reference path="utils.js" />

$(document).ready(function () {
    var cnty = "";
    if ($.trim($('#ContentPlaceHolder_hdnCntryCode').val()) != "") {
        if ($.trim($('#ContentPlaceHolder_hdnCntryCode').val()) == "IN") {
            $('#divPanNo').removeClass("noneIMP");
        }
        cnty = $.trim($('#ContentPlaceHolder_hdnCntryCode').val());
    }
    if (cnty != "")
        cntry = cnty;
    //$('#DivBookBtn').html("");
    //// below for hotel module
    var html = "";
    if ($('#divOTP').length > 0) {
        
        html = '<div class="form-group">';
        if (cntry != "IN") {
            $('#ContentPlaceHolder_btnSelect').removeClass("noneIMP");
            html = '<div class="form-group noneIMP">';
        }
        html += '<a id="btnSendOTP"  style="cursor:pointer;background: #c00;" OnClick="javascript:return SendOTP(1);" class="otp_btn fade_anim">Send OTP</a>';
        html += '</div>';
        document.getElementById('divOTP').innerHTML = html;
    }

    //// below for All shopping cart products
    if ($('#divOTPPTP').length > 0) {
        
        html = '<div class="form-group">';
        if (cntry != "IN")
            html = '<div class="form-group noneIMP">';
        html += '<a id="btnSendOTP" class="cta btn" style="padding: 6px !important;" OnClick="javascript:return SendOTPPTP(1);" class="otp_btn fade_anim">Send OTP</a>';
        html += '</div>';
        document.getElementById('divOTPPTP').innerHTML = html;
    }


    $("#ContentPlaceHolder_txtMobileNo,#txtMobileNo").intlTelInput({
        geoIpLookup: function (callback) {
            $.get("https://ipinfo.io", function () { }, "jsonp").always(function (resp) {
                var countryCode = (resp && resp.country) ? resp.country : "";
                callback(countryCode);
            });
        },
        initialCountry: "auto",
        nationalMode: false,
        placeholderNumberType: "MOBILE",
        preferredCountries: ['us', 'in', 'ae', 'ch', 'gb', 'sg', 'om', 'lk', 'hk', 'au'],
        utilsScript: "/Scripts/utils.js"
    });

});

function SendOTPPTP(id) {
    
    var flag = true;
    $('#divOTPMsg').html("");
    $("#ContentPlaceHolder_lblMobileNo").html('');
    if (flag == true && id == 1) {
        var mob = $.trim($("#ContentPlaceHolder_txtMobileNo,#txtMobileNo").val());
        if (mob != '' && mob.length >= 10 && mob.length <= 20 && mob.indexOf('+') == 0) {
            $.ajax({
                type: "POST",
                url: "/Hotel/BookHotel.aspx/SendOTPs",
                data: '{MobileNo:"' + $.trim($("#ContentPlaceHolder_txtMobileNo,#txtMobileNo").val()) + '" }',
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: GetSendOTPResponse,
                failure: function (response) {
                    $("#divOTPMsg").html("&nbsp; &nbsp; Something wrong in service.");
                }
            });
        }
        else {
            $("#ContentPlaceHolder_txtMobileNo,#txtMobileNo").addClass('highlight_error');
            $("#ContentPlaceHolder_lblMobileNo").html('Mobile Number is mandatory.')
        }
    }
    return flag;
}
function SendOTP(id) {
    var PropertyType = '<%=PropertyType%>';
    var flag = true;
    $('#divOTPMsg').html("");
    $($('.search_forms').find('.highlight_error')).each(function (index, elem) {
        $(elem).removeClass('highlight_error');
    });
    var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
    if ($.trim($('#ContentPlaceHolder_txtEmailId').val()) == '') {
        $('#ContentPlaceHolder_txtEmailId').addClass('highlight_error');
        document.getElementById("ContentPlaceHolder_txtEmailId").focus();
        flag = false;
    }
    if (emailReg.test($('#ContentPlaceHolder_txtEmailId').val()) == false) {
        $('#ContentPlaceHolder_txtEmailId').addClass('highlight_error');
        document.getElementById("ContentPlaceHolder_txtEmailId").focus();
        flag = false;
    }
    if ($.trim($('#ContentPlaceHolder_txtMobileNo').val()) == '') {
        $('#ContentPlaceHolder_txtMobileNo').addClass('highlight_error');
        document.getElementById("ContentPlaceHolder_txtMobileNo").focus();
        flag = false;
    }
    if ($.trim($('#ContentPlaceHolder_ddlBranch').val()) == '0') {
        $('#ContentPlaceHolder_ddlBranch').addClass('highlight_error');
        document.getElementById("ContentPlaceHolder_ddlBranch").focus();
        $('.selectpicker').selectpicker('refresh');
        flag = false;
    }
    if ($.trim($('#ContentPlaceHolder_hdnCntryCode').val()) == 'IN') {
        if ($.trim($('#ContentPlaceHolder_ddlBranch').val()) == '0') {
            $('#ContentPlaceHolder_ddlBranch').addClass('highlight_error');
            document.getElementById("ContentPlaceHolder_ddlBranch").focus();
            $('.selectpicker').selectpicker('refresh');
            flag = false;
        }
        var PanNoRregex = /^[A-Za-z]{3}[Pp]{1}[A-Za-z]{1}\d{4}[A-Za-z]{1}$/;
        if ($.trim($('#ContentPlaceHolder_txtPanNo').val()) == '') {
            $('#ContentPlaceHolder_txtPanNo').addClass('highlight_error');
            document.getElementById("ContentPlaceHolder_txtPanNo").focus();
            flag = false;
        }
        if (PanNoRregex.test($.trim($('#ContentPlaceHolder_txtPanNo').val())) == false) {
            $('#ContentPlaceHolder_txtPanNo').addClass('highlight_error');
            document.getElementById("ContentPlaceHolder_txtPanNo").focus();
            flag = false;
        }
        if (!$('#chkTCS').prop("checked")) {
            $('#chkTCS').addClass('highlight_error');
            $('#chkTCS').parent().addClass('highlight_error');
            $('#chkTCS').focus();
            flag = false;
        }

    }
    var roomInfo = $.trim($("#ContentPlaceHolder_hdnRoomInfo").val());
    var Noofrooms = $.trim($("#ContentPlaceHolder_hdnnumberofrooms").val());
    var roomInfos = roomInfo.split("$");
    for (i = 0; i < Noofrooms; i++) {

        for (i1 = 0; i1 < roomInfos[i + 1]; i1++) {
            if ($("#txtFirstName_" + (i + 1) + "_" + (i1 + 1)).val() == "") {
                $("#txtFirstName_" + (i + 1) + "_" + (i1 + 1)).addClass('highlight_error');
                flag = false;
            }
            else {
                $("#txtFirstName_" + (i + 1) + "_" + (i1 + 1)).removeClass('highlight_error');
                //flag = true;
            }

            if ($("#txtLastName_" + (i + 1) + "_" + (i1 + 1)).val() == "") {
                $("#txtLastName_" + (i + 1) + "_" + (i1 + 1)).addClass('highlight_error');
                flag = false;
            }
            else {
                $("#txtLastName_" + (i + 1) + "_" + (i1 + 1)).removeClass('highlight_error');
                // flag = true;
            }
            /*if (PropertyType == "1") {
                if ($("#txtDOB_" + (i + 1) + "_" + (i1 + 1)).val() == "") {
                    $("#txtDOB_" + (i + 1) + "_" + (i1 + 1)).addClass('highlight_error');
                    flag = false;
                }
                else {
                    var flagDB = false;
                    var hdnDOBval = $.trim($("#hdnDOB_" + (i + 1) + "_" + (i1 + 1)).val());
                    var txtDOBval = $.trim($("#txtDOB_" + (i + 1) + "_" + (i1 + 1)).val());
                    if (hdnDOBval != "") {
                        if (hdnDOBval.split('#').length > 1) {
                            var al = hdnDOBval.split('#');
                            if ($.trim(al[0]) != "" && $.trim(al[1]) != "") {
                                var minAge = parseFloat(al[0].split('-')[0]);
                                var maxAge = parseFloat(al[0].split('-')[1]);
                                //var tDate = $.trim(al[1]);
                                //var pAge = $.trim($(IdStr).val());
                                var tDate = new Date($.trim(al[1]).split('~')[2], $.trim(al[1]).split('~')[1] - 1, $.trim(al[1]).split('~')[0]);
                                var pAge = new Date(txtDOBval.split('-')[2], txtDOBval.split('-')[1] - 1, txtDOBval.split('-')[0]);
                                if (pAge.getFullYear() == txtDOBval.split('-')[2] && pAge.getMonth() == (txtDOBval.split('-')[1] - 1) && pAge.getDate() == txtDOBval.split('-')[0]) {
                                    var diff = new Date(tDate - pAge);
                                    var cYrs = parseFloat((diff / 1000 / 60 / 60 / 24) / 365);
                                    if (cYrs >= minAge && cYrs <= maxAge) { flagDB = true; }
                                }
                            }
                        }
                    }
                    if (!flagDB) {
                        $("#txtDOB_" + (i + 1) + "_" + (i1 + 1)).addClass('highlight_error');
                        flag = false;
                    }
                    else if (!validateTextBox(txtDOBval, "0-9~-")) {
                        $("#txtDOB_" + (i + 1) + "_" + (i1 + 1)).addClass("highlight_error");
                        flag = false;
                    }
                    else {
                        $("#txtDOB_" + (i + 1) + "_" + (i1 + 1)).removeClass("highlight_error");
                    }

                }
            }*/
        }
    }
    if (document.getElementById("ContentPlaceHolder_divNoOfPax") != null) {
        if (document.getElementById("ContentPlaceHolder_divNoOfPax").style.display == "") {
            if ($("#ContentPlaceHolder_ddlAdtNo").val() == "") {
                $("#ContentPlaceHolder_ddlAdtNo").addClass('highlight_error');
                flag = false;
                $('.selectpicker').selectpicker('refresh');
            }
        }
    }
   
    if (flag == true && id == 1) {
        var mob = $.trim($("#ContentPlaceHolder_txtMobileNo").val());
        if (mob != '' && mob.length >= 10 && mob.length <= 20 && mob.indexOf('+') == 0) {
            $.ajax({
                type: "POST",
                url: "/Hotel/BookHotel.aspx/SendOTPs",
                data: '{MobileNo:"' + $.trim($("#ContentPlaceHolder_txtMobileNo").val()) + '" }',
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: GetSendOTPResponse,
                failure: function (response) {
                    $("#divOTPMsg").html("&nbsp; &nbsp; Something wrong in service.");
                }
            });
        }
        else {
            $("#ContentPlaceHolder_txtMobileNo").addClass('highlight_error');
        }
    }
    return flag;
}

function validateTermsCOnditions(id) {
    var flag = true;
    SendOTP(2);

    var IdStr = "#chkPolicy";
    if (!$(IdStr).prop("checked")) {
        $(IdStr).addClass("highlight_error");
        $($(IdStr).parent()).addClass("highlight_error");
        $(IdStr).focus();
        flag = false;
    }
    else {
        $(IdStr).removeClass("highlight_error");
        $($(IdStr).parent()).removeClass("highlight_error");
        $(IdStr).focus();
        flag = true;
    }
    if (cnty != "IN") {
        if (grecaptcha.getResponse().length == 0) {
            $('#divCaptcha').addClass("highlight_error");
            flag = false;
        }
        else
            $('#divCaptcha').removeClass("highlight_error");
    }
    return flag;
}


$(function () {
    $('#ContentPlaceHolder_txtMobileNo').on('click', function () {
        $('#ContentPlaceHolder_txtMobileNo').removeClass('highlight_error');
    });
});

function GetSendOTPResponse(response) {
    var OTPDetails = response.d;
    if (OTPDetails != null) {
        if (OTPDetails.Status == "Success") {
            $('#btnSendOTP').html("Resend OTP");
            var html = "";
            html = '<input type="hidden" id="hdnMob" name="OTPMob" value="' + $.trim($("#ContentPlaceHolder_txtMobileNo").val()) + '" />';
            html += '<div class="col-sm-4">';
            html += '<div class="form-group">';
            html += '<input type="hidden" id="hdnOTP" name="OTPDetails" value="' + OTPDetails.Details + '" />';
            html += '<input name="MobileOTP" type="text" id="txtMobileOTP" placeholder="Verify OTP"  class="form-control select_input email">';
            html += '</div>';
            html += '</div>';
            html += '<div class="col-sm-4">';
            html += '<div class="form-group">';
            html += '<a id="btnVerifyOTP" style="padding:6px;" class="cta btn"  OnClick="javascript:return verifyOTP();">Verify OTP</a>';
            html += '</div>';
            html += '</div>';
            document.getElementById('divVerifyOTP').innerHTML = html;
        }
        else {
            $("#divOTPMsg").html(OTPDetails.Details);
        }
    }
    else {
        $("#divOTPMsg").html("&nbsp;&nbsp;Please check your mobile number.");
    }
    return false;
}
function verifyOTP() {
    
    $('#divOTPMsg').html("");
    var code = $.trim($("#txtMobileOTP").val());
    if (code != '' && (code.length >= 6 && code.length <= 10)) {
        $('#txtMobileOTP').removeClass('highlight_error');
        $.ajax({
            type: "POST",
            url: "/Hotel/BookHotel.aspx/VerifyOTP",
            data: '{OTPCode:"' + $.trim($("#txtMobileOTP").val()) + '", Details:"' + $.trim($("#hdnOTP").val()) + '" }',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: GetVerifyOTPResponse,
            failure: function (response) {
                $("#divOTPMsg").html("&nbsp;&nbsp;Something wrong in service.");
            }
        });
    }
    else {
        $("#txtMobileOTP").addClass('highlight_error');
        //  $("#divOTPMsg").html("Please enter a valid OTP.");
    }

    return false;
}


function GetVerifyOTPResponse(response) {
    
    var OTPDetails = response.d;
    if (OTPDetails != null) {
        if (OTPDetails.Status == "Success") {
            if (OTPDetails.Details == "OTP Matched") {
                $('#divVerifyOTP').html("");
                $('#ContentPlaceHolder_btnSelect').removeClass("noneIMP");
                //$('#DivBookBtn').html('<input type="submit" name="ctl00$ContentPlaceHolder$btnSelect" value="Book" onclick="javascript:return validateTermsCOnditions(this);" id="ContentPlaceHolder_btnSelect"  class="cta btn fade_anim" style="width:150px;margin:10px auto;float:none;display:block">');
                //document.getElementById("ContentPlaceHolder_txtMobileNo").readOnly = true;
                $("#ContentPlaceHolder_txtMobileNo,#txtMobileNo").attr("readonly", "readonly");
                document.getElementById("btnSendOTP").style.visibility = "hidden";
            }
            else {
                $("#divOTPMsg").html("&nbsp;&nbsp;OTP Not Matched.");
            }
        }
        else {
            $("#divOTPMsg").html("&nbsp;&nbsp;OTP Not Matched.");
        }
        return false;
    }
    else {
        $("#divOTPMsg").html("&nbsp;&nbsp;Something wrong in service.");
    }
}

function AllowDOB(dob) {
    if (((event.keyCode) >= 48 && (event.keyCode <= 57)) || (event.keyCode == 45)) {
        var vAdd = "-";
        if (event.keyCode == 45)
            vAdd = "";
        var val = $(dob).val();
        if (val.length == 2)
            $(dob).val(val + vAdd);
        if (val.length == 5)
            $(dob).val(val + vAdd);
        return true;
    }
    return false;
}

function validateTextBox(strVal, strChar) {

    var flag = false;
    var arrVal = strVal.split('');
    var arrChar = strChar.split('~');
    for (var v = 0; v < arrVal.length; v++) {
        flag = false;
        var arrSubChar1 = arrVal[v];
        for (var c = 0; c < arrChar.length; c++) {
            var arrSubChar = arrChar[c];
            if (arrChar[c].indexOf('-') > 0) {
                arrSubChar = arrChar[c].split('-');
                arrSubChar1 = arrSubChar1;
                ///Below code for 
                //[A-Z] asciicode[56-90]
                //[a-z] asciicode[97-122]
                //[0-9] asciiCode [48-57]
                if (arrVal[v].charCodeAt() >= arrSubChar[0].charCodeAt() && arrVal[v].charCodeAt() <= arrSubChar[1].charCodeAt()) {
                    flag = true;
                    break;
                }
            }
            //Below code for 
            //any other specific char e.g. whitespace,@.
            else if (arrVal[v].charCodeAt() == arrSubChar[0].charCodeAt()) {
                flag = true;
                break;
            }
        }
        if (flag == false)
            break;

    }
    return flag;
}
