
function chkClick(id) {
    var st = id.split('chk');
    if (document.getElementById(id).checked == true) {
        var total = document.getElementById("lblTotalPrice").innerText;
        if (document.getElementById("lblTotalPrice").innerText < document.getElementById("TotalAfterVatService").innerText) {
            var serCost = 'lblserviceCost' + st[1];
            var serviceCost = document.getElementById(serCost).innerText;
            var newamt = document.getElementById("TotalAfterVatService").innerText;
            var GrandTotal = parseFloat(newamt.split(' ')[1]) + parseFloat(serviceCost.split(' ')[1]);
            //alert('abs');
            document.getElementById("TotalAfterService").innerText = newamt.split(' ')[0] + ' ' + GrandTotal;
            document.getElementById("TotalAfterVatService").innerText = newamt.split(' ')[0] + ' ' + GrandTotal;
        }
        else {
            var serCost11 = 'lblserviceCost' + st[1];
            var serviceCost11 = document.getElementById(serCost11).innerText;
            var GrandTotal11 = parseFloat(total.split(' ')[1]) + parseFloat(serviceCost11.split(' ')[1]);
            //alert('abs');
            document.getElementById("TotalAfterService").innerText = total.split(' ')[0] + ' ' + GrandTotal11;
            document.getElementById("TotalAfterVatService").innerText = total.split(' ')[0] + ' ' + GrandTotal11;
        }
    }
    else if (document.getElementById(id).checked == false) {
        var total1 = document.getElementById("TotalAfterService").innerText;
        var serCost1 = 'lblserviceCost' + st[1];
        var serviceCost1 = document.getElementById(serCost1).innerText;
        var GrandTotal1 = parseFloat(total1.split(' ')[1]) - parseFloat(serviceCost1.split(' ')[1]);
        //alert('abs');
        document.getElementById("TotalAfterService").innerText = total1.split(' ')[0] + ' ' + GrandTotal1;
        document.getElementById("TotalAfterVatService").innerText = total1.split(' ')[0] + ' ' + GrandTotal1;
    }
}

//function ValidationBeforeBookingRequestNow() {
//    $($('.apmt_bookingform').find('.highlight_error')).each(function (index, elem) {
//        $(elem).removeClass('highlight_error');
//    });
//    var flag = true;


//    if (document.getElementById("ContentPlaceHolder_ddltitle").value == "") {
//        $("#ContentPlaceHolder_ddlPaxTitle").addClass('highlight_error');
//        $("#ContentPlaceHolder_ddlPaxTitle").focus();
//        flag = false;
//    }
//    if (document.getElementById("ContentPlaceHolder_txtFirstName").value == "") {
//        $("#ContentPlaceHolder_txtFirstName").addClass('highlight_error');
//        $("#ContentPlaceHolder_txtFirstName").focus();
//        flag = false;
//    }


//    if (document.getElementById("ContentPlaceHolder_txtLastName").value == "") {
//        $("#ContentPlaceHolder_txtLastName").addClass('highlight_error');
//        $("#ContentPlaceHolder_txtLastName").focus();
//        flag = false;
//    }

//    if (document.getElementById("ContentPlaceHolder_txtAddress1").value == "") {
//        $("#ContentPlaceHolder_txtAddress1").addClass('highlight_error');
//        $("#ContentPlaceHolder_txtAddress1").focus();
//        flag = false;
//    }

//    if (document.getElementById("ContentPlaceHolder_txtPostalCode").value == "") {
//        $("#ContentPlaceHolder_txtPostalCode").addClass('highlight_error');
//        $("#ContentPlaceHolder_txtPostalCode").focus();
//        flag = false;
//    }

//    if (document.getElementById("ContentPlaceHolder_txtCityCode").value == "") {
//        $("#ContentPlaceHolder_txtCityCode").addClass('highlight_error');
//        $("#ContentPlaceHolder_txtCityCode").focus();
//        flag = false;
//    }

//    if (document.getElementById("ContentPlaceHolder_txtPhoneNumber").value == "") {
//        $("#ContentPlaceHolder_txtPhoneNumber").addClass('highlight_error');
//        $("#ContentPlaceHolder_txtPhoneNumber").focus();
//        flag = false;
//    }

//    if (document.getElementById("ContentPlaceHolder_txtPhoneNumber").value == "") {
//        $("#ContentPlaceHolder_txtPhoneNumber").addClass('highlight_error');
//        $("#ContentPlaceHolder_txtPhoneNumber").focus();
//        flag = false;
//    }


//    var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;

