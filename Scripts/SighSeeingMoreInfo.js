function ConfirmAvaliablity(id) {
    openProgressIndicator();
    var url = "";
    var searchRefID = document.getElementById("ContentPlaceHolder_hdnSearchRefId").value;
    //var productName = document.getElementById("ContentPlaceHolder_sightSeeingName").innerText + ':' + searchRefID;
    var productName = document.getElementById("ContentPlaceHolder_sightSeeingName").innerText;
    var productCode = document.getElementById("ContentPlaceHolder_tourCode").innerText;
    var tourGradeid = "tourGrade" + id;
    var tourGrade = document.getElementById(tourGradeid).innerText;
    var sellPriceid = "sellprice" + id;
    var sellPrice = document.getElementById(sellPriceid).innerText;
    var tourGradeTitleid = "tourGradeTitle" + id;
    var tourGradeTitle = document.getElementById(tourGradeTitleid).innerText;
    var drdid = "drdDate" + id;
    var e = document.getElementById(drdid);
    var datedrd = document.getElementById(drdid);
    var bookingDate = e.options[e.selectedIndex].text;
    document.getElementById("ContentPlaceHolder_hdnConfirmbtnID").value = id;

    var xxpolicy = document.getElementById("ContentPlaceHolder_cancellationPolicy").innerText;
    var errorId = "errorMessage" + id;

    if (bookingDate == "Select Date") {
        closeProgressIndicator();
        $("#drdDate" + id).addClass('highlight_error');
        $('.selectpicker').selectpicker('refresh');
        return false;
    }
    else {
        //document.getElementById(errorId).style.display = 'block';
    }

    //url = window.location.origin + '/Sightseeing/BookingWait.aspx?SearchRefId=' + document.getElementById("ContentPlaceHolder_hdnSearchRefId").value;
    // var w = window.open(url);
    $.ajax({
        type: "POST",
        url: "SighSeeingMoreInfo.aspx/ConfirmAvaliablity",
        data: '{productCode:"' + document.getElementById("ContentPlaceHolder_tourCode").innerText + '",tourGradeCode:"' + tourGrade + '",bookingDate:"' + bookingDate + '",productName:"' + productName + '",tourGradeTitle:"' + tourGradeTitle + '",sellPrice:"' + sellPrice + '",xxpolicy:"' + xxpolicy + '" ,SearchRefID:"' + document.getElementById("ContentPlaceHolder_hdnSearchRefId").value + '"}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            if (data.d != '') {
                closeProgressIndicator();
                if (data.d == 2) {
                    //  w.close();
                    document.getElementById(errorId).innerText = "Same Tour with different currency is not allowed";
                    document.getElementById(errorId).style.display = 'block';
                    document.getElementById(errorId).style.fontWeight = 'bold';
                    return false;
                }

                //else if (data.d.includes("1:")) {
                else if (data.d.includes("T#NA1:")) {
                    var errormsg = data.d.split(':');
                    if (errormsg[1].split('[') == '"TRAVELLER_SPEC_NOT_PROVIDER"') {
                        var errormsg1 = 'Tour is not available';
                    }

                    // w.close();
                    document.getElementById("ContentPlaceHolder_bookingquestions1").style.display = 'none';
                    document.getElementById("SupplierErrorMessage").innerText = "The tour is not available for the mentioned date. Kindly choose an alternative date.";
                    //errormsg[1];
                    document.getElementById("SupplierErrorMessage").style.fontWeight = 'bold';
                    $(".fancybox_trig").fancybox({ "touch": false }).trigger("click");
                    return false;
                }

                else if (data.d.includes("T#NM3:")) {
                    var errormsg2 = data.d.split(':');
                    // document.getElementById("SupplierErrorMessage").innerText = errormsg2[1];
                    document.getElementById("ContentPlaceHolder_bookingquestions1").style.display = 'none';
                    document.getElementById("SupplierErrorMessage").innerText = "The tour is not available for the mentioned date. Kindly choose an alternative date.";
                    document.getElementById("SupplierErrorMessage").style.fontWeight = 'bold';
                    $(".fancybox_trig").fancybox({ "touch": false }).trigger("click");
                    // w.close();
                    return false;
                }
                else if (data.d.includes("T#NA5")) {
                    document.getElementById("ContentPlaceHolder_SupplierErrorMsg").style.display = '';
                    //document.getElementById("SupplierErrorMessage").innerText = errormsg[1];
                    document.getElementById("ContentPlaceHolder_bookingquestions1").style.display = 'none';
                    document.getElementById("SupplierErrorMessage").innerText = "The selected tour does not operate in English. Kindly select an alternative tour.";
                    document.getElementById("SupplierErrorMessage").style.fontWeight = 'bold';
                    $(".fancybox_trig").fancybox({ "touch": false }).trigger("click");
                    return false;
                }
                else if (data.d.includes("<div class='cd_tit")) {
                    document.getElementById(errorId).style.display = 'none';
                    document.getElementById("contest_pop").style.display = 'none';
                    document.getElementById("ContentPlaceHolder_SupplierErrorMsg").style.display = 'none';
                    document.getElementById("SupplierErrorMessage").style.display = 'none';
                    document.getElementById("ContentPlaceHolder_bookingquestions1").style.display = '';
                    var windowUrl = window.location.origin + data.d;
                    document.getElementById("ContentPlaceHolder_bookingquestions1").innerHTML = data.d;
                    $(".fancybox_trig").fancybox({ "touch": false }).trigger("click")
                }
                else {
                    //url = window.location.origin + '/Sightseeing/BookingWait.aspx';
                    //var w = window.open(url);
                    //document.getElementById(errorId).style.display = 'none';
                    //var windowUrl = window.location.origin + data.d;
                    //w.location = data.d;
                    //url = window.location.origin + '/Sightseeing/BookingWait.aspx';
                    //var w = window.open(url);
                    document.getElementById(errorId).style.display = 'none';
                    // var windowUrl = window.location.origin + data.d;
                    // w.location = data.d;
                    var url = window.location.origin + data.d;
                    window.location.href = url;
                }
            }
            else {
                return false;
            }
        },
        failure: function (data) {
            alert(data.d);
        }
    });
    return false;
}

