$(function () {
    try {
        $("#ContentPlaceHolder_txtSearchFromCity").autocomplete({
            source: function (request, response) {
                var searchtext = '';
                searchtext = document.getElementById("ContentPlaceHolder_txtSearchFromCity").value;
                $.ajax({
                    type: "POST",
                    url: "/AirLines/FlightSearch.aspx/GetCountryCityListData",
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
                document.getElementById("ContentPlaceHolder_hdnSearchFrom").value = ui.item.CityName.trim() + ":" + ui.item.CityCode.trim() + ":" + ui.item.CountryName.trim() + ":" + ui.item.CountryCode.trim() + ":" + ui.item.AirPortName + ":" + ui.item.AirPortCode;
            }
        });
    } catch (e) { }
    try {
        $('.ui-autocomplete').css('max-height', '500px');//this for auto complete box height   
        $('.ui-autocomplete').css('height', 'auto');//this for auto complete box height   
    } catch (e) { }
});

$(function () {
    try {
        $("#ContentPlaceHolder_txtSearchToCity").autocomplete({
            source: function (request, response) {
                var searchtext = '';
                searchtext = document.getElementById("ContentPlaceHolder_txtSearchToCity").value;
                $.ajax({
                    type: "POST",
                    url: "/AirLines/FlightSearch.aspx/GetCountryCityListData",
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
                document.getElementById("ContentPlaceHolder_hdnSearchTo").value = ui.item.CityName.trim() + ":" + ui.item.CityCode.trim() + ":" + ui.item.CountryName.trim() + ":" + ui.item.CountryCode.trim() + ":" + ui.item.AirPortName + ":" + ui.item.AirPortCode;
            }


        });
    } catch (e) { }
    try {
        $('.ui-autocomplete').css('max-height', '500px');//this for auto complete box height   
        $('.ui-autocomplete').css('height', 'auto');//this for auto complete box height   
    } catch (e) { }
});

function Validation() {
    $($('.search_forms').find('.highlight_error')).each(function (index, elem) {
        $(elem).removeClass('highlight_error');
    });
    var flag = true;
    var adult = $("#ContentPlaceHolder_adult_select").val();
    if (adult == "") {
        $("#adult_1").addClass('highlight_error');
        flag = false;
    }
    var category = $("#ContentPlaceHolder_drdClassCategory").val();
    if (category == "") {
        $("#ContentPlaceHolder_classCategory").addClass('highlight_error');
        flag = false;
    }

    if (document.getElementById("ContentPlaceHolder_txtSearchFromCity").value == "") {
        $("#ContentPlaceHolder_txtSearchFromCity").addClass('highlight_error');
        document.getElementById("ContentPlaceHolder_txtSearchFromCity").focus();
        flag = false;
    }
    if (document.getElementById("ContentPlaceHolder_txtSearchToCity").value == "") {
        $("#ContentPlaceHolder_txtSearchToCity").addClass('highlight_error');
        document.getElementById("ContentPlaceHolder_txtSearchToCity").focus();
        flag = false;
    }
    if (document.getElementById("ContentPlaceHolder_txtdepartureDate").value == "") {
        $("#ContentPlaceHolder_txtdepartureDate").addClass('highlight_error');
        document.getElementById("ContentPlaceHolder_txtdepartureDate").focus();
        flag = false;
    }

    if (document.getElementById("ContentPlaceHolder_hdnTripType").value == "RoundTripWay") {
        if (document.getElementById("ContentPlaceHolder_r_return_date").value == "") {
            $("#ContentPlaceHolder_r_return_date").addClass('highlight_error');
            document.getElementById("ContentPlaceHolder_r_return_date").focus();
            flag = false;
        }
    }



    $(function () {
        $('#ContentPlaceHolder_txtSearchFromCity').keydown(function () {
            $('#ContentPlaceHolder_txtSearchFromCity').removeClass('highlight_error');
            return true;
        });
        $('#ContentPlaceHolder_txtSearchToCity').keydown(function () {
            $('#ContentPlaceHolder_txtSearchToCity').removeClass('highlight_error');
            return true;
        });
    });

    $(function () {
        $('#ContentPlaceHolder_txtdepartureDate').keydown(function () {
            $('#ContentPlaceHolder_txtdepartureDate').removeClass('highlight_error');
            return true;
        });
    });

    return flag;
}



var currPage = 1; // Index of the current page
var pgCount = 0;
var StarRating = "";
var StatusSelector = "";
var PolicySelector = "";
var LocationSelector = "";
var HotelChainSelector = "";
function SetPaging(paging) {
    openProgressIndicator();
    AirLines_Time = "";
    AirLineName = "";
    //$("input[name='selector[]']:checked").each(function (i) {
    //    AirLines_Time += $(this).val() + ",";
    //});
    //$("input[name='AirLines_Name']:checked").each(function (i) {
    //    AirLineName += $(this).val() + ",";
    //});

    document.getElementById("ContentPlaceHolder_listing_jk").innerHTML = '';
    currPage = paging;
    $.ajax({
        type: "POST",
        url: "Flights_Oneway_Listing.aspx/Filtering",

        data: '{SearchRefId: "' + document.getElementById("ContentPlaceHolder_hdnSearchRefId").value + '", SortByStoppage: "' + $("#ContentPlaceHolder_ddlstoppage").val() + '", SortByPaging: "' + currPage + '", SortByAirlineName :"' + AirLineName + '", SortByDepartureSlots :"' + AirLines_Time + '"}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            if (data.d == "") {
                var url = window.location.origin + '/Default.aspx?cntry=' + document.getElementById("ContentPlaceHolder_hdnCountryCode").value;
                window.location.href = url;
            }
            else {
                var list = $.parseJSON(data.d);
                document.getElementById("ContentPlaceHolder_hdnPageCount").innerHTML = list.split('@@@@@')[1] + "&nbsp;";
                list = list.split('@@@@@')[0];
                document.getElementById("ContentPlaceHolder_listing_jk").innerHTML = list;
                closeProgressIndicator();
                $('[data-toggle="tooltip"]').tooltip();
                $('.ez_checkbox input[type="radio"]').ezMark();
            }
        },
        failure: function (response) {
            alert(response.d);
        }
    });

    $('#pageNumbers li').each(function () {
        $(this).removeClass('active');
        if ($(this).attr('data-value') == paging)
            $(this).addClass('active');
    });
}

function moveNext() {

    currPage++;
    if (currPage > pgCount) {
        currPage--;
        return false;
    }
    else {
        //if (currPage >= 6) {
        if (currPage >= 11) {
            document.getElementById("paging_" + currPage).style.display = "";
            //var Previouspage = currPage - 5;
            //document.getElementById("paging_" + (currPage - 5)).style.display = "none";
            document.getElementById("paging_" + (currPage - 10)).style.display = "none";
        }
        SetPaging(currPage);
    }

}

function movePrevious() {
    currPage--;

    if (currPage < 1) {
        currPage++;
        return false;
    }
    else
        //if (currPage <= 7) {
        if (currPage <= 10) {
            document.getElementById("paging_" + currPage).style.display = "";
            //var Nextpage = currPage + 5;
            //document.getElementById("paging_" + (currPage + 5)).style.display = "none";
            if (pgCount > 10) {
                document.getElementById("paging_" + (currPage + 10)).style.display = "none";
            }
        }
    SetPaging(currPage);
}


$(function () {
    if (document.URL.includes("Flights_Oneway_Listing.aspx")) {
        pgCount = document.getElementById("ContentPlaceHolder_hdnPageCount").value;
    }



    AirLines_Time = "";
    AirLineName = "";
    $("input[name='selector[]']").bind("click", function () {
        openProgressIndicator();
        AirLines_Time = "";
        $("input[name='selector[]']:checked").each(function (i) {
            AirLines_Time += $(this).val();
        });

        document.getElementById("ContentPlaceHolder_listing_jk").innerHTML = '';
        $.ajax({
            type: "POST",
            url: "Flights_Oneway_Listing.aspx/Filtering",

            data: '{SearchRefId: "' + document.getElementById("ContentPlaceHolder_hdnSearchRefId").value + '", SortByStoppage: "' + $("#ContentPlaceHolder_ddlstoppage").val() + '", SortByPaging: "' + currPage + '", SortByAirlineName :"' + AirLineName + '", SortByDepartureSlots :"' + AirLines_Time + '"}',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
                if (data.d == "") {
                    var url = window.location.origin + '/Default.aspx';
                    window.location.href = url;
                }
                else {
                    var list = $.parseJSON(data.d);

                    var htmlvalue = list.split('@@@@@')[0];
                    var htmlvalue1 = list.split('@@@@@')[1];
                    document.getElementById("ContentPlaceHolder_hdnPageCount").innerHTML = htmlvalue1 + ' ';
                    document.getElementById("ContentPlaceHolder_listing_jk").innerHTML = htmlvalue;
                    PagingBinding(list);
                    closeProgressIndicator();
                    $('.ez_checkbox input[type="radio"]').ezMark();
                }
            },
            failure: function (response) {
                alert(response.d);
            }
        });
    });



    $("input[name='AirLines_Name']").bind("click", function () {
        openProgressIndicator();
        AirLines_Time = "";
        $("input[name='AirLines_Name']:checked").each(function (i) {
            AirLineName += $(this).val();
        });

        document.getElementById("ContentPlaceHolder_listing_jk").innerHTML = '';
        $.ajax({
            type: "POST",
            url: "Flights_Oneway_Listing.aspx/Filtering",

            data: '{SearchRefId: "' + document.getElementById("ContentPlaceHolder_hdnSearchRefId").value + '", SortByStoppage: "' + $("#ContentPlaceHolder_ddlstoppage").val() + '", SortByPaging: "' + currPage + '", SortByAirlineName :"' + AirLineName + '", SortByDepartureSlots :"' + AirLines_Time + '"}',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
                if (data.d == "") {
                    var url = window.location.origin + '/Default.aspx';
                    window.location.href = url;
                }
                else {
                    var list = $.parseJSON(data.d);

                    var htmlvalue = list.split('@@@@@')[0];
                    var htmlvalue1 = list.split('@@@@@')[1];
                    document.getElementById("ContentPlaceHolder_hdnPageCount").innerHTML = htmlvalue1 + ' ';
                    document.getElementById("ContentPlaceHolder_listing_jk").innerHTML = htmlvalue;
                    PagingBinding(list);
                    closeProgressIndicator();
                    $('.ez_checkbox input[type="radio"]').ezMark();
                }
            },
            failure: function (response) {
                alert(response.d);
            }
        });
    });
});


