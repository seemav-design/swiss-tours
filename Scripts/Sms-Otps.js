/// <reference path="utils.js" />
/// <reference path="utils.js" />
/// <reference path="utils.js" />
/// <reference path="utils.js" />

$(document).ready(function () {
    if (countrycode != 'IN') { $('#divOTPBtn').addClass('hide'); } else { $('#divProccedBtn').addClass('hide'); }
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
function SendOTP() {

    var flag = true;
    $('#divOTPMsg').html("");
    if (flag == true) {
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
        }
    }
    return flag;
}
function GetSendOTPResponse(response) {
    var OTPDetails = response.d;
    if (OTPDetails != null) {
        if (OTPDetails.Status == "Success") {

            $('#divProccedBtn').removeClass('hide');
            $('#divOTPBtn').addClass('hide');
            $('#divMobileNo').addClass('hide');
            $('#divVerifyOTP').removeClass('hide');
            $('#hdnOTP').val($.trim(OTPDetails.Details));
            $('#btnProcced').html('<strong>Verify OTP & Proceed</strong>');
            $('#btnProcced').attr('onclick', 'return verifyOTP();')
        }
        else {
            $("#divOTPMsg").html("Please check your mobile number.");
        }
    }
    else {
        $("#divOTPMsg").html("Please check your mobile number.");
    }
    return false;
}

function verifyOTP() {
    $('#divOTPMsg').html("");
    var flag = true;
    var code = $.trim($("#ContentPlaceHolder_txtMobileOTP").val());    
    if (flag == true) {
        if (code != '' && (code.length >= 6 && code.length <= 10)) {
            $('#ContentPlaceHolder_txtMobileOTP').removeClass('highlight_error');
            $.ajax({
                type: "POST",
                url: "/Hotel/BookHotel.aspx/VerifyOTP",
                data: '{OTPCode:"' + $.trim($("#ContentPlaceHolder_txtMobileOTP").val()) + '", Details:"' + $.trim($("#hdnOTP").val()) + '" }',
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: GetVerifyOTPResponse,
                failure: function (response) {
                    $("#divOTPMsg").html("Something went wrong in OTP service.");
                }
            });
        }
        else {
            $("#ContentPlaceHolder_txtMobileOTP").addClass('highlight_error');
            //  $("#divOTPMsg").html("Please enter a valid OTP.");
        }
    }
    
}
function GetVerifyOTPResponse(response) {

    var OTPDetails = response.d;
    if (OTPDetails != null) {
        if (OTPDetails.Status == "Success") {
            if (OTPDetails.Details == "OTP Matched") {
                $("#ContentPlaceHolder_hdnIsOTPMatched").val('Yes');
                $('#divVerifyOTP').addClass('hide');
                redirect();
                $('#btnProcced').html('<strong>Proceed</strong>');
            }
            else {
                $("#divOTPMsg").html("OTP Not Matched.");
            }
        }
        else {
            $("#divOTPMsg").html("OTP Not Matched.");
        }
        return false;
    }
    else {
        $("#divOTPMsg").html("Something went wrong in OTP verification service.");
    }
}