function PickupValidation(hotelpickup, isbook, quCount) {
    openProgressIndicator();
    var isPick1 = hotelpickup;
    var isQns = isbook;
    var queCount = quCount;
    var ids = document.getElementById("ContentPlaceHolder_hdnConfirmbtnID").value;
    var searchRefID = document.getElementById("ContentPlaceHolder_hdnSearchRefId").value;
    //var productName = document.getElementById("ContentPlaceHolder_sightSeeingName").innerText + ':' + searchRefID;
    var productName = document.getElementById("ContentPlaceHolder_sightSeeingName").innerText;
    var productCode = document.getElementById("ContentPlaceHolder_tourCode").innerText;
    var xxpolicy = document.getElementById("ContentPlaceHolder_cancellationPolicy").innerText;
    var tourGradeid = "tourGrade" + ids;
    var tourGrade = document.getElementById(tourGradeid).innerText;
    var sellPriceid = "sellprice" + ids;
    var sellPrice = document.getElementById(sellPriceid).innerText;
    var tourGradeTitleid = "tourGradeTitle" + ids;
    var tourGradeTitle = document.getElementById(tourGradeTitleid).innerText;
    var drdid = "drdDate" + ids;
    var e = document.getElementById(drdid);
    var datedrd = document.getElementById(drdid);
    var bookingDate = e.options[e.selectedIndex].text;

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
        for (i = 0; i < queCount; i++) {
            var controlId = "#AnswerID" + i;
            if ($(controlId).val() == "") {
                $(controlId).addClass('highlight_error');
                flag = false;
            }
        }

    }


    if (flag == true) {
        $('.selectpicker').selectpicker('refresh');
        var answers = "";
        for (i = 0; i < queCount; i++) {
            var controlId = "AnswerID" + i;
            var answers1 = document.getElementById(controlId).value;
            answers += answers1 + ",";

        }
        $.ajax({
            type: "POST",
            url: "SighSeeingMoreInfo.aspx/insertPaxdetails",
          //data: '{productCode:"' + document.getElementById("ContentPlaceHolder_tourCode").innerText + '",ishotelPickup:"' + isPick1 + '",isBookingque:"' + isQns + '",answers:"' + answers + '",tourGradeCode:"' + tourGrade + '",bookingDate:"' + bookingDate + '",productName:"' + productName + '",tourGradeTitle:"' + tourGradeTitle + '",sellPrice:"' + sellPrice + '",xxpolicy:"' + xxpolicy + '" ,SearchRefID:"' + document.getElementById("ContentPlaceHolder_hdnSearchRefId").value + '"}',
            data: '{productCode:"' + document.getElementById("ContentPlaceHolder_tourCode").innerText + '",ishotelPickup:"' + isPick1 + '",isBookingque:"' + isQns + '",answers:"' + answers + '",tourGradeCode:"' + tourGrade + '",bookingDate:"' + bookingDate + '",productName:"' + productName + '",tourGradeTitle:"' + tourGradeTitle + '",sellPrice:"' + sellPrice + '",xxpolicy:"' + xxpolicy + '" ,SearchRefID:"' + document.getElementById("ContentPlaceHolder_hdnSearchRefId").value + '"}',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
                if (data.d != '') {
                    if (data.d.includes("T#NA1:")) {
                        closeProgressIndicator();
                        var errormsg = data.d.split(':');
                        if (errormsg[1].split('[') == '"TRAVELLER_SPEC_NOT_PROVIDER"') {
                            var errormsg1 = 'Tour is not available';
                        }
                        document.getElementById("ContentPlaceHolder_bookingquestions1").style.display = 'none';

                        document.getElementById("ContentPlaceHolder_SupplierErrorMsg").style.display = '';
                        document.getElementById("SupplierErrorMessage").style.display = '';
                        document.getElementById("SupplierErrorMessage").innerText = errormsg[1];
                        document.getElementById("SupplierErrorMessage").style.fontWeight = 'bold';
                        $(".fancybox_trig").fancybox({ "touch": false }).trigger("click");
                        closeProgressIndicator();
                        return false;
                    }
                    //else if (data.d.includes("MoreTransaction")) {
                    //    document.getElementById("ContentPlaceHolder_bookingquestions1").style.display = 'none';

                    //    document.getElementById("ContentPlaceHolder_SupplierErrorMsg").style.display = '';
                    //    document.getElementById("SupplierErrorMessage").style.display = '';
                    //    document.getElementById("SupplierErrorMessage").innerText = "More than 3 products is not allowed shopping cart";
                    //    document.getElementById("SupplierErrorMessage").style.fontWeight = 'bold';
                    //    $(".fancybox_trig").fancybox({ "touch": false }).trigger("click");
                    //    closeProgressIndicator();
                    //    return false;
                    //}
                    else if (data.d.includes("T#NM3:")) {

                        var errormsg2 = data.d.split(':');
                        document.getElementById("ContentPlaceHolder_bookingquestions1").style.display = 'none';
                        document.getElementById("ContentPlaceHolder_SupplierErrorMsg").style.display = '';
                        document.getElementById("SupplierErrorMessage").innerText = errormsg2[1];
                        document.getElementById("SupplierErrorMessage").style.fontWeight = 'bold';
                        $(".fancybox_trig").fancybox({ "touch": false }).trigger("click");
                        closeProgressIndicator();
                        // w.close();
                        return false;
                    }
                    else {
                        openProgressIndicator();
                        //url = window.location.origin + '/Sightseeing/BookingWait.aspx';
                        //var w = window.open(url);
                        //var windowUrl = window.location.origin + data.d;
                        //w.location = data.d;
                        var url = window.location.origin + data.d;
                        window.location.href = url;
                        flag = false;
                        closeProgressIndicator();
                    }
                }
                else {
                    flag = false;
                }
            },
            failure: function (data) {
                alert(data.d);
            }
        });
    }
    return flag;
}





