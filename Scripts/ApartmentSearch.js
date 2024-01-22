$(function () {

    try {
        $("#ContentPlaceHolder_txtSearchDestination").autocomplete({
            source: function (request, response) {
                var searchtext = '';
                searchtext = document.getElementById("ContentPlaceHolder_txtSearchDestination").value;
                $.ajax({
                    type: "POST",
                    url: "/Apartment/ApartmentSearch.aspx/GetCountryCityListData",
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    data: '{SearchText: "' + searchtext + '"}',
                    success: function (data) {
                        response(data.d);
                    },
                    failure: function (response) {
                        alert(response.d);
                    }
                });
            },
            minLength: 3,
            select: function (event, ui) {
                document.getElementById("ContentPlaceHolder_hdnSearchFrom").value = ui.item.CityName + ":" + ui.item.CityCode + ":" + ui.item.CountryName + ":" + ui.item.CountryCode + ":" + ui.item.RegionCode + ":" + ui.item.RegionName + ":" + ui.item.PlaceCode + ":" + ui.item.PlaceName;
            }
        });
    }
    catch (e) {
        //document.getElementById("ContentPlaceHolder_hdnSearchFrom").value = e.message;
    }
    try {
        $('.ui-autocomplete').css('max-height', '500px');//this for auto complete box height   
        $('.ui-autocomplete').css('height', 'auto');//this for auto complete box height   
    } catch (e) { document.getElementById("ContentPlaceHolder_hdnSearchFrom").value = e.message; }
});





function ViewCancellationPolicy(id, Details, Apartmentcode) {
    //
    debugger;
    openProgressIndicator();
    var Url = window.location.search;
    //id = id.substring(1);
    //var SearchRefId = Url.substring(Url.indexOf("SearchRefId")).split("=")[1].split("&")[0];
    document.getElementById(id.replace("h", "")).innerHTML = '';
    $.ajax({
        type: "POST",
        url: "/Apartment/ApartmentListIN.aspx/CancellationPolicies",
        data: '{OtherDetails: "' + Details + '",ApartmentCode:"' + Apartmentcode + '",SearchRefID:"' + document.getElementById("ContentPlaceHolder_hdnSearchRefId").value + '"}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            if (data.d == "") {
                var url = window.location.origin + '/Default.aspx';
                window.location.href = url;
            }
            else {
                var list = $.parseJSON(data.d);
                document.getElementById(id.replace("h", "")).innerHTML = list;
                //document.getElementById(id).style.display = "";
                closeProgressIndicator();
            }
        },
        failure: function (response) {
            alert(response.d);
        }
    });
}

function validationtoconfirmavailablity() {
    var flag = true;

    if (document.getElementById("ContentPlaceHolder_txtCheckInDate").value == "") {
        $("#ContentPlaceHolder_txtCheckInDate").addClass('highlight_error');
        document.getElementById("ContentPlaceHolder_txtCheckInDate").focus();
        flag = false;
    }
    else {

        flag = true;
    }
    var noofdays = $("#ContentPlaceHolder_ddlDuration").val();
    if (noofdays == "") {
        $("#ContentPlaceHolder_ddlDurationOfStay").addClass('highlight_error');
        flag = false;
    }
    else {

        flag = true;
    }
    return flag;

}



function Validation() {
    $($('.search_forms').find('.highlight_error')).each(function (index, elem) {
        $(elem).removeClass('highlight_error');
    });

    var flag = true;
    if (document.getElementById("ContentPlaceHolder_txtSearchDestination").value == "") {
        $("#ContentPlaceHolder_txtSearchDestination").addClass('highlight_error');
        document.getElementById("ContentPlaceHolder_txtSearchDestination").focus();
        flag = false;
    }

    if (document.getElementById("ContentPlaceHolder_txtCheckInDate").value == "") {
        $("#ContentPlaceHolder_txtCheckInDate").addClass('highlight_error');
        document.getElementById("ContentPlaceHolder_txtCheckInDate").focus();
        flag = false;
    }
    var duration = $("#ContentPlaceHolder_ddlDuration").val();
    if (duration == "") {
        $("#ContentPlaceHolder_ddlDurationOfStay").addClass('highlight_error');
        flag = false;
    }

    var adult = $("#ContentPlaceHolder_NoofPax").val();
    if (adult == "") {
        $("#ContentPlaceHolder_NumberOfPersons").addClass('highlight_error');
        flag = false;
    }



    $(function () {
        $('#ContentPlaceHolder_txtSearchByCity').keydown(function () {
            $('#ContentPlaceHolder_txtSearchByCity').removeClass('highlight_error');
            return true;
        });
    });

    $(function () {
        $('#ContentPlaceHolder_txtCheckInDate').keydown(function () {
            $('#ContentPlaceHolder_txtCheckInDate').removeClass('highlight_error');
            return true;
        });
    });

    return flag;
}



function invokelnkbtnPopular(vids) {
    var id = "lnkBtnCodePopular" + (vids + 1);
    var btnvalue = document.getElementById(id).value;
    var id2 = "hdncityvalues" + (vids + 1);
    document.getElementById("ContentPlaceHolder_hdnSearchFrom").value = document.getElementById(id2).value;
    document.getElementById("ContentPlaceHolder_txtSearchDestination").value = btnvalue;
    window.scrollTo(0, 0);
}


function invokelnkbtnPopularApt(vids, addLink) {
    var id = "lnkBtnCodePopular" + (vids + 1);
    var btnvalue = document.getElementById(id).value;
    $.ajax({
        type: "POST",
        url: "ApartmentSearch.aspx/Search_Direct_Hotel",
        data: '{addLink:"' + addLink + '"}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            if (data.d != '') {
                var windowUrl = window.location.origin + data.d;
                window.open(windowUrl);
                //w.location = data.d;
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
