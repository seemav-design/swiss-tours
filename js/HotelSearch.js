
function Validation() {

    $($('.search_forms').find('.highlight_error')).each(function (index, elem) {
        $(elem).removeClass('highlight_error');
    });
    var flag = true;
    if ($.trim($("#ContentPlaceHolder_txtSearchFrom").val()) == "") {
        $("#ContentPlaceHolder_txtSearchFrom").addClass('highlight_error');
        flag = false;
    }
    else if ($.trim($("#ContentPlaceHolder_hdnSearchFrom").val()) == "") {
        $("#ContentPlaceHolder_txtSearchFrom").addClass("highlight_error");
        flag = false;
    }

    if ($("#ContentPlaceHolder_txtCheckIn").val() == "") {
        $("#ContentPlaceHolder_txtCheckIn").addClass('highlight_error');
        flag = false;
    }

    if ($("#ContentPlaceHolder_txtCheckOut").val() == "") {
        $("#ContentPlaceHolder_txtCheckOut").addClass('highlight_error');
        flag = false;
    }

    var Rooms = $("#ContentPlaceHolder_room_select").val();
    for (var i = 0; i < Rooms; i++) {
        if ($("#ContentPlaceHolder_adult_select_" + (i + 1)).val() == "") {
            $("#ContentPlaceHolder_adult_select_" + (i + 1)).addClass('highlight_error');
            flag = false;
        }

        var child = $("#ContentPlaceHolder_child_select_" + (i + 1)).val();
        if (child > 0) {
            for (var j = 0; j < child; j++) {
                if ($("#ContentPlaceHolder_c_" + (i + 1) + "_" + (j + 1) + "_" + (j + 1)).val() == "") {
                    $("#ContentPlaceHolder_c_" + (i + 1) + "_" + (j + 1) + "_" + (j + 1)).addClass('highlight_error');
                    flag = false;
                }
            }
        }
    }

    if ($.trim($("#ContentPlaceHolder_hdnNationality").val()) == "") {
        $("#ContentPlaceHolder_txtCustomerResidence").addClass("highlight_error");
        flag = false;
    }

    $('.selectpicker').selectpicker('refresh');
    return flag;
}

