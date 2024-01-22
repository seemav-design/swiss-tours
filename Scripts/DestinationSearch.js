$(function () {
	if (document.URL.includes("SightSeeingList.aspx")) {
		pgCount = document.getElementById("ContentPlaceHolder_hdnPageCount").value;
	}
	try {
		$("#ContentPlaceHolder_txtSearchByCity").autocomplete({
			source: function (request, response) {
				var searchtext = '';
				if (document.getElementById("ContentPlaceHolder_switzerlandURL").value == 'MY') {
					searchtext = 'SwitzerLand';
				}
				else {
					searchtext = document.getElementById("ContentPlaceHolder_txtSearchByCity").value;
				}
				$.ajax({
					type: "POST",
					url: "/Sightseeing/SightSeeingSearch.aspx/GetCountryCityListData",
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
				document.getElementById("ContentPlaceHolder_hdnSearchFrom").value = ui.item.CityName + ":" + ui.item.CityId + ":" + ui.item.CountryName + ":" + ui.item.CountryCode;
			}
		});
	} catch (e) { }
	try {
		$('.ui-autocomplete').css('max-height', '500px');//this for auto complete box height   
		$('.ui-autocomplete').css('height', 'auto');//this for auto complete box height   
    } catch (e) { }


    try {
        $("#ContentPlaceHolder_txtSearchSSCity").autocomplete({
            source: function (request, response) {
                var searchtext = '';
                searchtext = document.getElementById("ContentPlaceHolder_txtSearchSSCity").value;
                $.ajax({
                    type: "POST",
                    url: "/Sightseeing/SightSeeingSearch.aspx/GetCountryCityListData",
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
                document.getElementById("ContentPlaceHolder_hdnSearchFrom").value = ui.item.CityName + ":" + ui.item.CityId + ":" + ui.item.CountryName + ":" + ui.item.CountryCode;
            }
        });
    } catch (e) { }
    try {
        $('.ui-autocomplete').css('max-height', '500px');//this for auto complete box height   
        $('.ui-autocomplete').css('height', 'auto');//this for auto complete box height   
    } catch (e) { }
});
$(document).ready(function () {
	$("#ContentPlaceHolder_txtCheckInDate").datetimepicker({
		startDate: new Date(),
		minView: 2,
		format: 'dd M yyyy',
		autoclose: 1,
	});
	if (document.getElementById("ContentPlaceHolder_switzerlandURL").value == 'MY') {
		document.getElementById("ContentPlaceHolder_txtSearchByCity").value = 'Central Switzerland' + "," + 'Switzerland';
		document.getElementById("ContentPlaceHolder_hdnSearchFrom").value = 'Central Switzerland' + ":" + '22430' + ":" + 'Switzerland' + ":" + '69';
	}
	else { }
});





var currPage = 1; // Index of the current page
var pgCount = 0;
var StarRating = "";
var StatusSelector = "";
function SetPaging(paging) {
	openProgressIndicator();
	document.getElementById("ContentPlaceHolder_SightSeeinglist").innerHTML = '';
	currPage = paging;
	$.ajax({
		type: "POST",
		url: "SightSeeingList.aspx/Filtering",
		//data: '{SortByPrice: "' + $("#ContentPlaceHolder_SortByPrice").val() + '", SortByPaging: "' + currPage + '", SortBySightSeeingName :"' + "" + '", SortByRating :"' + StarRating + '",CountryCode:"' + document.getElementById("ContentPlaceHolder_hdnCountryCode").value + '",CountryCode:"' + document.getElementById("ContentPlaceHolder_hdnCountryCode").value + '", SortByTourGradeCode :"' + document.getElementById("SortByTourGradeCode").value + '"}',
        data: '{SortByPrice: "' + $("#ContentPlaceHolder_SortByPrice").val() + '", SortByPaging: "' + currPage + '", SortBySightSeeingName :"' + document.getElementById("SortBySightSeeingName").value + '", SortByRating :"' + StarRating + '",CountryCode:"' + document.getElementById("ContentPlaceHolder_hdnCountryCode").value + '", SortByTourGradeCode :"' + document.getElementById("SortByTourGradeCode").value + '", SearchRefID :"' + document.getElementById("ContentPlaceHolder_hdnSearchRefId").value + '"}',
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
				var sightSeeingCount = list.split('@@@@@')[1];
				document.getElementById("ContentPlaceHolder_sightSeeingCount").innerHTML = sightSeeingCount + ' ';
				document.getElementById("ContentPlaceHolder_SightSeeinglist").innerHTML = htmlvalue;
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

		if (currPage % 5) {
			if (currPage == (pgCount - 3)) {
				document.getElementById("paging_" + currPage).style.display = "";
				document.getElementById("paging_" + (currPage + 1)).style.display = "";
				document.getElementById("paging_" + (currPage + 2)).style.display = "";
				document.getElementById("paging_" + (currPage + 3)).style.display = "";
			}
			else if (currPage == (pgCount - 2)) {
				document.getElementById("paging_" + currPage).style.display = "";
				document.getElementById("paging_" + (currPage + 1)).style.display = "";
				document.getElementById("paging_" + (currPage + 2)).style.display = "";
			}
			else if (currPage == (pgCount - 1)) {
				document.getElementById("paging_" + currPage).style.display = "";
				document.getElementById("paging_" + (currPage + 1)).style.display = "";
			}
			else if (currPage == (pgCount)) {
				document.getElementById("paging_" + currPage).style.display = "";
				//document.getElementById("paging_" + (currPage + 1)).style.display = "";
			}
			else {
				document.getElementById("paging_" + currPage).style.display = "";
				document.getElementById("paging_" + (currPage + 1)).style.display = "";
				document.getElementById("paging_" + (currPage + 2)).style.display = "";
				document.getElementById("paging_" + (currPage + 3)).style.display = "";
				document.getElementById("paging_" + (currPage + 4)).style.display = "";
			}
			if (currPage >= 10) {
				if (currPage == (pgCount - 1)) {
					var i;
					for (i = 0; i < 2; i++) {
						if (i == 0) {
							document.getElementById("paging_" + (currPage - 10)).style.display = "none";
						}
						else {

							var j = currPage + (i);
							document.getElementById("paging_" + (j - 10)).style.display = "none";
						}
					}

				}
				else {
					var i;
					for (i = 0; i < 5; i++) {
						if (i == 0) {
							document.getElementById("paging_" + (currPage - 10)).style.display = "none";
						}
						else {

							var j = currPage + (i);
							document.getElementById("paging_" + (j - 10)).style.display = "none";
						}
					}
				}
			}


		}
		else {
			document.getElementById("paging_" + currPage).style.display = "";
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
			document.getElementById("paging_" + (currPage + 10)).style.display = "none";
		}
		else if ((currPage) <= (pgCount - 10)) {
			document.getElementById("paging_" + (currPage)).style.display = "";
			document.getElementById("paging_" + (currPage + 10)).style.display = "none";
		}
		else {
			document.getElementById("paging_" + (currPage - 1)).style.display = "";
			//	document.getElementById("paging_" + (currPage + 10)).style.display = "none";
		}
	SetPaging(currPage);
}

function Validation() {
	$($('.search_forms').find('.highlight_error')).each(function (index, elem) {
		$(elem).removeClass('highlight_error');
	});

	var flag = true;
	if (document.getElementById("ContentPlaceHolder_txtSearchByCity").value == "") {
		$("#ContentPlaceHolder_txtSearchByCity").addClass('highlight_error');
		document.getElementById("ContentPlaceHolder_txtSearchByCity").focus();
		flag = false;
	}

	if (document.getElementById("ContentPlaceHolder_txtCheckInDate").value == "") {
		$("#ContentPlaceHolder_txtCheckInDate").addClass('highlight_error');
		document.getElementById("ContentPlaceHolder_txtCheckInDate").focus();
		flag = false;
	}
	var adult = $("#ContentPlaceHolder_ddlAdultCount").val();
	if (adult == "") {
		$("#drdAdult1").addClass('highlight_error');
		flag = false;
	}
	var child = $("#ContentPlaceHolder_child_select").val();
	var chcount = child.split(" ");

	if (chcount[0] > 0) {
		for (var j = 0; j < chcount[0]; j++) {

			if ($("#ContentPlaceHolder_Child" + (j + 1)).val() == "") {
				var id = "#ContentPlaceHolder_Child" + (j + 1);
				$("#ContentPlaceHolder_Child" + (j + 1)).addClass('highlight_error');
				$('.selectpicker').selectpicker('refresh');
				flag = false;
			}
		}

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

function btnGoClick() {
	openProgressIndicator();
	$.ajax({
		type: "POST",
		url: "SightSeeingList.aspx/Filtering",
        data: '{SortByPrice: "' + $("#ContentPlaceHolder_SortByPrice").val() + '", SortByPaging: "' + currPage + '", SortBySightSeeingName :"' + document.getElementById("SortBySightSeeingName").value + '", SortByRating :"' + StarRating + '",CountryCode:"' + document.getElementById("ContentPlaceHolder_hdnCountryCode").value + '", SortByTourGradeCode :"' + document.getElementById("SortByTourGradeCode").value + '", SearchRefID :"' + document.getElementById("ContentPlaceHolder_hdnSearchRefId").value + '"}',
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
				document.getElementById("ContentPlaceHolder_sightSeeingCount").innerHTML = htmlvalue1 + ' ';
				document.getElementById("ContentPlaceHolder_SightSeeinglist").innerHTML = htmlvalue;
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
		url: "SightSeeingList.aspx/Filtering",
        data: '{SortByPrice: "' + $("#ContentPlaceHolder_SortByPrice").val() + '", SortByPaging: "' + currPage + '", SortBySightSeeingName :"' + document.getElementById("SortBySightSeeingName").value + '", SortByRating :"' + StarRating + '",CountryCode:"' + document.getElementById("ContentPlaceHolder_hdnCountryCode").value + '", SortByTourGradeCode :"' + document.getElementById("SortByTourGradeCode").value + '", SearchRefID :"' + document.getElementById("ContentPlaceHolder_hdnSearchRefId").value + '"}',
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
				document.getElementById("ContentPlaceHolder_sightSeeingCount").innerHTML = htmlvalue1 + ' ';
				document.getElementById("ContentPlaceHolder_SightSeeinglist").innerHTML = htmlvalue;
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

function PagingBinding(list) {
	document.getElementById("ContentPlaceHolder_paging").innerHTML = "";
	var PagingCount = Math.ceil(list.split('@@@@@')[1] / 20);
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

$(function () {
	try {
		$("#SortBySightSeeingName").autocomplete({
			source: function (request, response) {
				$.ajax({
					type: "POST",
					url: "SightSeeingList.aspx/GetSightSeeingListData",
					contentType: "application/json; charset=utf-8",
					dataType: "json",
                    data: '{SortBySightSeeingName :"' + $("#SortBySightSeeingName").val() + '",SearchRefID :"' + document.getElementById("ContentPlaceHolder_hdnSearchRefId").value + '"}',
					success: function (data) {
						response(data.d);
					},
					failure: function (response) {
						alert(response.d);
					}
				});
			},
			//minLength: 3,
		});
	} catch (e) { }


	$("input[name='selector[]']").bind("click", function () {
		openProgressIndicator();
		StarRating = "";
		$("input[name='selector[]']:checked").each(function (i) {
			StarRating += $(this).val() + ",";
		});

		document.getElementById("ContentPlaceHolder_SightSeeinglist").innerHTML = '';
		$.ajax({
			type: "POST",
			url: "SightSeeingList.aspx/Filtering",
            data: '{SortByPrice: "' + $("#ContentPlaceHolder_SortByPrice").val() + '", SortByPaging: "' + currPage + '", SortBySightSeeingName :"' + document.getElementById("SortBySightSeeingName").value + '", SortByRating :"' + StarRating + '",CountryCode:"' + document.getElementById("ContentPlaceHolder_hdnCountryCode").value + '",SortByTourGradeCode :"' + document.getElementById("SortByTourGradeCode").value + '", SearchRefID :"' + document.getElementById("ContentPlaceHolder_hdnSearchRefId").value + '"}',
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
					document.getElementById("ContentPlaceHolder_sightSeeingCount").innerHTML = htmlvalue1 + ' ';
					document.getElementById("ContentPlaceHolder_SightSeeinglist").innerHTML = htmlvalue;
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
$(function () {
	try {
		$("#SortByTourGradeCode").autocomplete({
			source: function (request, response) {

				$.ajax({
					type: "POST",
					url: "SightSeeingList.aspx/GetTourGradeCode",
					contentType: "application/json; charset=utf-8",
					dataType: "json",
                    data: '{SortByTourGradeCode :"' + $("#SortByTourGradeCode").val() + '",SearchRefID :"' + document.getElementById("ContentPlaceHolder_hdnSearchRefId").value + '"}',
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
		StarRating = "";
		$("input[name='selector[]']:checked").each(function (i) {
			StarRating += $(this).val() + ",";
		});

		document.getElementById("ContentPlaceHolder_SightSeeinglist").innerHTML = '';
		$.ajax({
			type: "POST",
			url: "SightSeeingList.aspx/Filtering",
            data: '{SortByPrice: "' + $("#ContentPlaceHolder_SortByPrice").val() + '", SortByPaging: "' + currPage + '", SortBySightSeeingName :"' + document.getElementById("SortBySightSeeingName").value + '", SortByRating :"' + StarRating + '",CountryCode:"' + document.getElementById("ContentPlaceHolder_hdnCountryCode").value + '", SortByTourGradeCode :"' + document.getElementById("SortByTourGradeCode").value + '",SearchRefID :"' + document.getElementById("ContentPlaceHolder_hdnSearchRefId").value + '"}',
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
					document.getElementById("ContentPlaceHolder_sightSeeingCount").innerHTML = htmlvalue1 + ' ';
					document.getElementById("ContentPlaceHolder_SightSeeinglist").innerHTML = htmlvalue;
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

function invokelnkbtnPopular(vids) {
	var id = "lnkBtnCodePopular" + (vids + 1);
	var btnvalue = document.getElementById(id).value;
	var id2 = "hdncityvalues" + (vids + 1);
	document.getElementById("ContentPlaceHolder_hdnSearchFrom").value = document.getElementById(id2).value;
    document.getElementById("ContentPlaceHolder_txtSearchByCity").value = btnvalue;
    window.scrollTo(0, 0)
    flag = false;
    return flag;

}


function invokelnkbtnPopular_Test(vids) {
    debugger;
    var flag = false;
    //var id = "lnkBtnCodePopular" + (vids + 1);
    var id = "lnkBtnCodePopular" + (vids);
    var btnvalue = document.getElementById(id).value;
    var id2 = "hdncityvalues" + (vids);
    document.getElementById("ContentPlaceHolder_hdnSearchFrom").value = document.getElementById(id2).value;
    document.getElementById("ContentPlaceHolder_txtSearchByCity").value = btnvalue;
    window.scrollTo(0, 0)
  

    //$.ajax({
    //    type: "POST",
    //    url: "/Sightseeing/SightSeeingSearch.aspx/DirectRedirection",
    //    data: '{SearchFromvalue :"' + document.getElementById("ContentPlaceHolder_hdnSearchFrom").value + '"}',
    //    contentType: "application/json; charset=utf-8",
    //    dataType: "json",
    //    success: function (data) {
    //        if (data.d != "") {
    //            debugger;
    //            openProgressIndicator();
              
    //            url = window.location.origin + data.d;
    //            var w = window.open(url);
              

    //            var windowUrl = window.location.origin + data.d;
    //            w.location = data.d;
    //            flag = false;
    //            closeProgressIndicator();
    //        }

    //    },
    //    failure: function (response) {
    //        alert(response.d);
    //    }

    //});
    return flag;

}

function invokelnkbtnPopular2(vids) {
	var id = "lnkBtnCodePopular" + (vids + 1);
	var btnvalue = document.getElementById(id).value;
	var id2 = "hdncityvalues" + (vids + 1);
	document.getElementById("ContentPlaceHolder_hdnSearchFrom").value = document.getElementById(id2).value;
	document.getElementById("ContentPlaceHolder_txtSearchByCity").value = btnvalue;
	document.getElementById("ContentPlaceHolder_hdnSearchFrom").value = ui.item.CityName + ":" + ui.item.CityId + ":" + ui.item.CountryName + ":" + ui.item.CountryCode;
	window.scrollTo(0, 0)
}

function ClearFilterClick(id) {
	switch (id) {
		case 1:
			document.getElementById("SortBySightSeeingName").value = "";
			break;
		case 2:
			$("#ContentPlaceHolder_SortByPrice").val("Ascending");
			break;
		case 3:
			StarRating = "";
			$("ul.ez_checkbox.rating_filter li label div").removeClass("ez-checked-select");
			break;
		case 4:
			document.getElementById("SortByTourGradeCode").value = "";
			break;
		default:
			document.getElementById("SortBySightSeeingName").value = "";
			document.getElementById("SortByTourGradeCode").value = "";
			$("#ContentPlaceHolder_SortByPrice").val("Ascending").attr("selected", "selected");
			StarRating = "";
			//$('#ContentPlaceHolder_SortByPrice').slider('refresh');
			$("ul.ez_checkbox.rating_filter li label div").removeClass("ez-checked-select");
			$("ul.ez_checkbox li label div").removeClass("ez-checked-select");
			break;
	}
	openProgressIndicator();
	$.ajax({
		type: "POST",
		url: "SightSeeingList.aspx/Filtering",
        data: '{SortByPrice: "' + $("#ContentPlaceHolder_SortByPrice").val() + '", SortByPaging: "' + currPage + '", SortBySightSeeingName :"' + document.getElementById("SortBySightSeeingName").value + '", SortByRating :"' + StarRating + '",CountryCode:"' + document.getElementById("ContentPlaceHolder_hdnCountryCode").value + '", SortByTourGradeCode :"' + document.getElementById("SortByTourGradeCode").value + '",SearchRefID :"' + document.getElementById("ContentPlaceHolder_hdnSearchRefId").value + '"}',
		//data: '{SortByPrice: "' + $("#ContentPlaceHolder_SortByPrice").val() + '", SortByPaging: "' + currPage + '", SortBySightSeeingName :"' + document.getElementById("SortBySightSeeingName").value + '", SortByRating :"' + StarRating + '",CountryCode:"' + document.getElementById("ContentPlaceHolder_hdnCountryCode").value + '", SortByTourGradeCode :"' + document.getElementById("SortByTourGradeCode").value + '"}',
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
				document.getElementById("ContentPlaceHolder_sightSeeingCount").innerHTML = htmlvalue1 + ' ';
				document.getElementById("ContentPlaceHolder_SightSeeinglist").innerHTML = htmlvalue;
				PagingBinding(list);
				closeProgressIndicator();
				$('.ez_checkbox input[type="radio"]').ezMark();
			}
		},
		failure: function (response) {
			alert(response.d);
		}
	});
	return false;
}