//    if (reg.test(document.getElementById("ContentPlaceHolder_txtEmailId").value) == false) {
//        $("#ContentPlaceHolder_txtEmailId").addClass('highlight_error');
//        $("#ContentPlaceHolder_txtEmailId").focus();
//        flag = false;
//    }
//    if (document.getElementById("ContentPlaceHolder_chkTermsCondition").checked == false) {
//        $("ContentPlaceHolder_chkTermsCondition").addClass('highlight_error');
//        $($("ContentPlaceHolder_chkTermsCondition").parent()).addClass("highlight_error");
//        $("ContentPlaceHolder_chkTermsCondition").focus();
//        flag = false;
//    }

//    //if (document.getElementById("ContentPlaceHolder_txtPanCard").value == "") {
//    //	$("#ContentPlaceHolder_txtPanCard").addClass('highlight_error');
//    //	flag = false;
//    //}

//    if (document.getElementById("ddlPaxCountId").value == "") {
//        $("#ddlPaxCountId").addClass('highlight_error');
//        $("#ddlPaxCountId").focus();
//        flag = false;
//    }
//    if (document.getElementById("ddlCountry").value == "") {
//        $("#ContentPlaceHolder_ddlcountryname").addClass('highlight_error');
//        $("#ContentPlaceHolder_ddlcountryname").focus();
//        flag = false;
//    }


//    if (document.getElementById("ddlDDdate").value == "") {
//        $("#ddlDDdaterow").addClass('highlight_error');
//        $("#ddlDDdaterow").focus();
//        flag = false;
//    }
//    if (document.getElementById("ddlMMmonth").value == "") {
//        $("#ddlMMmonthrow").addClass('highlight_error');
//        $("#ddlMMmonthrow").focus();
//        flag = false;
//    }
//    if (document.getElementById("ddlyear").value == "") {
//        $("#ddlyearrow").addClass('highlight_error');
//        $("#ddlyearrow").focus();
//        flag = false;
//    }

//    var PanNoRregex = /^[A-Za-z]{5}\d{4}[A-Za-z]{1}$/;
//    if (PanNoRregex.test(document.getElementById("ContentPlaceHolder_txtPanCard").value) == false) {
//        $("#ContentPlaceHolder_txtPanCard").addClass('highlight_error');
//        $("#ContentPlaceHolder_txtPanCard").focus();
//        return false;
//    }

//    DateOfBirth();
//    GetCountryCode();
//    document.getElementById("RequestNowErrorMessage").innerText = 'Please contact your account manager to book this.';
//    document.getElementById("RequestNowErrorMessage").style.fontWeight = 'bold';
//    $(".fancybox_trig").fancybox({ "touch": false }).trigger("click");
//    return true;

//    $('.selectpicker').selectpicker('refresh');
//    return flag;