var currPage = 1; // Index of the current page
var pgCount = 0;
var topFillter = "";
var StarRating = "";
var StatusSelector = "";
var PolicySelector = "";
var LocationSelector = "";
var HotelChainSelector = "";
var TripAdvisorRating = "";
var specialFilter = "";
function SetPaging(paging) {
    openProgressIndicator();
    document.getElementById("ContentPlaceHolder_Hotellist").innerHTML = '';
    currPage = paging;
    $.ajax({
        type: "POST",
        url: "HotelListing.aspx/Filtering",
        data: '{SearchRefId: "' + document.getElementById("ContentPlaceHolder_hdnSearchRefId").value + '", SortByPrice: "' + $("#ContentPlaceHolder_SortByPrice").val() + '", SortByPaging: "' + currPage + '", SortByHotelName :"' + document.getElementById("SearchByHotelName").value + '", SortByRating :"' + StarRating + '", Status :"' + StatusSelector + '", PriceFilter:"", Policy :"' + PolicySelector + '",Location :"' + LocationSelector + '",HotelChain :"' + HotelChainSelector + '",TripAdvisorRating :"' + TripAdvisorRating + '",specialFilter :"' + specialFilter + '"}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            if (data.d == "") {
                var url = window.location.origin + '/Default.aspx?cntry=' + document.getElementById("ContentPlaceHolder_hdnCountryCode").value;
                window.location.href = url;
            }
            else {
                var list = $.parseJSON(data.d);
                document.getElementById("ContentPlaceHolder_HotelsCount").innerHTML = list.split('@@@@@')[1] + "/" + document.getElementById("ContentPlaceHolder_hdnTotalCount").value + "&nbsp;";
                list = list.split('@@@@@')[0];
                document.getElementById("ContentPlaceHolder_Hotellist").innerHTML = list;
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
        if (currPage >= 11) {
            document.getElementById("paging_" + currPage).style.display = "";
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
        if (currPage <= 10) {
            document.getElementById("paging_" + currPage).style.display = "";
            if (pgCount > 10) {
                document.getElementById("paging_" + (currPage + 10)).style.display = "none";
            }
        }
    SetPaging(currPage);
}

function booknowfocus(id) {
    var target = $('#divBook_' + id.split('_')[1]);
    if ($(window).width() < 992) { $('html,body').animate({ scrollTop: target.offset().top - 190 }, 600) }
    else { $('html,body').animate({ scrollTop: target.offset().top - 220 }, 600) }
}


function BookNow(id, type)//Radion Button functionality
{
    
    var url = "";
    var Details = "";
    if (type == "3") {

        var values = id.split('^');
        url = window.location.origin + '/?cntry=' + document.getElementById("ContentPlaceHolder_hdnCountryCode").value + '&SearchRefId=' + document.getElementById("ContentPlaceHolder_hdnSearchRefId").value + '&CityCode=' + values[2] + '&IsDirectHit=' + values[1];
        window.open(url, '_blank');

    }
    else {

        Details = document.getElementById(id.replace("btn", "hdnBookDetails")).value;

        if (type == "1")
            url = window.location.origin + '/Hotel/HotelNonContracted.aspx?cntry=' + document.getElementById("ContentPlaceHolder_hdnCountryCode").value + '&SearchRefId=' + document.getElementById("ContentPlaceHolder_hdnSearchRefId").value + '&Details=' + Details;
        else
            url = window.location.origin + '/Hotel/BookHotel.aspx?cntry=' + document.getElementById("ContentPlaceHolder_hdnCountryCode").value + '&SearchRefId=' + document.getElementById("ContentPlaceHolder_hdnSearchRefId").value + '&Details=' + Details;

        window.open(url, '_blank');
    }

    return false;
}

function ViewCancellationPolicy(id, Details) {
    openProgressIndicator();
    var Url = window.location.search;
    id = id.substring(1);
    var SearchRefId = Url.substring(Url.indexOf("SearchRefId")).split("=")[1].split("&")[0];
    document.getElementById(id).innerHTML = '';
    $.ajax({
        type: "POST",
        url: "HotelListing.aspx/CancellationPolicies",
        data: '{SearchRefId : "' + SearchRefId + '", OtherDetails: "' + Details + '", Type:"1"}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            if (data.d == "") {
                var url = window.location.origin + '/Default.aspx?cntry=' + document.getElementById("ContentPlaceHolder_hdnCountryCode").value;
                window.location.href = url;
            }
            else {
                var list = $.parseJSON(data.d);
                document.getElementById(id).innerHTML = list;
                closeProgressIndicator();
            }
        },
        failure: function (response) {
            alert(response.d);
        }
    });
}
function AppliedFilter()
{
    //SpecialFilter applier filter
    var topFillterSpecialFilter = "";
    $("input[name='speicalSelector']:checked").each(function (i) {
        var srFun = '$(\"input[value$=\'' + $.trim($(this).val()) + '\']").trigger(\'click\');';
        //topFillterSpecialFilter += '<span>' + $($(this).context.parentNode.parentNode).find('div')[1].innerText + '<a href="javascript:;" onclick=' + srFun + ' class="fa fa-times-circle"></a></span>';
        topFillterSpecialFilter += '<span>' + $($(this)[0].parentElement.parentElement).find('div')[1].innerText + '<a href="javascript:;" onclick=' + srFun + ' class="fa fa-times-circle"></a></span>';
    });
    topFillterSpecialFilter = topFillterSpecialFilter != '' ? '<div class="apfilItem"><strong>Special</strong> ' + topFillterSpecialFilter + '</div>' : '';

    // Hotel name applier filter
    var topFillterHotelName = "";
    if ($.trim(document.getElementById("SearchByHotelName").value) != "") {

        topFillterHotelName += '<span>' + $.trim(document.getElementById("SearchByHotelName").value) + '<a href="javascript:;" onclick="return ClearFilterClick(1);" class="fa fa-times-circle"></a></span>';
    }
    topFillterHotelName = topFillterHotelName != '' ? '<div class="apfilItem"><strong>Hotel Name</strong> ' + topFillterHotelName + '</div>' : '';

    //Star rating applier filter
    var topFillterStarRating = "";
    $("input[name='selector']:checked").each(function (i) {

        var srFun = '$(\"input[value$=\'' + $.trim($(this).val().replace("rating_star", "")) + '\']").trigger(\'click\');';
        topFillterStarRating += '<span><div class="rating"><div class="'+ $.trim($(this).val()) +'"></div></div><a href="javascript:;" onclick=' + srFun + ' class="fa fa-times-circle"></a></span>';
    });
    topFillterStarRating = topFillterStarRating != '' ? '<div class="apfilItem"><strong>Star Rating</strong> ' + topFillterStarRating + '</div>' : '';

    //Tripadvisor applier filter
    var topFillterTripadvisor = "";
    $("input[name='tripSelector']:checked").each(function (i) {

        var srFun = '$(\"input[value$=\'' + $.trim($(this).val()) + '\']").trigger(\'click\');';
        topFillterTripadvisor += '<span><img src="/images/tripadvisor/' + $.trim($(this).val()) + '.png"><a href="javascript:;" onclick=' + srFun + ' class="fa fa-times-circle"></a></span>';
    });
    topFillterTripadvisor = topFillterTripadvisor != '' ? '<div class="apfilItem"><strong>Tripadvisor Rating</strong> ' + topFillterTripadvisor + '</div>' : '';
    
    //Conditions applier filter
    var topFillterConditions = "";
    $("input[name='policyselector']:checked").each(function (i) {

        var srFun = '$(\"input[value=\'' + $.trim($(this).val()) + '\']").trigger(\'click\');';
        topFillterConditions += '<span>' + $.trim($(this).val()) + '<a href="javascript:;" onclick=' + srFun + ' class="fa fa-times-circle"></a></span>';
    });
    topFillterConditions = topFillterConditions != '' ? '<div class="apfilItem"><strong>Conditions</strong> ' + topFillterConditions + '</div>' : '';

    //location applier filter
    var topFillterLocation = "";
    $("input[name='locationselector']:checked").each(function (i) {

        var srFun = '$(\"input[data-value=\'' + $.trim($(this).val().replace(" ","-")) + '\']").trigger(\'click\');';
        topFillterLocation += '<span>' + $.trim($(this).val()) + '<a href="javascript:;" onclick=' + srFun + ' class="fa fa-times-circle"></a></span>';
    });
    topFillterLocation = topFillterLocation != '' ? '<div class="apfilItem"><strong>Location</strong> ' + topFillterLocation + '</div>' : '';

    //HotelChain applier filter
    var topFillterHotelChain  = "";
    $("input[name='hotelchainselector']:checked").each(function (i) {

        var srFun = '$(\"input[data-value=\'' + $($("input[name='hotelchainselector']:checked")[i]).attr("data-value") + '\']").trigger(\'click\');';
        topFillterHotelChain += '<span>' + $.trim($(this).val()) + '<a href="javascript:;" onclick=' + srFun + ' class="fa fa-times-circle"></a></span>';
    });
    topFillterHotelChain = topFillterHotelChain != '' ? '<div class="apfilItem"><strong>Hotel Chain</strong> ' + topFillterHotelChain + '</div>' : '';

    $('.afHolder').html("&nbsp;" + topFillterSpecialFilter + topFillterHotelName + topFillterStarRating + topFillterTripadvisor + topFillterConditions + topFillterLocation + topFillterHotelChain);
}

function btnGoClick() {
    openProgressIndicator();
    AppliedFilter();

    $.ajax({
        type: "POST",
        url: "HotelListing.aspx/Filtering",
        data: '{SearchRefId: "' + document.getElementById("ContentPlaceHolder_hdnSearchRefId").value + '", SortByPrice: "' + $("#ContentPlaceHolder_SortByPrice").val() + '", SortByPaging: "' + 1 + '", SortByHotelName :"' + document.getElementById("SearchByHotelName").value + '", SortByRating :"' + StarRating + '", Status :"' + StatusSelector + '", PriceFilter:"", Policy :"' + PolicySelector + '",Location :"' + LocationSelector + '",HotelChain :"' + HotelChainSelector + '",TripAdvisorRating :"' + TripAdvisorRating + '",specialFilter :"' + specialFilter + '"}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            if (data.d == "") {
                var url = window.location.origin + '/Default.aspx?cntry=' + document.getElementById("ContentPlaceHolder_hdnCountryCode").value;
                window.location.href = url;
            }
            else {
                var list = $.parseJSON(data.d);
                document.getElementById("ContentPlaceHolder_HotelsCount").innerHTML = list.split('@@@@@')[1] + "/" + document.getElementById("ContentPlaceHolder_hdnTotalCount").value + "&nbsp;";
                var htmlValue = list.split('@@@@@')[0];
                document.getElementById("ContentPlaceHolder_Hotellist").innerHTML = htmlValue;
                PagingBinding(list);
                closeProgressIndicator();
                $('[data-toggle="tooltip"]').tooltip();
                $('.ez_checkbox input[type="radio"]').ezMark();
            }
        },
        failure: function (response) {
            alert(response.d);
        }
    });
}