function drdpop(id) {
    var ids = '#' + id;
    $(ids).on("change", function () {
        var period = this.value;
        var period1 = this.selectedIndex;
        var t = '#' + id + ' option:selected';
        var period12 = $(t).text();
        var productCode = document.getElementById("ContentPlaceHolder_tourCode").innerText;
        $.ajax({

            type: "POST",
            url: "SighSeeingMoreInfo.aspx/CreateXxpolicy1",
            data: '{traveldate:"' + period12 + '",productCode:"' + productCode + '",merchantCancellable:"' + document.getElementById("ContentPlaceHolder_hdnIScancellable").value + '"}',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
                if (data.d != '') {
                    closeProgressIndicator();
                    document.getElementById("ContentPlaceHolder_dateOfVisit").innerText = period12;
                    document.getElementById("ContentPlaceHolder_cancellationPolicy").innerHTML = data.d;
                }
                else {
                    document.getElementById("ContentPlaceHolder_dateOfVisit").innerText = period12;
                    flag = false;
                }
            },
            failure: function (data) {
                alert(data.d);
            }
        });
    });
}


function pop(id) {
    openProgressIndicator();
    var tourGradeid = "tourGrade" + id;
    var pricebreakupdivId = "Pricebreakupdiv" + id;
    var tourGrade = document.getElementById(tourGradeid).innerText;
    document.getElementById(pricebreakupdivId).innerHTML = '';

    var drdid = "drdDate" + id;
    var e = document.getElementById(drdid);
    var bookingDate = e.options[e.selectedIndex].text;
    if (bookingDate == "Select Date") {
        closeProgressIndicator();
        $("#drdDate" + id).addClass('highlight_error');
        $('.selectpicker').selectpicker('refresh');
        return false;
    }
    else {

        $.ajax({
            type: "POST",
            url: "SighSeeingMoreInfo.aspx/PriceBreakup",
            data: '{productCode:"' + document.getElementById("ContentPlaceHolder_tourCode").innerText + '",tourGradeCode:"' + tourGrade + '",bookingDate:"' + bookingDate + '",SearchRefID:"' + document.getElementById("ContentPlaceHolder_hdnSearchRefId").value + '"}',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
                closeProgressIndicator();
                if (data.d == "") {
                    var url = window.location.origin + '/Default.aspx';
                    window.location.href = url;
                }
                else {
                    var list = $.parseJSON(data.d);
                    document.getElementById(pricebreakupdivId).style.display = "block";
                    document.getElementById(pricebreakupdivId).innerHTML = list;
                    closeProgressIndicator();
                }
            },
            failure: function (data) {
                alert(data.d);
            }
        });
    }
}