function PagingBinding(list) {
    document.getElementById("ContentPlaceHolder_paging").innerHTML = "";
    var PagingCount = Math.ceil(list.split('@@@@@')[1] / 20);
    document.getElementById("FlightCount").innerHTML = list.split('@@@@@')[1] + "&nbsp;";
    document.getElementById("ContentPlaceHolder_hdnPageCount").value = pgCount = PagingCount;
    var PagingHTML = "";
    PagingHTML += "<nav aria-label='Page navigation'>";
    PagingHTML += "<ul class='pagination' id='pageNumbers'>";
    PagingHTML += "<li>";
    PagingHTML += "<a aria-label='Previous' onclick='movePrevious();' style='cursor:pointer'>";
    PagingHTML += "<span aria-hidden='true' class='fa fa-chevron-left'></span>";
    PagingHTML += "</a>";
    PagingHTML += "</li>";
    for (var j = 1; j <= PagingCount; j++) {
        if (j == 1)

            PagingHTML += "<li data-value='" + j + "' id='paging_" + (j) + "' class='active'><a onclick='SetPaging(" + j + ")' style='cursor:pointer'>" + j + "</a></li>";
        else
            if (j > 10)
                PagingHTML += "<li data-value='" + j + "' id='paging_" + (j) + "' style='display:none'><a onclick='SetPaging(" + j + ")' style='cursor:pointer'>" + j + "</a></li>";
            else
                PagingHTML += "<li data-value='" + j + "' id='paging_" + (j) + "'><a onclick='SetPaging(" + j + ")' style='cursor:pointer'>" + j + "</a></li>";

    }
    PagingHTML += "<li>";
    PagingHTML += "<a aria-label='Next' onclick='moveNext();' style='cursor:pointer'>";
    PagingHTML += "<span aria-hidden='true' class='fa fa-chevron-right'></span>";
    PagingHTML += "</a>";
    PagingHTML += "</li>";
    PagingHTML += "</ul>";
    PagingHTML += "</nav>";
    document.getElementById("ContentPlaceHolder_paging").innerHTML = PagingHTML;
}


