$(document).ready(function () {
    //alert("done");
    document.getElementById("dateOfJourney").value = document.getElementById("ContentPlaceHolder_hdndateOfJourney").value;
    //document.getElementById("ddlDuration").value = document.getElementById("ContentPlaceHolder_hdnduration").value;
    $('#ddlDuration').val(document.getElementById("ContentPlaceHolder_hdnduration").value);
})
function pop(monthName, id) {
    openProgressIndicator();
    //document.getElementById("cal1").style.visibility = "hidden";
    if (id == 0) {
        document.getElementById("dateOfJourney").value = document.getElementById("ContentPlaceHolder_hdndateOfJourney").value;
    }
    else {
        document.getElementById("dateOfJourney").value = id.split('ay')[1] + '-' + monthName;
    }
    var duration1 = document.getElementById("ContentPlaceHolder_hdnduration").value;
    $('#ddlDuration').val(duration1);

    var duration = document.getElementById("ContentPlaceHolder_hdnNoOfDays").value;

    var dateOfJourney = document.getElementById("ContentPlaceHolder_hdndateOfJourney").value;
    var apartmentCode = document.getElementById("ContentPlaceHolder_hdnapartmentCode").value;
    var Type = "0";
    //var val1 = $("#drdmonth").val();
    var val1 = monthName;
    document.getElementById("ContentPlaceHolder_hdnchageMonth").value = val1;

    $.ajax({
        type: "POST",
        url: "/Apartment/apartment_non_contracted.aspx/CaladerAvailablity",
        data: '{monthdate:"' + val1 + '",ApartmentCode:"' + apartmentCode + '",Type:"' + Type + '",duration:"' + duration + '",SearchRefID:"' + document.getElementById("ContentPlaceHolder_hdnSearchRefId").value + '"}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            if (data.d == "") {
                var url = window.location.origin + '/Default.aspx';
                window.location.href = url;
                closeProgressIndicator();
            }
            else {
                debugger;
                var list = $.parseJSON(data.d);
                document.getElementById("divCalander").innerHTML = list;
                closeProgressIndicator();
                return false;
            }
        },
        failure: function (response) {
            alert(response.d);
        }
    });
}


