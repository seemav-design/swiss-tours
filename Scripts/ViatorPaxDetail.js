
$(function () {

    $(document).ready(function () {

        //Autocomplte Listbox in textbox
        $('#' + controlIdPrefix + 'lstHotels').change(function () {
            debugger;
            var text = $('option:selected', $(this)).text();
            var val = $('option:selected', $(this)).val();
            $('#txtHotelpick').val(text);
            $('#txtHotelpick').text(val);
            $('#' + controlIdPrefix + 'hdnHotel').val(text)
        });

        var keys = [];
        var values = [];

        var options = $('[id*=lstHotels] option');
        $.each(options, function (index, item) {
            keys.push(item.value);
            values.push(item.innerHTML);
        });
        $('#txtHotelpick').keyup(function () {
            var filter = $(this).val();
            DoListBoxFilter('[id*=lstHotels]', filter, keys, values);
        });
        //Autocomplte Listbox in textbox
        SetViewHideOfHotelPickUp();
        var isPick = $('#' + controlIdPrefix + 'hdnIsPickUp').val();
        var isGrade = $('#' + controlIdPrefix + 'hdnIsGrade').val();
        var isQns = $('#' + controlIdPrefix + 'hdnIsBkgQns').val();
        var hotelpck = $('#' + controlIdPrefix + 'hdnHotlPickId').val();
        if (isGrade == 1) {
            $("#dvGrade").show();

        }
        if (isPick == 1) {
            $("#dvhotelPckup").show();
            if (hotelpck != "") {
                $('#' + controlIdPrefix + 'hdnHotel').val(hotelpck)
                $('#txtHotelpick').val(hotelpck);
                // $('#' + controlIdPrefix + 'rdoHotl').attr('checked', true);
                //$("#dvSearchhtl").show();
            }

        }
        else if (isPick == 2) {
            $("#dvNohotelPckup").show();
        }
        else if (isPick == 0) {
            $('#spnpickup').css("display", "none");
            tabOpen('summer');
        }
        if (isQns == 1) {
            $("#dvQuestinaire").show();

        }
        var date = $('#' + controlIdPrefix + 'hdnBookDate').val();
        //$('#lblDate').val(date);
        $('#' + controlIdPrefix + "frmHotelPickUp_" + 'lblDate').text(date);

        //        $("#txtHotelpick").autocomplete({

        //            source: function (request, response) {

        //                $.ajax({
        //                    type: "POST",
        //                    contentType: "application/json; charset=utf-8",
        //                    url: "ViatorPaxDetails.aspx/GetHotelPickupDetails",
        //                    data: "{'HotelPick':'" + $("#txtHotelpick").val() + "'}",
        //                    datatype: "json",
        //                    success: function (data) {
        //                        var kk = $.map(data.d, function (item) {
        //                            return {
        //                                value: item.name,
        //                                key: item.id
        //                            }
        //                        });
        //                        response(kk);

        //                        //response(data.d[0].name);
        //                    },
        //                    error: function (result) {
        //                        //alert("Error");
        //                    }


        //                });
        //            },
        //            select: function (event, ui) {

        //                var vals = ui.item.value;
        //                var key = ui.item.key
        //                // alert(vals + key);
        //                //$('#<%=hdnHotlPickId.ClientID %>').val(key);
        //                parseInt($('#' + controlIdPrefix + 'hdnHotel').val(vals));
        //                //parseInt($('#' + controlIdPrefix + 'hdnHotlPickId').val(vals));
        //                // $('#hdnHotlPickId').html(key);
        //            }
        //        });

        //        //autocomplte text box Hotelpickups
    });

});