$(function () {

    var Nights = "1 Night";
    if (document.URL.includes("HotelListing.aspx")) {
        pgCount = document.getElementById("ContentPlaceHolder_hdnPageCount").value;
    }
    $('#ContentPlaceHolder_r1').show();
    $('#ContentPlaceHolder_room_select').change(function () {
        var room = $(this).val();

        if (room == '1') {
            $('#ContentPlaceHolder_r1').slideDown(500);
            $('#ContentPlaceHolder_r2').slideUp(500);
            $('#ContentPlaceHolder_r3').slideUp(500);
            $('#ContentPlaceHolder_r4').slideUp(500);
        }
        if (room == '2') {
            $('#ContentPlaceHolder_r1').slideDown(500);
            $('#ContentPlaceHolder_r2').slideDown(500);
            $('#ContentPlaceHolder_r3').slideUp(500);
            $('#ContentPlaceHolder_r4').slideUp(500);
        }
        if (room == '3') {
            $('#ContentPlaceHolder_r1').slideDown(500);
            $('#ContentPlaceHolder_r2').slideDown(500);
            $('#ContentPlaceHolder_r3').slideDown(500);
            $('#ContentPlaceHolder_r4').slideUp(500);
        }
        if (room == '4') {
            $('#ContentPlaceHolder_r1').slideDown(500);
            $('#ContentPlaceHolder_r2').slideDown(500);
            $('#ContentPlaceHolder_r3').slideDown(500);
            $('#ContentPlaceHolder_r4').slideDown(500);
        }
    })
    $('#ContentPlaceHolder_child_select_1').change(function () {
        var child = $(this).val();
        if (child == '0') {
            $('#ContentPlaceHolder_c_1_1').slideUp(300);
            $('#ContentPlaceHolder_c_1_2').slideUp(300);
            $('#ContentPlaceHolder_c_1_3').slideUp(300);
        }
        if (child == '1') {
            $('#ContentPlaceHolder_c_1_1').slideDown(300);
            $('#ContentPlaceHolder_c_1_2').slideUp(300);
            $('#ContentPlaceHolder_c_1_3').slideUp(300);
        }
        if (child == '2') {
            $('#ContentPlaceHolder_c_1_1').slideDown(300);
            $('#ContentPlaceHolder_c_1_2').slideDown(300);
            $('#ContentPlaceHolder_c_1_3').slideUp(300);
        }
        if (child == '3') {
            $('#ContentPlaceHolder_c_1_1').slideDown(300);
            $('#ContentPlaceHolder_c_1_2').slideDown(300);
            $('#ContentPlaceHolder_c_1_3').slideDown(300);
        }
    })
    $('#ContentPlaceHolder_child_select_2').change(function () {
        var child = $(this).val();
        if (child == '0') {
            $('#ContentPlaceHolder_c_2_1').slideUp(300);
            $('#ContentPlaceHolder_c_2_2').slideUp(300);
            $('#ContentPlaceHolder_c_2_3').slideUp(300);
        }
        if (child == '1') {
            $('#ContentPlaceHolder_c_2_1').slideDown(300);
            $('#ContentPlaceHolder_c_2_2').slideUp(300);
            $('#ContentPlaceHolder_c_2_3').slideUp(300);
        }
        if (child == '2') {
            $('#ContentPlaceHolder_c_2_1').slideDown(300);
            $('#ContentPlaceHolder_c_2_2').slideDown(300);
            $('#ContentPlaceHolder_c_2_3').slideUp(300);
        }
        if (child == '3') {
            $('#ContentPlaceHolder_c_2_1').slideDown(300);
            $('#ContentPlaceHolder_c_2_2').slideDown(300);
            $('#ContentPlaceHolder_c_2_3').slideDown(300);
        }
    })
    $('#ContentPlaceHolder_child_select_3').change(function () {
        var child = $(this).val();
        if (child == '0') {
            $('#ContentPlaceHolder_c_3_1').slideUp(300);
            $('#ContentPlaceHolder_c_3_2').slideUp(300);
            $('#ContentPlaceHolder_c_3_3').slideUp(300);
        }
        if (child == '1') {
            $('#ContentPlaceHolder_c_3_1').slideDown(300);
            $('#ContentPlaceHolder_c_3_2').slideUp(300);
            $('#ContentPlaceHolder_c_3_3').slideUp(300);
        }
        if (child == '2') {
            $('#ContentPlaceHolder_c_3_1').slideDown(300);
            $('#ContentPlaceHolder_c_3_2').slideDown(300);
            $('#ContentPlaceHolder_c_3_3').slideUp(300);
        }
        if (child == '3') {
            $('#ContentPlaceHolder_c_3_1').slideDown(300);
            $('#ContentPlaceHolder_c_3_2').slideDown(300);
            $('#ContentPlaceHolder_c_3_3').slideDown(300);
        }
    })
    $('#ContentPlaceHolder_child_select_4').change(function () {
        var child = $(this).val();
        if (child == '0') {
            $('#ContentPlaceHolder_c_4_1').slideUp(300);
            $('#ContentPlaceHolder_c_4_2').slideUp(300);
            $('#ContentPlaceHolder_c_4_3').slideUp(300);
        }
        if (child == '1') {
            $('#ContentPlaceHolder_c_4_1').slideDown(300);
            $('#ContentPlaceHolder_c_4_2').slideUp(300);
            $('#ContentPlaceHolder_c_4_3').slideUp(300);
        }
        if (child == '2') {
            $('#ContentPlaceHolder_c_4_1').slideDown(300);
            $('#ContentPlaceHolder_c_4_2').slideDown(300);
            $('#ContentPlaceHolder_c_4_3').slideUp(300);
        }
        if (child == '3') {
            $('#ContentPlaceHolder_c_4_1').slideDown(300);
            $('#ContentPlaceHolder_c_4_2').slideDown(300);
            $('#ContentPlaceHolder_c_4_3').slideDown(300);
        }
    })

    try {
        $("#ContentPlaceHolder_txtSearchFrom").autocomplete({
            source: "/Hotel/HotelCitySearch.ashx",
            minLength: 2,
            select: function (event, ui) {
                document.getElementById("ContentPlaceHolder_hdnSearchFrom").value = ui.item.CityName + ":" + ui.item.CityId + ":" + ui.item.CityCode + ":" + ui.item.CountryName + ":" + ui.item.CountryCode + ":" + ui.item.SupplierCodes;
            }
        });

        $.ui.autocomplete.prototype._renderItem = function (ul, item) {
            var re = new RegExp("(?![^&;]+;)(?!<[^<>]*)(" + $.ui.autocomplete.escapeRegex(this.term) + ")(?![^<>]*>)(?![^&;]+;)", "gi");
            if (item.CityName != null && item.CityName != "") {
                var t = item.CityName.replace(re, "<u><strong>$1</strong></u>");
                return $("<li></li>")
                    .data("item.autocomplete", item)
                    .append("<div><span style='font-size:90%'>" + t + ",</span>  <span style='color:#ce000c;font-size:75%'><i>" + item.CountryName + "</i></span></div>")
                    .appendTo(ul);
            }
            else if (item.value != null && item.value != "") {
                var t = item.value.replace(re, "<u><strong>$1</strong></u>");
                return $("<li></li>")
                    .data("item.autocomplete", item)
                    .append("<div><span style='font-size:90%'>" + t + "</span></div>")
                    .appendTo(ul);
            }
            else {
                return $("<li></li>")
                    .data("item.autocomplete", item)
                    .append("<div><span style='color:#ce000c;font-size:75%'><i>" + item.CountryName + "</i></span></div>")
                    .appendTo(ul);
            }
        };
    } catch (e) { }

    var calCheckInDate = new Date();          // Get current Date
    calCheckInDate.setDate(calCheckInDate.getDate() + 3);

    var calCheckOutDate = new Date();          // Get current Date
    calCheckOutDate.setDate(calCheckOutDate.getDate() + 4);

    $("#ContentPlaceHolder_txtCheckIn").datetimepicker({
        startDate: calCheckInDate,
        minView: 2,
        format: 'dd M yyyy',
        autoclose: 1,
    });

    $("#ContentPlaceHolder_txtCheckOut").datetimepicker({
        startDate: calCheckOutDate,
        minView: 2,
        format: 'dd M yyyy',
        autoclose: 1,
    });

    $('#ContentPlaceHolder_txtCheckIn').on('changeDate', function (event) {
        var CheckOutDate = event.date;
        CheckOutDate.setDate(CheckOutDate.getDate() + 1);

        var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

        var newDate = CheckOutDate.getDate() + " " + monthNames[CheckOutDate.getMonth()] + " " + CheckOutDate.getFullYear();

        $('#ContentPlaceHolder_txtCheckOut').datetimepicker('setStartDate', newDate);

        $('#ContentPlaceHolder_txtCheckOut').val(newDate);

        Nights = FillNights(Nights);

        document.getElementById("ContentPlaceHolder_txtNights").value = Nights;
    });

    $('#ContentPlaceHolder_txtCheckOut').on('changeDate', function (event) {
        Nights = FillNights(Nights);
        document.getElementById("ContentPlaceHolder_txtNights").value = Nights;

    });

    $("#ContentPlaceHolder_SortByPrice").change(function () {
        openProgressIndicator();
        document.getElementById("ContentPlaceHolder_Hotellist").innerHTML = '';
        $.ajax({
            type: "POST",
            url: "HotelListing.aspx/Filtering",
            data: '{SearchRefId: "' + document.getElementById("ContentPlaceHolder_hdnSearchRefId").value + '", SortByPrice: "' + $("#ContentPlaceHolder_SortByPrice").val() + '", SortByPaging: "' + currPage + '", SortByHotelName :"' + document.getElementById("SearchByHotelName").value + '", SortByRating :"' + StarRating + '", Status :"' + StatusSelector + '", PriceFilter:"", Policy :"' + PolicySelector + '",Location :"' + LocationSelector + '",HotelChain :"' + HotelChainSelector + '",TripAdvisorRating :"' + TripAdvisorRating + '",specialFilter :"' + specialFilter + '"}',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
                if (data.d == "") {
                    var url = window.location.origin + '/Default.aspx?cntry=' + document.getElementById("ContentPlaceHolder_hdnCountryCode").value;
                    window.location.href = url;
                }
                else {
                    var list = $.parseJSON(data.d);
                    document.getElementById("ContentPlaceHolder_HotelsCount").innerHTML = list.split('@@@@@')[1] + "/" + document.getElementById("ContentPlaceHolder_hdnTotalCount").value + "&nbsp;";
                    list = list.split('@@@@@')[0];
                    document.getElementById("ContentPlaceHolder_Hotellist").innerHTML = list;
                    closeProgressIndicator();
                    $('[data-toggle="tooltip"]').tooltip();
                    $('.ez_checkbox input[type="radio"]').ezMark();
                }
            },
            failure: function (response) {
                alert(response.d);
            }
        });
    });

    try {
        $("#SearchByHotelName").autocomplete({
            source: function (request, response) {

                $.ajax({
                    type: "POST",
                    url: "HotelListing.aspx/GetHotelListData",
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    data: '{SearchRefId: "' + document.getElementById("ContentPlaceHolder_hdnSearchRefId").value + '", SortByHotelName :"' + $("#SearchByHotelName").val() + '"}',
                    success: function (data) {
                        response(data.d);
                    },
                    failure: function (response) {
                        alert(response.d);
                    }
                });
            },
            minLength: 3,
        });
    } catch (e) { }

    $("input[name='speicalSelector']").bind("click", function () {

        openProgressIndicator();
        specialFilter = "";

        $("input[name='speicalSelector']:checked").each(function (i) {

            specialFilter += $(this).val() + ",";
        });
        AppliedFilter();
        document.getElementById("ContentPlaceHolder_Hotellist").innerHTML = '';
        $.ajax({
            type: "POST",
            url: "HotelListing.aspx/Filtering",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: '{SearchRefId: "' + document.getElementById("ContentPlaceHolder_hdnSearchRefId").value + '", SortByPrice: "' + $("#ContentPlaceHolder_SortByPrice").val() + '", SortByPaging: "' + 1 + '", SortByHotelName :"' + document.getElementById("SearchByHotelName").value + '", SortByRating :"' + StarRating + '", Status :"' + StatusSelector + '", PriceFilter:"", Policy :"' + PolicySelector + '",Location :"' + LocationSelector + '",HotelChain :"' + HotelChainSelector + '",TripAdvisorRating :"' + TripAdvisorRating + '",specialFilter :"' + specialFilter + '"}',
            success: function (data) {
                if (data.d == "") {
                    var url = window.location.origin + '/Default.aspx?cntry=' + document.getElementById("ContentPlaceHolder_hdnCountryCode").value;
                    window.location.href = url;
                }
                else {
                    var list = $.parseJSON(data.d);
                    document.getElementById("ContentPlaceHolder_HotelsCount").innerHTML = list.split('@@@@@')[1] + "/" + document.getElementById("ContentPlaceHolder_hdnTotalCount").value + "&nbsp;";
                    var htmlValue = list.split('@@@@@')[0];
                    document.getElementById("ContentPlaceHolder_Hotellist").innerHTML = htmlValue;
                    PagingBinding(list);
                    closeProgressIndicator();
                    $('[data-toggle="tooltip"]').tooltip();
                    $('.ez_checkbox input[type="radio"]').ezMark();
                }
            },
            failure: function (response) {
                alert(response.d);
            }
        });
    });
    $("input[name='selector']").bind("click", function () {
        
        openProgressIndicator();
        StarRating = "";
        
        $("input[name='selector']:checked").each(function (i) {

            StarRating += $(this).val() + ",";
         });
        AppliedFilter();
        document.getElementById("ContentPlaceHolder_Hotellist").innerHTML = '';
        $.ajax({
            type: "POST",
            url: "HotelListing.aspx/Filtering",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: '{SearchRefId: "' + document.getElementById("ContentPlaceHolder_hdnSearchRefId").value + '", SortByPrice: "' + $("#ContentPlaceHolder_SortByPrice").val() + '", SortByPaging: "' + 1 + '", SortByHotelName :"' + document.getElementById("SearchByHotelName").value + '", SortByRating :"' + StarRating + '", Status :"' + StatusSelector + '", PriceFilter:"", Policy :"' + PolicySelector + '",Location :"' + LocationSelector + '",HotelChain :"' + HotelChainSelector + '",TripAdvisorRating :"' + TripAdvisorRating + '",specialFilter :"' + specialFilter + '"}',
            success: function (data) {
                if (data.d == "") {
                    var url = window.location.origin + '/Default.aspx?cntry=' + document.getElementById("ContentPlaceHolder_hdnCountryCode").value;
                    window.location.href = url;
                }
                else {
                    var list = $.parseJSON(data.d);
                    document.getElementById("ContentPlaceHolder_HotelsCount").innerHTML = list.split('@@@@@')[1] + "/" + document.getElementById("ContentPlaceHolder_hdnTotalCount").value + "&nbsp;";
                    var htmlValue = list.split('@@@@@')[0];
                    document.getElementById("ContentPlaceHolder_Hotellist").innerHTML = htmlValue;
                    PagingBinding(list);
                    closeProgressIndicator();
                    $('[data-toggle="tooltip"]').tooltip();
                    $('.ez_checkbox input[type="radio"]').ezMark();
                }
            },
            failure: function (response) {
                alert(response.d);
            }
        });
    });

    $("input[name='tripSelector']").bind("click", function () {
        openProgressIndicator();
        TripAdvisorRating = "";
        $("input[name='tripSelector']:checked").each(function (i) {

            TripAdvisorRating += $(this).val() + ",";
        });
        AppliedFilter();
        document.getElementById("ContentPlaceHolder_Hotellist").innerHTML = '';
        $.ajax({
            type: "POST",
            url: "HotelListing.aspx/Filtering",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: '{SearchRefId: "' + document.getElementById("ContentPlaceHolder_hdnSearchRefId").value + '", SortByPrice: "' + $("#ContentPlaceHolder_SortByPrice").val() + '", SortByPaging: "' + 1 + '", SortByHotelName :"' + document.getElementById("SearchByHotelName").value + '", SortByRating :"' + StarRating + '", Status :"' + StatusSelector + '", PriceFilter:"", Policy :"' + PolicySelector + '",Location :"' + LocationSelector + '",HotelChain :"' + HotelChainSelector + '",TripAdvisorRating :"' + TripAdvisorRating + '",specialFilter :"' + specialFilter + '"}',
            success: function (data) {
                if (data.d == "") {
                    var url = window.location.origin + '/Default.aspx?cntry=' + document.getElementById("ContentPlaceHolder_hdnCountryCode").value;
                    window.location.href = url;
                }
                else {
                    var list = $.parseJSON(data.d);
                    document.getElementById("ContentPlaceHolder_HotelsCount").innerHTML = list.split('@@@@@')[1] + "/" + document.getElementById("ContentPlaceHolder_hdnTotalCount").value + "&nbsp;";
                    var htmlValue = list.split('@@@@@')[0];
                    document.getElementById("ContentPlaceHolder_Hotellist").innerHTML = htmlValue;
                    PagingBinding(list);
                    closeProgressIndicator();
                    $('[data-toggle="tooltip"]').tooltip();
                    $('.ez_checkbox input[type="radio"]').ezMark();
                }
            },
            failure: function (response) {
                alert(response.d);
            }
        });
    });

    $("input[name='statusselector']").bind("click", function () {
        openProgressIndicator();
        StatusSelector = "";
        $("input[name='statusselector']:checked").each(function (i) {

            StatusSelector += $(this).val() + ",";
        });

        document.getElementById("ContentPlaceHolder_Hotellist").innerHTML = '';
        $.ajax({
            type: "POST",
            url: "HotelListing.aspx/Filtering",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: '{SearchRefId: "' + document.getElementById("ContentPlaceHolder_hdnSearchRefId").value + '", SortByPrice: "' + $("#ContentPlaceHolder_SortByPrice").val() + '", SortByPaging: "' + currPage + '", SortByHotelName :"' + document.getElementById("SearchByHotelName").value + '", SortByRating :"' + StarRating + '", Status :"' + StatusSelector + '", PriceFilter:"", Policy :"' + PolicySelector + '",Location :"' + LocationSelector + '",HotelChain :"' + HotelChainSelector + '",TripAdvisorRating :"' + TripAdvisorRating + '",specialFilter :"' + specialFilter + '"}',
            success: function (data) {
                if (data.d == "") {
                    var url = window.location.origin + '/Default.aspx?cntry=' + document.getElementById("ContentPlaceHolder_hdnCountryCode").value;
                    window.location.href = url;
                }
                else {
                    var list = $.parseJSON(data.d);
                    document.getElementById("ContentPlaceHolder_HotelsCount").innerHTML = list.split('@@@@@')[1] + "/" + document.getElementById("ContentPlaceHolder_hdnTotalCount").value + "&nbsp;";
                    var htmlValue = list.split('@@@@@')[0];
                    document.getElementById("ContentPlaceHolder_Hotellist").innerHTML = htmlValue;
                    PagingBinding(list);
                    closeProgressIndicator();
                    $('[data-toggle="tooltip"]').tooltip();
                    $('.ez_checkbox input[type="radio"]').ezMark();
                }
            },
            failure: function (response) {
                alert(response.d);
            }
        });
    });

    $("input[name='policyselector']").bind("click", function () {
        openProgressIndicator();
        PolicySelector = "";
        $("input[name='policyselector']:checked").each(function (i) {

            PolicySelector += $(this).val() + ",";
        });
        AppliedFilter();
        document.getElementById("ContentPlaceHolder_Hotellist").innerHTML = '';
        $.ajax({
            type: "POST",
            url: "HotelListing.aspx/Filtering",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: '{SearchRefId: "' + document.getElementById("ContentPlaceHolder_hdnSearchRefId").value + '", SortByPrice: "' + $("#ContentPlaceHolder_SortByPrice").val() + '", SortByPaging: "' + currPage + '", SortByHotelName :"' + document.getElementById("SearchByHotelName").value + '", SortByRating :"' + StarRating + '", Status :"' + StatusSelector + '", PriceFilter:"" , Policy :"' + PolicySelector + '",Location :"' + LocationSelector + '",HotelChain :"' + HotelChainSelector + '",TripAdvisorRating :"' + TripAdvisorRating + '",specialFilter :"' + specialFilter + '"}',
            success: function (data) {
                if (data.d == "") {
                    var url = window.location.origin + '/Default.aspx';
                    window.location.href = url;
                }
                else {
                    var list = $.parseJSON(data.d);
                    document.getElementById("ContentPlaceHolder_HotelsCount").innerHTML = list.split('@@@@@')[1] + "/" + document.getElementById("ContentPlaceHolder_hdnTotalCount").value + "&nbsp;";
                    var htmlvalue = list.split('@@@@@')[0];
                    document.getElementById("ContentPlaceHolder_Hotellist").innerHTML = htmlvalue;
                    PagingBinding(list);
                    closeProgressIndicator();
                    $('[data-toggle="tooltip"]').tooltip();
                    $('.ez_checkbox input[type="radio"]').ezMark();
                }
            },
            failure: function (response) {
                alert(response.d);
            }
        });
    });

    $("input[name='locationselector']").bind("click", function () {
        openProgressIndicator();
        LocationSelector = "";
        $("input[name='locationselector']:checked").each(function (i) {

            LocationSelector += $(this).val() + ",";
        });
        AppliedFilter();
        document.getElementById("ContentPlaceHolder_Hotellist").innerHTML = '';
        $.ajax({
            type: "POST",
            url: "HotelListing.aspx/Filtering",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: '{SearchRefId: "' + document.getElementById("ContentPlaceHolder_hdnSearchRefId").value + '", SortByPrice: "' + $("#ContentPlaceHolder_SortByPrice").val() + '", SortByPaging: "' + currPage + '", SortByHotelName :"' + document.getElementById("SearchByHotelName").value + '", SortByRating :"' + StarRating + '", Status :"' + StatusSelector + '", PriceFilter:"" , Policy :"' + PolicySelector + '",Location :"' + LocationSelector + '",HotelChain :"' + HotelChainSelector + '",TripAdvisorRating :"' + TripAdvisorRating + '",specialFilter :"' + specialFilter + '"}',
            success: function (data) {
                if (data.d == "") {
                    var url = window.location.origin + '/Default.aspx';
                    window.location.href = url;
                }
                else {
                    var list = $.parseJSON(data.d);
                    document.getElementById("ContentPlaceHolder_HotelsCount").innerHTML = list.split('@@@@@')[1] + "/" + document.getElementById("ContentPlaceHolder_hdnTotalCount").value + "&nbsp;";
                    var htmlvalue = list.split('@@@@@')[0];
                    document.getElementById("ContentPlaceHolder_Hotellist").innerHTML = htmlvalue;
                    PagingBinding(list);
                    closeProgressIndicator();
                    $('[data-toggle="tooltip"]').tooltip();
                    $('.ez_checkbox input[type="radio"]').ezMark();
                }
            },
            failure: function (response) {
                alert(response.d);
            }
        });
    });

    $("input[name='hotelchainselector']").bind("click", function () {
        openProgressIndicator();
        HotelChainSelector = "";
        $("input[name='hotelchainselector']:checked").each(function (i) {

            HotelChainSelector += $(this).val() + ",";
        });
        AppliedFilter();
        document.getElementById("ContentPlaceHolder_Hotellist").innerHTML = '';
        $.ajax({
            type: "POST",
            url: "HotelListing.aspx/Filtering",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: '{SearchRefId: "' + document.getElementById("ContentPlaceHolder_hdnSearchRefId").value + '", SortByPrice: "' + $("#ContentPlaceHolder_SortByPrice").val() + '", SortByPaging: "' + currPage + '", SortByHotelName :"' + document.getElementById("SearchByHotelName").value + '", SortByRating :"' + StarRating + '", Status :"' + StatusSelector + '", PriceFilter:"" , Policy :"' + PolicySelector + '",Location :"' + LocationSelector + '",HotelChain :"' + HotelChainSelector + '",TripAdvisorRating :"' + TripAdvisorRating +  '",specialFilter :"' + specialFilter + '"}',
            success: function (data) {
                if (data.d == "") {
                    var url = window.location.origin + '/Default.aspx';
                    window.location.href = url;
                }
                else {
                    var list = $.parseJSON(data.d);
                    document.getElementById("ContentPlaceHolder_HotelsCount").innerHTML = list.split('@@@@@')[1] + "/" + document.getElementById("ContentPlaceHolder_hdnTotalCount").value + "&nbsp;";
                    var htmlvalue = list.split('@@@@@')[0];
                    document.getElementById("ContentPlaceHolder_Hotellist").innerHTML = htmlvalue;
                    PagingBinding(list);
                    closeProgressIndicator();
                    $('[data-toggle="tooltip"]').tooltip();
                    $('.ez_checkbox input[type="radio"]').ezMark();
                }
            },
            failure: function (response) {
                alert(response.d);
            }
        });
    });


    try {
        $('.ui-autocomplete').css('max-height', '500px');//this for auto complete box height   
        $('.ui-autocomplete').css('height', 'auto');//this for auto complete box height   
    } catch (e) { }
});