function BookNow(id)//Radion Button functionality
{
    openProgressIndicator();
    var Details = document.getElementById(id).value;
    $.ajax({
        type: "POST",
        url: "Flights_Oneway_Listing.aspx/GetTransactionID",
        data: '{ResultIndex:"' + Details + '",SearchRefID:"' + document.getElementById("ContentPlaceHolder_hdnSearchRefId").value + '"}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            if (data.d != '') {
                closeProgressIndicator();


                url = window.location.origin + '/AirLines/BookingWait.aspx';
                var w = window.open(url);

                var windowUrl = window.location.origin + data.d;
                w.location = data.d;




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
    //var url = "";
    //var Details = "";
    //$(id).click(function () {
    //    $.ajax({
    //        type: "POST",
    //        url: "Flights_Oneway_Listing.aspx/GetTransactionID",
    //        data: '{}',
    //        contentType: "application/json; charset=utf-8",
    //        dataType: "json",
    //        success: function (response) {
    //            if (response.d == true) {
    //                alert("Abc");

    //            }
    //        },
    //        failure: function (response) {
    //            alert(response.d);
    //        }
    //    });
    //});


    //Details= document.getElementById(id).value ;

    //url = window.location.origin + '/AirLines/Fligth_Booking.aspx?cntry=' + document.getElementById("ContentPlaceHolder_hdnCountryCode").value + '&SearchRefId=' + document.getElementById("ContentPlaceHolder_hdnSearchRefId").value + '&Details=' + Details;
    //window.open(url, '_blank');
    //return false;
}
var ResultIndex = "";
var RResultIndex = "";
$(function () {
    
    $("input[name='FinalSelection']").bind("click", function () {
         
        
        $("input[name='FinalSelection']:checked").each(function (i) {
            ResultIndex += $(this).val();
            return true;
        });
    });
    $("input[name='FinalRSelection']").bind("click", function () {
      
      
        $("input[name='FinalRSelection']:checked").each(function (i) {
            RResultIndex += $(this).val();
            return true;
        });
    });
});
function BookNowR(id)//Radion Button functionality
{
    openProgressIndicator();
    var ResultIndex1 = ResultIndex.split('$');
    var RResultIndex1 = RResultIndex.split('$');
    var Details = ResultIndex1[1] + "$" + RResultIndex1[1];
    $.ajax({
        type: "POST",
        url: "Flights_Return_Listing.aspx/GetTransactionID",
        data: '{ResultIndex:"' + ResultIndex1[0] + '", RResultIndex:"' + RResultIndex1[0] + '", OtherDetails:"' + Details + '",SearchRefID:"' + document.getElementById("ContentPlaceHolder_hdnSearchRefId").value + '"}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            if (data.d != '') {
                closeProgressIndicator();


                url = window.location.origin + '/AirLines/BookingWait.aspx';
                var w = window.open(url);

                var windowUrl = window.location.origin + data.d;
                w.location = data.d;




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
    //var url = "";
    //var Details = "";
    //$(id).click(function () {
    //    $.ajax({
    //        type: "POST",
    //        url: "Flights_Oneway_Listing.aspx/GetTransactionID",
    //        data: '{}',
    //        contentType: "application/json; charset=utf-8",
    //        dataType: "json",
    //        success: function (response) {
    //            if (response.d == true) {
    //                alert("Abc");

    //            }
    //        },
    //        failure: function (response) {
    //            alert(response.d);
    //        }
    //    });
    //});


    //Details= document.getElementById(id).value ;

    //url = window.location.origin + '/AirLines/Fligth_Booking.aspx?cntry=' + document.getElementById("ContentPlaceHolder_hdnCountryCode").value + '&SearchRefId=' + document.getElementById("ContentPlaceHolder_hdnSearchRefId").value + '&Details=' + Details;
    //window.open(url, '_blank');
    //return false;
}
function FinalBooking(id, transactionid)//Radion Button functionality
{
    var url = "";
    url = window.location.origin + '/ShoppingCart.aspx?cntry=' + document.getElementById("ContentPlaceHolder_hdnCountryCode").value + '&TransId=' + transactionid;
    window.open(url, '_blank');
    return false;
    //$.ajax({
    //    type: "POST",
    //    url: "Fligth_Booking.aspx/FinalBooking",
    //    data: '{SearchRefID:"' + document.getElementById("ContentPlaceHolder_hdnSearchRefId").value + '"}',
    //    contentType: "application/json; charset=utf-8",
    //    dataType: "json",
    //    success: function (data) {
    //        if (data.d != '') {
    //            closeProgressIndicator();


    //            //url = window.location.origin + '/AirLines/BookingWait.aspx';
    //           // var w = window.open(url);

    //          //  var windowUrl = window.location.origin + data.d;
    //        //    w.location = data.d;




    //        }
    //        else {
    //            return false;
    //        }
    //    },
    //    failure: function (data) {
    //        alert(data.d);
    //    }
    //});
    //return false;


}