function tabOpen(ele) {

    var IsQnHtl = $('#' + controlIdPrefix + 'hdnHtlQns').val();
    if (ele == 'summer') {
        if (IsQnHtl == "1") {
            $('#' + controlIdPrefix + 'btnSavePaxDetail').removeClass("hidenextbtn");
            $('#' + controlIdPrefix + 'btnSavePaxDetail').addClass("nextbtn savebtn");
        }
        $('#summertab').addClass("active");
        $('#pickuptab').removeClass("active");
    }
    else if (ele == 'pickup') {
        $('#pickuptab').addClass("active");
        $('#summertab').removeClass("active");
        if (IsQnHtl == "1") {
            $('#' + controlIdPrefix + 'btnNext').removeClass("hidenextbtn");
            $('#' + controlIdPrefix + 'btnNext').addClass("nextbtn");

            $('#' + controlIdPrefix + 'btnSavePaxDetail').removeClass("savebtn");
            $('#' + controlIdPrefix + 'btnSavePaxDetail').addClass("hidenextbtn");
        }

    }
    $('.tab_content').hide();
    document.getElementById(ele).style.display = 'block';
}
function checkPaxDetails() {

    var area = $('#txtArea').val();
    var number = $('#txtNumber').val();
    var Email = $('#txtEmail').val();
    var isPick = $('#' + controlIdPrefix + 'hdnIsPickUp').val();
    var Contain = 0;

    var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    var chek = regex.test(Email);

    $('#' + controlIdPrefix + 'dvPaxAdult').children("input:text").each(function () {
        if ($(this).val() == "") {
            Contain = Contain + 1;
        }

    });
    $('#' + controlIdPrefix + 'dvPaxChild').children("input:text").each(function () {
        if ($(this).val() == "") {
            Contain = Contain + 1;
        }
    });
    $('#' + controlIdPrefix + 'dvPaxInfant').children("input:text").each(function () {
        if ($(this).val() == "") {
            Contain = Contain + 1;
        }
    });


    if (Contain > 0) {
        $.fancybox("<div class='bold text-center f16' style='color: #ce000c'>Please fill all passenger details.</div>");
        return false;
    }
    else if (isNaN(area) || isNaN(number)) {
        $.fancybox("<div class='bold text-center f16' style='color: #ce000c'>Please enter a valid phone number.</div>");
        return false;
    }
    else if (area == "" || number == "") {
        $.fancybox("<div class='bold text-center f16' style='color: #ce000c'>Please enter a valid phone number.</div>");
        return false;
    }
    else if (!chek) {
        $.fancybox("<div class='bold text-center f16' style='color: #ce000c'>Please enter a valid email address.</div>");
        return false;
    }
    else if (isPick == 1) {
        var htl = $('#' + controlIdPrefix + 'rdoHotl').is(':checked');
        var nothotl = $('#' + controlIdPrefix + 'rdoHtlNot').is(':checked');
        var local = $('#' + controlIdPrefix + 'rdoLocal').is(':checked');
        var booknot = $('#' + controlIdPrefix + 'rdobkdnot').is(':checked');

        if (htl) {
            var hotel = $('#txtHotelpick').val();
            if (hotel == "") {
                $.fancybox("<div class='bold text-center f16' style='color: #ce000c'>Please a select pick up hotel.</div>");
                return false;
            }
        }
        else if (nothotl) {
            var nohtl = $('#' + controlIdPrefix + 'txthtlnotlist').val();
            if (nohtl == "") {
                $.fancybox("<div class='bold text-center f16' style='color: #ce000c'>Please a enter a pick up hotel.</div>");
                return false;
            }
        }
        else if (nothotl && local && booknot) {
            $.fancybox("<div class='bold text-center f16' style='color: #ce000c'>Please a select pick up hotel.</div>");
            return false;
        }
    }
    else
        return true;
}

function ServiceErrorMessage() {

    var errorMessage = $('#' + controlIdPrefix + 'hdnErrorMessage').val();
    $.fancybox("<div class='bold text-center f16' style='color: #ce000c'>" + errorMessage + "</div>");
}

function SetViewHideOfHotelPickUp() {
    var isPickUp = $('#' + controlIdPrefix + 'hdnIsPickUp').val();
    var IsGrade = $('#' + controlIdPrefix + 'hdnIsBkgQns').val();

    if (isPickUp != '0') {
        $('#spnpickup').css("display", "block");
    }
    else
        $('#spnpickup').css("display", "none");

    if (IsGrade != '0') {
        $('#spnBookQ').css("display", "block");
    }
    else
        $('#spnBookQ').css("display", "none");

}

function ValidateForm() {
    var isPickUp = $('#' + controlIdPrefix + 'hdnIsPickUp').val();
    var IsBkgQns = $('#' + controlIdPrefix + 'hdnIsBkgQns').val();

    if (IsBkgQns == '1') {
        $(".secQuestionaire").click(function (e) {
            var qAns = $(this).parent().parent().find(".txtSpecial").text();
            if (qAns == '')
                return false;
            else
                return
            true;
        });
    }
    //if (isPickUp == '1')
    //{

    //}
}
function fnLoadQuestionaire() {

    var a = 0;
    var isPickUp = $('#' + controlIdPrefix + 'hdnIsPickUp').val();
    if (isPickUp == "2") {
        var hName = $('#' + controlIdPrefix + 'txtholnot').val();
        if (hName != "") {
            $('#summertab').addClass("active");
            $('#pickuptab').removeClass("active");

            $('.tab_content').hide();
            document.getElementById('summer').style.display = 'block';

            $('#' + controlIdPrefix + 'btnSavePaxDetail').removeClass("hidenextbtn");
            $('#' + controlIdPrefix + 'btnSavePaxDetail').addClass("savebtn");
            // $('#' + controlIdPrefix + 'btnSavePaxDetail').addClass("savebtn");
            $('#' + controlIdPrefix + 'btnNext').removeClass("hidenextbtn");
        }
        else {
            $.fancybox("<div class='bold text-center f16' style='color: #ce000c'>Please enter your hotel pickup details or enter \"local\" if you live locally.</div>");
        }
    }
    return false;

}
function fnChangeHotelListing() {
    var texts = $("#txtTest").val();

    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: "PaxDetails.aspx/GetHotelPickupUpdate",
        data: "{'HotelPick':'" + $("#txtTest").val() + "'}",
        datatype: "json",
        //async:false,
        success: function (data) {

            $("#lstHotels").empty();
            $("[id*=lstHotels] option").remove();
            var kk = $.map(data.d, function (item) {

                $("[id*=lstHotels]").append('<option value="' + item.id + '">' + item.name + '</option>');
            });


            //$("#<%=lstSvcName.ClientID %>").append('<option value="' + svc + '">item ' + svc + '</option>');
            //alert("success");
        },
        error: function (result) {


        }


    });
}
function DoListBoxFilter(listBoxSelector, filter, keys, values) {
    var list = $(listBoxSelector);
    var selectBase = '<option value="{0}">{1}</option>';

    list.empty();
    for (i = 0; i < values.length; ++i) {

        var value = values[i];

        if (value == "" || value.toLowerCase().indexOf(filter.toLowerCase()) >= 0) {
            var temp = '<option value="' + keys[i] + '">' + value + '</option>';
            list.append(temp);
        }
    }
}