function invokelnkbtnPopular(vids) {
    var btnvalue = document.getElementById(vids.replace("divBtnCode", "lnkBtnCodePopular")).value;
    var hdnvalue = document.getElementById(vids.replace("divBtnCode", "hdncityvalues")).value;
    document.getElementById("ContentPlaceHolder_txtSearchFrom").value = btnvalue;
    document.getElementById("ContentPlaceHolder_hdnSearchFrom").value = hdnvalue;
    window.scrollTo(0, 0)
    return false;
}

function FillNights(Nights) {
    var checkIn = new Date(document.getElementById("ContentPlaceHolder_txtCheckIn").value);
    var checkOut = new Date(document.getElementById("ContentPlaceHolder_txtCheckOut").value);
    var timeDiff = Math.abs(checkOut.getTime() - checkIn.getTime());
    Nights = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return Nights = Nights == 1 ? Nights + " Night" : Nights + " Nights";
}

function ExpandClick(id, CompositeKey) {
    if ($('#' + id).parent().siblings(".search_result_details").is(":visible")) {
        $('#' + id).parent().siblings(".search_result_details").slideUp();
        $('#' + id).parent(".search_result").removeClass("active");
    } else {
        if (document.getElementById("room_" + id.split("_")[2]).innerHTML == "") {
            openProgressIndicator();
            $.ajax({
                type: "POST",
                url: "HotelListing.aspx/DisplayRooms",
                data: '{SearchRefId: "' + document.getElementById("ContentPlaceHolder_hdnSearchRefId").value + '", Id: ' + id.split("_")[2] + ', CompositeKey: "' + CompositeKey + '",Status :"' + StatusSelector + '", Policy :"' + PolicySelector + '"}',
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data) {
                    if (data.d == "") {
                        var url = window.location.origin + '/Default.aspx?cntry=' + document.getElementById("ContentPlaceHolder_hdnCountryCode").value;
                        window.location.href = url;
                    }
                    else {
                        var list = $.parseJSON(data.d);
                        document.getElementById("room_" + id.split("_")[2]).innerHTML = list;
                        $('#' + id).parent().siblings(".search_result_details").slideDown();
                        $('#' + id).parent(".search_result").addClass("active");
                        $('[data-toggle="tooltip"]').tooltip();
                        $(('#room_' + id.split("_")[2]) + ' .ez_checkbox input[type = "radio"]').ezMark();
                        closeProgressIndicator();
                        return true;
                    }
                },
                failure: function (response) {
                    alert(response.d);
                }
            });
        }
        else {
            $('#' + id).parent().siblings(".search_result_details").slideDown();
            $('#' + id).parent(".search_result").addClass("active");
        }
    }
}

