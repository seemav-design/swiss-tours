$(function () {

    $(document).ready(function () {
        var isPick1 = document.getElementById('ContentPlaceHolder_hdnIsPickUp').value;
        var isQns = document.getElementById('ContentPlaceHolder_hdnIsBkgQns').value;
        if (isPick1 == 1) {
            $("#ContentPlaceHolder_divHotelPickUpOption").show();
            $("#ContentPlaceHolder_dvhotelPckup").hide();

        }
        else if (isPick1 == 2) {
            $("#ContentPlaceHolder_dvhotelPckup").show();
            $("#ContentPlaceHolder_divHotelPickUpOption").hide();
        }
        if (isQns == 1) {
            $("#ContentPlaceHolder_bookingquestions").show();
        }
        else {
            $("#ContentPlaceHolder_bookingquestions").hide();
        }
        //var date = $('#' + controlIdPrefix + 'hdnBookDate').val();
        ////$('#lblDate').val(date);
        //$('#' + controlIdPrefix + "frmHotelPickUp_" + 'lblDate').text(date);
    });

});

function Validation() {
    var isPick1 = document.getElementById('ContentPlaceHolder_hdnIsPickUp').value;
    var isQns = document.getElementById('ContentPlaceHolder_hdnIsBkgQns').value;
    $($('.request_form').find('.highlight_error')).each(function (index, elem) {
        $(elem).removeClass('highlight_error');
    });
    if (isPick1 == 1) {
        var flag = true;
        if ($("#ContentPlaceHolder_txtholnot").val() == "") {
            $("#ContentPlaceHolder_txtholnot").addClass('highlight_error');
            flag = false;
        }
    }
    else if (isPick1 == 2) {
        if ($("#ContentPlaceHolder_txtholnot").val() == "") {
            $("#ContentPlaceHolder_txtholnot").addClass('highlight_error');
            flag = false;
        }
    }
    if (isQns == 1) {
        var flag = true;
        if ($("#ContentPlaceHolder_txtholnot").val() == "") {
            $("#ContentPlaceHolder_txtholnot").addClass('highlight_error');
            flag = false;
        }

        var isQuesCount = document.getElementById('ContentPlaceHolder_Hiddenbookingquecount').value;
        for (i = 0; i < isQuesCount; i++) {
            var controlId = "#AnswerID" + i;
            if ($(controlId).val() == "") {
                $(controlId).addClass('highlight_error');
                flag = false;
            }
        }

    }
    $('.selectpicker').selectpicker('refresh');


    return flag;
}


 