function ConfirmAvaliablity(id) {
    openProgressIndicator();

    var ApartmentCode = document.getElementById("ContentPlaceHolder_hdnapartmentCode").value;
    var CheckIndate = document.getElementById("dateOfJourney").value;
    var duration = document.getElementById("ddlDuration").value;

    document.getElementById("ContentPlaceHolder_hdndateOfJourney").value = document.getElementById("dateOfJourney").value;

    document.getElementById("ContentPlaceHolder_hdnduration").value = duration;
    $.ajax({
        type: "POST",
        url: "/Apartment/apartment_non_contracted.aspx/ConfirmAvaliablity",
        data: '{ApartmentCode:"' + ApartmentCode + '",NumberOfDays:"' + document.getElementById("ddlDuration").value + '",CheckIndate:"' + document.getElementById("dateOfJourney").value + '",SearchRefID:"' + document.getElementById("ContentPlaceHolder_hdnSearchRefId").value + '"}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            if (data.d != '') {
                closeProgressIndicator();
                if (data.d == 2) {
                    return false;
                }
                else if (data.d.includes("1:")) {
                    document.getElementById("SupplierErrorMessage").innerText = 'Unfortunately this property is not available for the required dates.';
                    document.getElementById("SupplierErrorMessage").style.fontWeight = 'bold';
                    $(".fancybox_trig").fancybox({ "touch": false }).trigger("click");
                    return false;
                }
                else if (data.d.includes("3:")) {
                    document.getElementById("SupplierErrorMessage").innerText = 'Unfortunately this property is not available for the required dates.';
                    document.getElementById("SupplierErrorMessage").style.fontWeight = 'bold';
                    $(".fancybox_trig").fancybox({ "touch": false }).trigger("click");
                    return false;
                }
                else {
                    //closeProgressIndicator();
                    ////var importantStuff = window.open('', '_blank');
                    ////window.location.href = window.location.origin + data.d;
                    //var url = "";

                    //window.open('', '_blank');
                    //url = window.location.origin + data.d;
                    //var w = window.open(url);


                    //  url = window.location.origin + '/Apartments/Apartment_BookingWait.aspx';
                    //  var w = window.open(url);

                    //var windowUrl = wimondow.location.origin + data.d;
                    //w.location = data.d;
                    // document.location.href = windowUrl;
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

function callFirst() {
    if (document.getElementById("ContentPlaceHolder_hdnchageMonth").value == '') {
        var duration = document.getElementById("ContentPlaceHolder_hdnduration").value;
        document.getElementById("dateOfJourney").value = document.getElementById("ContentPlaceHolder_hdndateOfJourney").value;
        var dateOfJourney = document.getElementById("ContentPlaceHolder_hdndateOfJourney").value;
        var datesp = dateOfJourney.split('-');
        $('#ddlDuration').val(duration);
        var monthName = $("#drdmonth").val();
        pop(monthName, 0);
    }
    else {
        var monthName1 = document.getElementById("ContentPlaceHolder_hdnchageMonth").value;
        return pop(monthName1, 0);
    }


}


function validationtoconfirmavailablity() {
    var flag = true;

    if (document.getElementById("dateOfJourney").value == "") {
        $("#dateOfJourney").addClass('highlight_error');
        document.getElementById("dateOfJourney").focus();
        flag = false;
    }
    else {

        flag = true;
    }
    var noofdays = $("#ContentPlaceHolder_ddlDuration").val();
    if (noofdays == "") {
        $("#ddlDurationOfStay").addClass('highlight_error');
        flag = false;
    }
    else {

        flag = true;
    }
    return flag;

}



function FixDuration(monthName, id) {
    openProgressIndicator();
    var date = id.split('ay')[1] + '-' + monthName;
    //var CheckIndate = document.getElementById("dateOfJourney").value;
    var duration = document.getElementById("ddlDurationOfStay").innerText;
    //var duration = document.getElementById("ContentPlaceHolder_hdnNoOfDays").value;
    var dateOfJourney = document.getElementById("ContentPlaceHolder_hdndateOfJourney").value;
    var apartmentCode = document.getElementById("ContentPlaceHolder_hdnapartmentCode").value;
    var Type = "0";
    $('ContentPlaceHolder_hdndateOfJourney').val('test');
    document.getElementById("ContentPlaceHolder_hdnchageMonth").value = monthName;

    $.ajax({
        type: "POST",
        url: "/Apartment/apartment_non_contracted.aspx/CaladerAvailablity",
        data: '{monthdate:"' + monthName + '",ApartmentCode:"' + apartmentCode + '",Type:"' + Type + '",duration:"' + duration + '",SearchRefID:"' + document.getElementById("ContentPlaceHolder_hdnSearchRefId").value + '"}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            if (data.d == "") {
                var url = window.location.origin + '/Default.aspx';
                window.location.href = url;
            }
            else if (data.d.includes("2:")) {

                document.getElementById("SupplierErrorMessage").innerText = 'The property you have requested is not available for the dates selected. Kindly check for alternative dates or call your nearest SWISStours office.';
                document.getElementById("SupplierErrorMessage").style.fontWeight = 'bold';
                $(".fancybox_trig").fancybox({ "touch": false }).trigger("click");
                return false;

            }
            else {

                var list = $.parseJSON(data.d);
                document.getElementById("divCalander").innerHTML = list;
                document.getElementById("dateOfJourney").value = date;
                $(".calanderholder").slideUp();
                // document.getElementById("dateOfJourney").style.display = "none";
                closeProgressIndicator();
                return true;
            }
        },
        failure: function (response) {
            alert(response.d);
        }
    });

}
function OnrequestPopUp() {
    document.getElementById("SupplierErrorMessage").innerText = 'The property you have requested is not available for the dates selected. Kindly check for alternative dates or call your nearest SWISStours office.';
    document.getElementById("SupplierErrorMessage").style.fontWeight = 'bold';
    $(".fancybox_trig").fancybox({ "touch": false }).trigger("click");
    return false;
}