function PagingBinding(list) {
    document.getElementById("ContentPlaceHolder_paging").innerHTML = "";
    var PagingCount = Math.ceil(list.split('@@@@@')[1] / 20);
    document.getElementById("ContentPlaceHolder_HotelsCount").innerHTML = list.split('@@@@@')[1] + "/" + document.getElementById("ContentPlaceHolder_hdnTotalCount").value + "&nbsp;";
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



function ClearFilterClick(id) {
    
    switch (id) {
        case 1:
            document.getElementById("SearchByHotelName").value = "";
            btnGoClick();
            break;
        case 2:
            $("#ContentPlaceHolder_SortByPrice").val("Ascending");
            $("#PriceFilter span.filter-option.pull-left").innerHTML = ' ';
            break;
        case 3:
            StarRating = "";
            $("input[name='selector']").removeAttr("checked");
            $("ul.ez_checkbox.rating_filter li label div").removeClass("ez-checked-select");
            break;
        case 4:
            StatusSelector = "";
            $("ul.ez_checkbox li label div").removeClass("ez-checked-select");
            break;
        case 5:
            PolicySelector = "";
            $("ul.ez_checkbox li label div").removeClass("ez-checked-select");
            break;
        case 6:
            LocationSelector = "";
            $("input[name='locationselector']").removeAttr("checked");
            $("#ContentPlaceHolder_divLocation ul.ez_checkbox li label div").removeClass("ez-checked-select");
            break;
        case 7:
            HotelChainSelector = "";
            $("input[name='hotelchainselector']").removeAttr("checked");
            $("#ContentPlaceHolder_divHotelChain ul.ez_checkbox li label div").removeClass("ez-checked-select");
            break;
        case 8:
            TripAdvisorRating = "";
            $("input[name='tripSelector']").removeAttr("checked");
            $("ul.ez_checkbox.trip_filter li label div").removeClass("ez-checked-select");
            break;
        case 9:
            specialFilter = "";
            $("input[name='specialSelector']").removeAttr("checked");
            $("ul.ez_checkbox.special_filter li label div").removeClass("ez-checked-select");
            break;
        default:
            document.getElementById("SearchByHotelName").value = "";
            $("#ContentPlaceHolder_SortByPrice").val("Ascending").attr("selected", "selected");
            StarRating = "";
            StatusSelector = "";
            PolicySelector = "";
            LocationSelector = "";
            HotelChainSelector = "";
            TripAdvisorRating = "";
            specialFilter = "";
            $('#priceslider').slider('refresh');
            $("input[name='selector']").removeAttr("checked");
            $("ul.ez_checkbox.rating_filter li label div").removeClass("ez-checked-select");
            $("ul.ez_checkbox li label div").removeClass("ez-checked-select");
            $("input[name='locationselector']").removeAttr("checked");
            $("#ContentPlaceHolder_divLocation ul.ez_checkbox li label div").removeClass("ez-checked-select");
            $("input[name='hotelchainselector']").removeAttr("checked");
            $("#ContentPlaceHolder_divHotelChain ul.ez_checkbox li label div").removeClass("ez-checked-select");
            $('.afHolder').html('');
            break;
    }
    openProgressIndicator();
    $.ajax({
        type: "POST",
        url: "HotelListing.aspx/Filtering",
        data: '{SearchRefId: "' + document.getElementById("ContentPlaceHolder_hdnSearchRefId").value + '", SortByPrice: "' + $("#ContentPlaceHolder_SortByPrice").val() + '", SortByPaging: "' + 1 + '", SortByHotelName :"' + document.getElementById("SearchByHotelName").value + '", SortByRating :"' + StarRating + '", Status :"' + StatusSelector + '", PriceFilter:"", Policy :"' + PolicySelector + '",Location :"' + LocationSelector + '",HotelChain :"' + HotelChainSelector + '",TripAdvisorRating :"' + TripAdvisorRating + '",specialFilter :"' + specialFilter + '"}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            if (data.d == "") {
                var url = window.location.origin + '/Default.aspx?cntry=' + document.getElementById("ContentPlaceHolder_hdnCountryCode").value;
                window.location.href = url;
            }
            else {
                var list = $.parseJSON(data.d);
                var htmlValue = list.split('@@@@@')[0];
                document.getElementById("ContentPlaceHolder_HotelsCount").innerHTML = list.split('@@@@@')[1] + "/" + document.getElementById("ContentPlaceHolder_hdnTotalCount").value + "&nbsp;";
                document.getElementById("ContentPlaceHolder_Hotellist").innerHTML = htmlValue;
                PagingBinding(list);
                $('[data-toggle="tooltip"]').tooltip();
                $('.ez_checkbox input[type="radio"]').ezMark();
                closeProgressIndicator();
                return true;
            }
        },
        failure: function (response) {
            alert(response.d);
        }
    });
    return false;
}