//}
function ValidationBeforeBooking() {
    $($('.ContentPlaceHolder_apmt_contactform').find('.highlight_error')).each(function (index, elem) {
        $(elem).removeClass('highlight_error');
    });
    var flag = true;



    if (document.getElementById("ContentPlaceHolder_ddltitle").value == "") {
        $("#ContentPlaceHolder_ddlPaxTitle").addClass('highlight_error');
        $("#ContentPlaceHolder_ddlPaxTitle").focus();
        flag = false;
    }
    else {
        $("#ContentPlaceHolder_ddlPaxTitle").removeClass('highlight_error');

    }
    if (document.getElementById("ContentPlaceHolder_txtFirstName").value == "") {
        $("#ContentPlaceHolder_txtFirstName").addClass('highlight_error');
        $("#ContentPlaceHolder_txtFirstName").focus();
        flag = false;
    }
    else {
        $("#ContentPlaceHolder_txtFirstName").removeClass('highlight_error');

    }

    if (document.getElementById("ContentPlaceHolder_txtLastName").value == "") {
        $("#ContentPlaceHolder_txtLastName").addClass('highlight_error');
        $("#ContentPlaceHolder_txtLastName").focus();
        flag = false;
    }
    else {
        $("#ContentPlaceHolder_txtLastName").removeClass('highlight_error');
    }
    if (document.getElementById("ContentPlaceHolder_txtAddress1").value == "") {
        $("#ContentPlaceHolder_txtAddress1").addClass('highlight_error');
        $("#ContentPlaceHolder_txtAddress1").focus();
        flag = false;
    }
    else {
        $("#ContentPlaceHolder_txtAddress1").removeClass('highlight_error');
    }
    if (document.getElementById("ContentPlaceHolder_txtPostalCode").value == "") {
        $("#ContentPlaceHolder_txtPostalCode").addClass('highlight_error');
        $("#ContentPlaceHolder_txtPostalCode").focus();
        flag = false;
    }
    else {
        $("#ContentPlaceHolder_txtPostalCode").removeClass('highlight_error');

    }
    if (document.getElementById("ContentPlaceHolder_txtCityCode").value == "") {
        $("#ContentPlaceHolder_txtCityCode").addClass('highlight_error');
        $("#ContentPlaceHolder_txtCityCode").focus();
        flag = false;
    } else {
        $("#ContentPlaceHolder_txtCityCode").removeClass('highlight_error');

    }

    if (document.getElementById("ContentPlaceHolder_txtPhoneNumber").value == "") {
        $("#ContentPlaceHolder_txtPhoneNumber").addClass('highlight_error');
        $("#ContentPlaceHolder_txtPhoneNumber").focus();
        flag = false;
    }
    else {
        $("#ContentPlaceHolder_txtPhoneNumber").removeClass('highlight_error');

    }
    if (document.getElementById("ContentPlaceHolder_txtPhoneNumber").value == "") {
        $("#ContentPlaceHolder_txtPhoneNumber").addClass('highlight_error');
        $("#ContentPlaceHolder_txtPhoneNumber").focus();
        flag = false;
    }
    else {
        $("#ContentPlaceHolder_txtPhoneNumber").removeClass('highlight_error');

    }

    var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;

    if (reg.test(document.getElementById("ContentPlaceHolder_txtEmailId").value) == false) {
        $("#ContentPlaceHolder_txtEmailId").addClass('highlight_error');
        $("#ContentPlaceHolder_txtEmailId").focus();
        flag = false;
    } else {
        $("#ContentPlaceHolder_txtEmailId").removeClass('highlight_error');

    }

    if (document.getElementById("chkTermsCondition").checked == false) {
        $("#chkTermsCondition").addClass('highlight_error');
        $($("#chkTermsCondition").parent()).addClass("highlight_error");
        $("#chkTermsCondition").focus();
        flag = false;
    }
    else {
        $("#chkTermsCondition").removeClass('highlight_error');

    }

    //if (document.getElementById("ContentPlaceHolder_txtPanCard").value == "") {
    //	$("#ContentPlaceHolder_txtPanCard").addClass('highlight_error');
    //	flag = false;
    //}

    if (document.getElementById("ddlPaxCountId").value == "") {
        $("#ddlPaxCountId").addClass('highlight_error');
        $("#ddlPaxCountId").focus();
        flag = false;
    }
    else {
        $("#ddlPaxCountId").removeClass('highlight_error');

    }
    if (document.getElementById("ddlCountry").value == "") {
        $("#ContentPlaceHolder_ddlcountryname").addClass('highlight_error');
        $("#ContentPlaceHolder_ddlcountryname").focus();
        flag = false;
    }
    else {
        $("#ContentPlaceHolder_ddlcountryname").removeClass('highlight_error');

    }

    if (document.getElementById("ddlDDdate").value == "") {
        $("#ddlDDdaterow").addClass('highlight_error');
        $("#ddlDDdaterow").focus();
        flag = false;
    }
    else {
        $("#ddlDDdaterow").removeClass('highlight_error');

    }

    if (document.getElementById("ddlMMmonth").value == "") {
        $("#ddlMMmonthrow").addClass('highlight_error');
        $("#ddlMMmonthrow").focus();
        flag = false;
    }
    else {
        $("#ddlMMmonthrow").removeClass('highlight_error');

    }
    if (document.getElementById("ddlyear").value == "") {
        $("#ddlyearrow").addClass('highlight_error');
        $("#ddlyearrow").focus();
        flag = false;
    }
    else {
        $("#ddlyearrow").removeClass('highlight_error');

    }
    var PanNoRregex = /^[A-Za-z]{3}[Pp]{1}[A-Za-z]{1}\d{4}[A-Za-z]{1}$/;
    if (PanNoRregex.test(document.getElementById("ContentPlaceHolder_txtPanCard").value) == false) {
        $("#ContentPlaceHolder_txtPanCard").addClass('highlight_error');
        $("#ContentPlaceHolder_txtPanCard").focus();
        return false;
    }
    else {
        $("#ContentPlaceHolder_txtPanCard").removeClass('highlight_error');

    }
    DateOfBirth();
    GetCountryCode();


    $('.selectpicker').selectpicker('refresh');
    return flag;

}

function DateOfBirth() {
    var date = document.getElementById("ddlDDdate").value;
    var month = document.getElementById("ddlMMmonth").value;
    var Year = document.getElementById("ddlyear").value;
    document.getElementById("ContentPlaceHolder_hdnDOB").value = date + ' ' + month + ' ' + Year;
}

