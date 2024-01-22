$(function () {

    pgCount = document.getElementById("ContentPlaceHolder_hdnPageCount").value;
    $("#ContentPlaceHolder_txtSearchDestinations").autocomplete({
        source: function (request, response) {
            var searchtext = '';
            searchtext = document.getElementById("ContentPlaceHolder_txtSearchDestinations").value;
            $.ajax({
                type: "POST",
                url: "ApartmentListIN.aspx/GetCountryCityListDatas",
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                data: '{SearchText: "' + searchtext + '",SearchRefID:"' + document.getElementById("ContentPlaceHolder_hdnSearchRefId").value + '"}',
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
    //}
    //catch (e) {
    //	//document.getElementById("ContentPlaceHolder_hdnSearchFrom").value = e.message;
    //}
    //try {
    $('.ui-autocomplete').css('max-height', '500px');//this for auto complete box height   
    $('.ui-autocomplete').css('height', 'auto');//this for auto complete box height   
    //} catch (e) { document.getElementById("ContentPlaceHolder_hdnSearchFrom").value = e.message; }
});



function ValidationSummary() {
    $($('.search_forms').find('.highlight_error')).each(function (index, elem) {
        $(elem).removeClass('highlight_error');
    });

    var flag = true;
    if (document.getElementById("ContentPlaceHolder_txtSearchDestinations").value == "") {
        $("#ContentPlaceHolder_txtSearchDestinations").addClass('highlight_error');
        document.getElementById("ContentPlaceHolder_txtSearchDestinations").focus();
        flag = false;
    }

    if (document.getElementById("ContentPlaceHolder_txtCheckInDate").value == "") {
        $("#ContentPlaceHolder_txtCheckInDate").addClass('highlight_error');
        document.getElementById("ContentPlaceHolder_txtCheckInDate").focus();
        flag = false;
    }
    var noofdays = $("#ContentPlaceHolder_ddlDuration").val();
    if (noofdays == "") {
        $("#ContentPlaceHolder_ddlDurationOfStay").addClass('highlight_error');
        flag = false;
    }

    var noofpax = $("#ContentPlaceHolder_NoofPax").val();
    if (noofpax == "") {
        $("#ContentPlaceHolder_NumberOfPersons").addClass('highlight_error');
        flag = false;
    }


    $(function () {
        $('#ContentPlaceHolder_txtSearchDestinations').keydown(function () {
            $('#ContentPlaceHolder_txtSearchDestinations').removeClass('highlight_error');
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


var currPage = 1; // Index of the current page
var pgCount = 0;
var StarRating = "";
var StatusSelector = "";
function SetPaging(paging) {
    openProgressIndicator();
    document.getElementById("ContentPlaceHolder_Apartmentlist").innerHTML = '';
    currPage = paging;
    $.ajax({
        type: "POST",
        url: "ApartmentListIN.aspx/Filtering",
        data: '{SortByPrice: "' + $("#ContentPlaceHolder_SortByPrice").val() + '", SortByPaging: "' + currPage + '", SortByApartmentName :"' + document.getElementById("SortByApartmentName").value + '", SortByRating :"' + StarRating + '",CountryCode:"' + document.getElementById("ContentPlaceHolder_hdnCountryCode").value + '",SortByApartmentCode :"' + document.getElementById("SortByApartmentCode").value + '",SearchRefID:"' + document.getElementById("ContentPlaceHolder_hdnSearchRefId").value + '"}',
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
                var apartmentCount = list.split('@@@@@')[1];
                document.getElementById("ContentPlaceHolder_ApartmentCount").innerHTML = apartmentCount + ' ';
                document.getElementById("ContentPlaceHolder_Apartmentlist").innerHTML = htmlvalue;
                closeProgressIndicator();
                $('.ez_checkbox input[type="radio"]').ezMark();
            }
            $('html,body').scrollTop(0);
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

//function movePrevious() {
//	currPage--;

//	if (currPage < 1) {
//		currPage++;
//		return false;
//	}
//	else {
//		////if (currPage <= 7) {
//		if (currPage == 1) {
//			document.getElementById("paging_" + currPage).style.display = "";
//			//document.getElementById("paging_" + (currPage + 10)).style.display = "none";
//		}
//		else {
//			document.getElementById("paging_" + (currPage - 1)).style.display = "";
//			document.getElementById("paging_" + (currPage)).style.display = "none";
//		}

//		//else if ((currPage) <= (pgCount - 10)) {
//		//	document.getElementById("paging_" + (currPage)).style.display = "";
//		//	document.getElementById("paging_" + (currPage + 10)).style.display = "none";
//		//}
//		//else {
//		//document.getElementById("paging_" + (currPage - 1)).style.display = "";
//		//	document.getElementById("paging_" + (currPage + 10)).style.display = "none";
//	}
//	SetPaging(currPage);
//}



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
    try {
        $("#SortByApartmentName").autocomplete({
            source: function (request, response) {
                $.ajax({
                    type: "POST",
                    url: "ApartmentListIN.aspx/GetApartmentListData",
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    data: '{SortByApartmentName :"' + $("#SortByApartmentName").val() + '",SearchRefID:"' + document.getElementById("ContentPlaceHolder_hdnSearchRefId").value + '"}',
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
    }
    catch (e) { }



});


$(function () {
    try {
        $("#SortByApartmentCode").autocomplete({
            source: function (request, response) {

                $.ajax({
                    type: "POST",
                    url: "ApartmentListIN.aspx/GetApartmentCodeListData",
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    data: '{SortByApartmentCode :"' + $("#SortByApartmentCode").val() + '",SearchRefID:"' + document.getElementById("ContentPlaceHolder_hdnSearchRefId").value + '"}',
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

    $("input[name='selector[]']").bind("click", function () {
        openProgressIndicator();
        StarRating = '';
        $("input[name='selector[]']:checked").each(function (i) {
            StarRating += $(this).val() + ",";
        });

        document.getElementById("ContentPlaceHolder_Apartmentlist").innerHTML = '';
        $.ajax({
            type: "POST",
            url: "ApartmentListIN.aspx/Filtering",
            data: '{SortByPrice: "' + $("#ContentPlaceHolder_SortByPrice").val() + '", SortByPaging: "' + currPage + '", SortByApartmentName :"' + document.getElementById("SortByApartmentName").value + '", SortByRating :"' + StarRating + '",CountryCode:"' + document.getElementById("ContentPlaceHolder_hdnCountryCode").value + '",SortByApartmentCode :"' + document.getElementById("SortByApartmentCode").value + '",SearchRefID:"' + document.getElementById("ContentPlaceHolder_hdnSearchRefId").value + '"}',
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
                    document.getElementById("ContentPlaceHolder_ApartmentCount").innerHTML = htmlvalue1 + ' ';
                    document.getElementById("ContentPlaceHolder_Apartmentlist").innerHTML = htmlvalue;
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
});

function btnGoClick() {
    openProgressIndicator();
    $.ajax({
        type: "POST",
        url: "ApartmentListIN.aspx/Filtering",
        data: '{SortByPrice: "' + $("#ContentPlaceHolder_SortByPrice").val() + '", SortByPaging: "' + currPage + '", SortByApartmentName :"' + document.getElementById("SortByApartmentName").value + '", SortByRating :"' + StarRating + '",CountryCode:"' + document.getElementById("ContentPlaceHolder_hdnCountryCode").value + '",SortByApartmentCode :"' + document.getElementById("SortByApartmentCode").value + '",SearchRefID:"' + document.getElementById("ContentPlaceHolder_hdnSearchRefId").value + '"}',
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
                document.getElementById("ContentPlaceHolder_ApartmentCount").innerHTML = htmlvalue1 + ' ';
                document.getElementById("ContentPlaceHolder_Apartmentlist").innerHTML = htmlvalue;
                PagingBinding(list);
                closeProgressIndicator();
                $('.ez_checkbox input[type="radio"]').ezMark();
            }
        },
        failure: function (response) {
            alert(response.d);
        }
    });


}

function btnGoClick1() {
    openProgressIndicator();
    $.ajax({
        type: "POST",
        url: "ApartmentListIN.aspx/Filtering",
        data: '{SortByPrice: "' + $("#ContentPlaceHolder_SortByPrice").val() + '", SortByPaging: "' + currPage + '", SortByApartmentName :"' + document.getElementById("SortByApartmentName").value + '", SortByRating :"' + StarRating + '",CountryCode:"' + document.getElementById("ContentPlaceHolder_hdnCountryCode").value + '",SortByApartmentCode :"' + document.getElementById("SortByApartmentCode").value + '",SearchRefID:"' + document.getElementById("ContentPlaceHolder_hdnSearchRefId").value + '"}',
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
                document.getElementById("ContentPlaceHolder_ApartmentCount").innerHTML = htmlvalue1 + ' ';
                document.getElementById("ContentPlaceHolder_Apartmentlist").innerHTML = htmlvalue;
                PagingBinding(list);
                closeProgressIndicator();
                $('.ez_checkbox input[type="radio"]').ezMark();
            }
        },
        failure: function (response) {
            alert(response.d);
        }
    });


}

function ClearFilterClick(id) {
    switch (id) {
        case 1:
            document.getElementById("SortByApartmentName").value = "";
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
            document.getElementById("SortByApartmentCode").value = "";
            break;
        default:
            document.getElementById("SortByApartmentName").value = "";
            document.getElementById("SortByApartmentCode").value = "";
            $("#ContentPlaceHolder_SortByPrice").val("Ascending").attr("selected", "selected");
            StarRating = "";
            $("input[name='selector']").removeAttr("checked");
            $("ul.ez_checkbox.rating_filter li label div").removeClass("ez-checked-select");
            $("ul.ez_checkbox li label div").removeClass("ez-checked-select");
            break;
    }
    openProgressIndicator();
    $.ajax({
        type: "POST",
        url: "ApartmentListIN.aspx/Filtering",
        data: '{SortByPrice: "' + $("#ContentPlaceHolder_SortByPrice").val() + '", SortByPaging: "' + currPage + '", SortByApartmentName :"' + document.getElementById("SortByApartmentName").value + '", SortByRating :"' + StarRating + '",CountryCode:"' + document.getElementById("ContentPlaceHolder_hdnCountryCode").value + '",SortByApartmentCode :"' + document.getElementById("SortByApartmentCode").value + '",SearchRefID:"' + document.getElementById("ContentPlaceHolder_hdnSearchRefId").value + '"}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            if (data.d == "") {
                var url = window.location.origin + '/Default.aspx?cntry=' + document.getElementById("ContentPlaceHolder_hdnCountryCode").value;
                window.location.href = url;
            }
            else {
                var list = $.parseJSON(data.d);

                var htmlvalue = list.split('@@@@@')[0];
                var htmlvalue1 = list.split('@@@@@')[1];
                document.getElementById("ContentPlaceHolder_ApartmentCount").innerHTML = htmlvalue1 + ' ';
                document.getElementById("ContentPlaceHolder_Apartmentlist").innerHTML = htmlvalue;
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


function PagingBinding(list) {
    document.getElementById("ContentPlaceHolder_paging").innerHTML = "";
    var PagingCount = Math.ceil(list.split('@@@@@')[1] / 10);
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
            if (j > 5)
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