function hideshowmorerooms(id, type) {
    if (type == 1) {
        $("#" + id.replace("aviewmorerooms", "tblID")).children('tbody').children('tr').css("display", "");
        $("#" + id.replace("aviewmorerooms", "tblID")).children('tbody').children('tr').slideDown();
    }
    else {
        $("#" + id.replace("ahidemorerooms", "tblID")).children('tbody').children('tr').css("display", "none");
        for (var i = 0; i < 11; i++) {
            $("#" + id.replace("ahidemorerooms", "tblID")).children('tbody').find("tr:eq(" + i + ")").css("display", "");
        }

        var target = $("#" + id.replace("ahidemorerooms", "tblID"));
        if ($(window).width() < 992) { $('html,body').animate({ scrollTop: target.offset().top - 190 }, 600) }
        else { $('html,body').animate({ scrollTop: target.offset().top - 220 }, 600) }
    }
    $("#" + id).parent().parent().css("display", "none");

}
function CheckOutRestriction(id, type, CountryCode, SearchRefId, HotelName, checkindate, checkoutdate) {
  
    var url = "";
    var Details = "";

    if (type == "3") {
        var values = id.split('^');
        var details = values[2] + "~" + HotelName + "~" + "H7" + "~" + values[1] + "~" + checkindate + "~" + checkoutdate + "~Hotel";
        var values = id.split('^');
        url = window.location.origin + '/Hotel/DyApartBookingSelection.aspx?cntry=' + CountryCode + '&SearchRefId=' + SearchRefId + '&CityCode=' + values[2] + '&Details=' + details;
        window.open(url, '_blank');
    }
}