function GetCountryCode() {
    var countryCode = document.getElementById("ddlCountry").value;
    document.getElementById("ContentPlaceHolder_hdnCountryCode").value = countryCode;
}


function changePaxValue(ids) {
    openProgressIndicator();
    var paxvalue = 0;
    var childcnt = 0;
    var infantcnt = 0;
    //if (ids == 'ddlchild') {
    //    childcnt = document.getElementById("ddlchild").value;
    //}
    //else   {
    //    infantcnt = document.getElementById("ddlInfant").value;
    //}
    childcnt = document.getElementById("ddlchild").value != '' ? document.getElementById("ddlchild").value : 0;
    infantcnt = document.getElementById("ddlInfant").value != '' ? document.getElementById("ddlInfant").value : 0;
    paxvalue = document.getElementById("ddlPaxCountId").value;
    document.getElementById("ContentPlaceHolder_hdnPaxValue").value = paxvalue;
    document.getElementById("ContentPlaceHolder_hdnChildValue").value = childcnt;
    document.getElementById("ContentPlaceHolder_hdnInfantValue").value = infantcnt;
    var SearchRefId = document.getElementById("ContentPlaceHolder_hdnsearchRefId").value;
    var apartmentCode = document.getElementById("ContentPlaceHolder_hdnApartmentCode").value;
    var TransactionId = document.getElementById("ContentPlaceHolder_hdnTransactionid").value;
    $.ajax({
        type: "POST",
        url: "/Apartment/apartment_booking.aspx/GetPaxDetail",
        data: '{aultcnt:' + paxvalue + ',SearchRefId:"' + SearchRefId + '",ApartmentCode:"' + apartmentCode + '",TransactionId:"' + TransactionId + '",ids:"' + ids + '",childcnt:' + childcnt + ',infantcnt:' + infantcnt + '}',
        //data: '{aultcnt:' + paxvalue + '}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {

            if (data.d != "") {
                debugger;
                var list = $.parseJSON(data.d);
                document.getElementById("ContentPlaceHolder_DisplayPaxEntry").innerHTML = "";
                document.getElementById("ContentPlaceHolder_DisplayPaxEntry").innerHTML = list;
                $('.selectpicker').selectpicker('refresh');
            }
            closeProgressIndicator();
        },
        failure: function (response) {
            alert(response.d);
        }
    });
}




$(function () {
    $("#ContentPlaceHolder_txtCustomerResidence").autocomplete({
        source: "/Hotel/Nationality.ashx",
        minLength: 1,
        select: function (event, ui) {
            document.getElementById("ContentPlaceHolder_hdnNationality").value = ui.item.CountryCode + ":" + ui.item.CountryName;
            document.getElementById("ContentPlaceHolder_txtCustomerResidence").value = ui.item.CountryCode + ":" + ui.item.CountryName;
            this.value = ui.item.CountryName + "," + ui.item.CountryCode;
            return false;
        }
    });

    $.ui.autocomplete.prototype._renderItem = function (ul, item) {
        var name = item.CountryName + "," + item.CountryCode;
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
                .append("<div><span style='color:#ce000c;font-size:75%'><i>" + name + " </i></span></div>")
                .appendTo(ul);
        }
    };



    //try {
    //	$("#ContentPlaceHolder_txtCustomerResidence").autocomplete({
    //		source: function (request, response) {
    //			var searchtext = '';
    //			searchtext = document.getElementById("ContentPlaceHolder_txtCustomerResidence").value;
    //			$.ajax({
    //				type: "POST",
    //				url: "apartment_booking.aspx/GetCountrySearch",
    //				contentType: "application/json; charset=utf-8",
    //				dataType: "json",
    //				data: '{SearchText: "' + searchtext + '"}',
    //				success: function (data) {
    //					response(data.d);
    //				},
    //				failure: function (response) {
    //					alert(response.d);
    //				}
    //			});
    //		},
    //		minLength: 3,
    //		select: function (event, ui) {
    //			document.getElementById("ContentPlaceHolder_hdnNationality").value = ui.item.CountryCode + ":" + ui.item.CountryName;
    //		}
    //	});
    //}
    //catch (e) {
    //	//document.getElementById("ContentPlaceHolder_hdnSearchFrom").value = e.message;
    //}
    //try {
    //	$('.ui-autocomplete').css('max-height', '500px');//this for auto complete box height   
    //	$('.ui-autocomplete').css('height', 'auto');//this for auto complete box height   
    //} catch (e) { document.getElementById("ContentPlaceHolder_hdnNationality").value = e.message; }
});

function confirmBookingPopup() {
    $(".fancybox_trig").fancybox({ "touch": false }).trigger("click");
    return false;

}
