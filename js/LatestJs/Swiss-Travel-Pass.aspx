<%@ Page Language="C#" MasterPageFile="~/Main.master" AutoEventWireup="true" CodeFile="Swiss-Travel-Pass.aspx.cs"
    Inherits="PassMtEx_Swiss_Travel_Pass"
    Title="Swiss Travel Pass | Buy Swiss Rail Pass at Best Cost - 2021 Travel"
    MetaDescription="Swiss Travel Pass offers unlimited access on Swiss Travel System - train, bus, tram, & museums at discounted prices. Choose your Swiss Pass from 3,4,8,15 days." %>

<asp:Content ID="Content1" ContentPlaceHolderID="ContentPlaceHolder" runat="Server">


    <!-- PAGE CONTENT HOLDER STARTS  -->
    <script>
        function downloaddsdfsAll(url) {
            var urls = url.split('#');
            var link = document.createElement('a');

            link.setAttribute('download', null);
            link.style.display = 'none';

            document.body.appendChild(link);

            for (var i = 0; i < urls.length; i++) {
                link.setAttribute('href', urls[i]);
                link.click();
            }

            document.body.removeChild(link);
        }

        function downloadAll(url) {
            var arguments = url.split('#');
            for (var i = 0; i < arguments.length; i++) {
                var iframe = $('<iframe style="visibility: collapse;"></iframe>');
                $('body').append(iframe);
                var content = iframe[0].contentDocument;
                var form = '<form action="' + arguments[i] + '" method="GET"></form>';
                content.write(form);
                $('form', content).submit();
                setTimeout((function (iframe) {
                    return function () {
                        iframe.remove();
                    }
                })(iframe), 2000);
            }
        }

        function Validation() {
            var flag = true;
            if ($.trim($("#ddl_Adult").val()) == "" || $.trim($("#ddl_Adult").val()) == "0") {
                if ($.trim($("#ddl_Youth").val()) == "" || $.trim($("#ddl_Youth").val()) == "0") {
                    if ($.trim($("#ddl_Child").val()) == "" || $.trim($("#ddl_Child").val()) == "0") {

                        $("#ddl_Adult").addClass('highlight_error');
                        $("#ddl_Youth").addClass('highlight_error');
                        $("#ddl_Child").addClass('highlight_error');
                        flag = false;
                    }
                    else {
                        $("#ddl_Adult").removeClass('highlight_error');
                        $($("#ddl_Adult").parent()).removeClass("highlight_error");
                        $("#ddl_Youth").removeClass('highlight_error');
                        $($("#ddl_Youth").parent()).removeClass("highlight_error");
                        $("#ddl_Child").removeClass('highlight_error');
                        $($("#ddl_Child").parent()).removeClass("highlight_error");
                    }
                }
            }

            if ($("#ddl_Adult").val() == 0 && $("#ddl_Youth").val() == 0) {
                if ($("#ddl_Child").val() > 0) {
                    if (document.getElementById("chk_Child").checked == true) {
                        for (var i = 0; i < $("#ddl_Child").val(); i++) {
                            $("#ddl_Child_" + (i + 1)).addClass('highlight_error');
                            flag = false;
                        }
                    }
                    else {
                        var TotalChildAboveFive = 0;
                        var AgeSelected = 0;
                        for (var i = 0; i < $("#ddl_Child").val(); i++) {
                            if ($.trim($("#ddl_Child_" + (i + 1)).val()) == "" || $.trim($("#ddl_Child_" + (i + 1)).val()) == "0") {
                                $("#ddl_Child_" + (i + 1)).addClass('highlight_error');
                                flag = false;
                            }
                            else {
                                $("#ddl_Child_" + (i + 1)).removeClass('highlight_error');
                                $($("#ddl_Child_" + (i + 1)).parent()).removeClass("highlight_error");
                                AgeSelected++;
                                if ($("#ddl_Child_" + (i + 1)).val() <= 5) {
                                    if (TotalChildAboveFive == 0) {
                                        $("#ddl_Child_" + (i + 1)).addClass('highlight_error');
                                        flag = false;
                                    }

                                } else { TotalChildAboveFive++; }

                            }
                        }
                        if (AgeSelected == $("#ddl_Child").val()) {
                            if (TotalChildAboveFive > 0) {
                                flag = true;
                            }
                        }
                        else { flag = false; }

                    }
                }
            }
            else {
                if ($("#ddl_Child").val() > 0) {

                    var TotalChildAboveFive = 0;
                    var AgeSelected = 0;
                    for (var i = 0; i < $("#ddl_Child").val(); i++) {
                        if ($.trim($("#ddl_Child_" + (i + 1)).val()) == "" || $.trim($("#ddl_Child_" + (i + 1)).val()) == "0") {
                            $("#ddl_Child_" + (i + 1)).addClass('highlight_error');
                            flag = false;
                        }
                        else {
                            $("#ddl_Child_" + (i + 1)).removeClass('highlight_error');
                            $($("#ddl_Child_" + (i + 1)).parent()).removeClass("highlight_error");
                        }
                    }
                }
            }

            if ($.trim($("#depDate").val()) == "") {
                $("#depDate").addClass('highlight_error');
                flag = false;
            }
            else {
                $("#depDate").removeClass('highlight_error');
                $($("#depDate").parent()).removeClass("highlight_error");
            }
            if ($('#ContentPlaceHolder_hdnBranchValue').val() == "") {
                if ($.trim($("#ddlBranch").val()) == "0") {
                    $("#ddlBranch").addClass('highlight_error');
                    flag = false;
                }
            }
            else {
                $("#ddlBranch").removeClass('highlight_error');
                $($("#ddlBranch").parent()).removeClass("highlight_error");
            }

            var TotalPassenger = 0;
            if (document.getElementById("ddl_Adult").value != '')
                TotalPassenger = TotalPassenger + parseFloat(document.getElementById("ddl_Adult").value, 0);
            if (document.getElementById("ddl_Youth").value != '')
                TotalPassenger = TotalPassenger + parseFloat(document.getElementById("ddl_Youth").value, 0);
            if (document.getElementById("ddl_Child").value != '')
                TotalPassenger = TotalPassenger + parseFloat(document.getElementById("ddl_Child").value, 0);

            if (TotalPassenger > 9) {
                $("#ddl_Adult").addClass('highlight_error');
                $("#ddl_Youth").addClass('highlight_error');
                $("#ddl_Child").addClass('highlight_error');
                flag = false;
            }

            $('.selectpicker').selectpicker('refresh');
            if (flag == true) {
                if ($('#ContentPlaceHolder_hdnMobileBtn').val() == "1") {
                    $('#openFormDupe').html($('#openForm').html());
                    $.fancybox.close();
                }
                openProgressIndicator();
                $("#ContentPlaceHolder_btnSubmit1").trigger("click");
            }
            return flag;
        }
        function PassFare() {

            var chkTypeOfFare = $('#ContentPlaceHolder_typeOfFare input:radio:checked');
            var chkTypeOfPass = $('#ContentPlaceHolder_typeOfPass input:radio:checked');
            var chkTypeOfPassClass = $('#ContentPlaceHolder_typeOfPassClass input:radio:checked');

            var vTypeOfFare = chkTypeOfFare.attr('id');
            var vTypeOfPass = chkTypeOfPass.attr('id');
            var vTypeOfPassClass = chkTypeOfPassClass.attr('id');
            var vOffer = $('#ContentPlaceHolder_hdnOffer').val();
            $.ajax({
                type: "POST",
                url: "/PassMtEx/Swiss-Travel-Pass.aspx/PassFare",
                data: '{TypeOfFare:"' + vTypeOfFare + '", TypeOfPass:"' + vTypeOfPass + '" ,TypeOfPassClass:"' + vTypeOfPassClass + '",Offer:"' + vOffer + '"}',
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (response) {

                    $('#ContentPlaceHolder_classTabsData').html(response.d);
                    $(".classTabBox").hide();
                    $('#' + vTypeOfPassClass.replace('T', '')).show();
                    var div = document.getElementById(vTypeOfPassClass.replace('T', ''));
                    $(div).find('input:radio').each(function () {

                        if (this.checked)
                            chkSelectedDays = this;
                    });
                    PassFareCal(chkSelectedDays);
                },
                failure: function (response) {
                    $('#ContentPlaceHolder_classTabsData').html("Sorry! we are failed to bind pass fare.");
                }
            })
        }
        function PassFareCal(ids) {

            var days = +3; var vTravelDate = "";//new Date(); vTravelDate.setDate(vTravelDate.getDate() + days);
            var result = $('#hdn' + ids.id).val();
            if ($.trim($('#ContentPlaceHolder_hdnOffer').val() != "")) {
                result = result.replace('\"Offer\":null', '\"Offer\":\"' + $('#ContentPlaceHolder_hdnOffer').val() + '\"');
                //if ($('#ContentPlaceHolder_hdndate').val() == "")
                //    $('#ContentPlaceHolder_hdndate').val(vTravelDate.format('dd MMM yyyy'));
                result = result.replace('\"TravelDate\":null', '\"TravelDate\":\"' + $('#ContentPlaceHolder_hdndate').val() + '\"');
            }

            result = JSON.parse(result);
            result = JSON.stringify({ 'Data': result });
            $.ajax({
                type: "POST",
                url: "/PassMtEx/Swiss-Travel-Pass.aspx/PassFareCal",
                data: result,
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (response) {

                    $('#ContentPlaceHolder_divCalcForm').html(response.d);
                    $('#divInfo').html(decodeURIComponent($('#hdnInfo').val().replace(/\+/g, ' ')));
                    if ($.trim($('#ContentPlaceHolder_hdnOffer').val()) != "") { $('#depDate').val($('#ContentPlaceHolder_hdndate').val()); }

                    if ($('#ContentPlaceHolder_hdnNoOfAdult').val() != "" && $('#ContentPlaceHolder_hdnNoOfAdult').val() != "0") {
                        document.getElementById("ddl_Adult").value = $('#ContentPlaceHolder_hdnNoOfAdult').val();
                    }
                    if ($('#ContentPlaceHolder_hdnNoOfChild').val() != "" && $('#ContentPlaceHolder_hdnNoOfChild').val() != "0") {
                        document.getElementById("ddl_Child").value = $('#ContentPlaceHolder_hdnNoOfChild').val();
                    }
                    if ($('#ContentPlaceHolder_hdnNoOfYouth').val() != "" && $('#ContentPlaceHolder_hdnNoOfYouth').val() != "0") {
                        document.getElementById("ddl_Youth").value = $('#ContentPlaceHolder_hdnNoOfYouth').val();
                    }
                    if ($('#ContentPlaceHolder_hdnNoOfSenior').val() != "" && $('#ContentPlaceHolder_hdnNoOfSenior').val() != "0") {
                        document.getElementById("ddl_Senior").value = $('#ContentPlaceHolder_hdnNoOfSenior').val();
                    }
                    if (document.getElementById("ddl_Child").value > 0) {
                        document.getElementById("ChildrenDetails").style.display = "block";
                    }
                    else { document.getElementById("ChildrenDetails").style.display = "none"; }
                    for (var i = 1; i <= document.getElementById("ddl_Child").value; i++) {
                        document.getElementById("child_" + i).style.display = "block";
                        document.getElementById("ddl_Child_" + i).value = $('#ContentPlaceHolder_hdnChildAge').val().split(',')[i - 1];
                    }
                    document.getElementById("ddlBranch").value = $('#ContentPlaceHolder_hdnBranchValue').val();
                    CalcChild();
                    $('.selectpicker').selectpicker('refresh');
                },
                failure: function (response) {
                    $('#ContentPlaceHolder_divCalcForm').html("Sorry! we are failed to calculate your pass fare.");
                }
            })
        }
        function GetBranchValue() {

            if ($.trim($("#ddlBranch").val()) != '' || $.trim($("#ddlBranch").val()) != '0') {
                $("#ddlBranch").removeClass("highlight_error");
                $($("#ddlBranch").parent()).removeClass("highlight_error");
            }
            $('#ContentPlaceHolder_hdnBranchValue').val(document.getElementById("ddlBranch").value);
        }
        function CalcChild() //Calculate total child
        {
            var child = 0;
            if (document.getElementById("ddl_Child").value != '')
                child = parseFloat(document.getElementById("ddl_Child").value, 0);

            var ChildAge = "";
            for (var i = 0; i < child; i++) {
                if ($.trim($("#ddl_Child_" + (i + 1)).val()) != '' || $.trim($("#ddl_Child_" + (i + 1)).val()) != '0') {
                    $("#ddl_Child_" + (i + 1)).removeClass("highlight_error");
                    $($("#ddl_Child_" + (i + 1)).parent()).removeClass("highlight_error");
                }
                ChildAge += parseFloat(document.getElementById("ddl_Child_" + (i + 1)).value, 0) + ",";
            }

            document.getElementById("ContentPlaceHolder_hdnChildAge").value = ChildAge;
            CalcAmount();
        }
        function CalcAmount() //Calculate price (Adult + Child)
        {

            var TotalChild = 0;
            var adult = 0; child = 0; youth = 0; senior = 0; var FamilyCard = ""; var FamilyCardChildVal = "";
            if (document.getElementById("ddl_Adult") != null) {
                if (document.getElementById("ddl_Adult").value != '')
                    adult = parseFloat(document.getElementById("ddl_Adult").value, 0);
            }
            if (document.getElementById("ddl_Child") != null) {
                if (document.getElementById("ddl_Child").value != '')
                    child = parseFloat(document.getElementById("ddl_Child").value, 0);

                for (var i = 0; i < child; i++) {
                    if (parseFloat(document.getElementById("ddl_Child_" + (i + 1)).value, 0) >= 6) {
                        if (document.getElementById("chk_Child").checked == false) {
                            TotalChild = parseFloat(TotalChild, 0) + 1;
                        }
                    }
                }
            }
            document.getElementById("ContentPlaceHolder_hdnChkChild").value = document.getElementById("chk_Child").checked;

            if (document.getElementById("ddl_Youth") != null) {
                if (document.getElementById("ddl_Youth").value != '')
                    youth = parseFloat(document.getElementById("ddl_Youth").value, 0);
            }
            if (document.getElementById("ddl_Senior") != null) {
                if (document.getElementById("ddl_Senior").value != '')
                    senior = parseFloat(document.getElementById("ddl_Senior").value, 0);
            }
            var AdultAmount = 0; ChildAmount = 0; YouthAmount = 0; SeniorAmount = 0;
            if (adult > 0)
                AdultAmount = (adult * parseFloat(document.getElementById("hdnAdultSellAmount").value, 0));
            if (TotalChild > 0)
                ChildAmount = (TotalChild * parseFloat(document.getElementById("hdnChildSellAmount").value, 0));
            if (youth > 0)
                YouthAmount = (youth * parseFloat(document.getElementById("hdnYouthSellAmount").value, 0));
            if (senior > 0)
                SeniorAmount = (senior * parseFloat(document.getElementById("hdnSeniorSellAmount").value, 0));

            var Amount = (parseFloat(AdultAmount, 0) + parseFloat(ChildAmount, 0) + parseFloat(YouthAmount, 0) + parseFloat(SeniorAmount, 0));

            document.getElementById("ContentPlaceHolder_hdnNoOfAdult").value = adult;
            document.getElementById("ContentPlaceHolder_hdnNoOfChild").value = parseFloat(document.getElementById("ddl_Child").value, 0);
            document.getElementById("ContentPlaceHolder_hdnNoOfYouth").value = youth;
            document.getElementById("ContentPlaceHolder_hdnNoOfSenior").value = senior;

            var ChildAge = "";
            for (var i = 0; i < document.getElementById("ContentPlaceHolder_hdnNoOfChild").value; i++) {
                ChildAge += parseFloat(document.getElementById("ddl_Child_" + (i + 1)).value, 0) + ",";
            }

            document.getElementById("ContentPlaceHolder_hdnChildAge").value = ChildAge;
            var BookingFee = 5; // EUR;
            var TotalBookingFee = 0;
            var ROE = parseFloat(document.getElementById("hdnTFROE").value, 2).toFixed(2);
            var TotalPassengers = adult + TotalChild + youth + senior;
            if (TotalPassengers < 5) {
                if (TotalPassengers == 1)
                    BookingFee = 5;
                else if (TotalPassengers == 2)
                    BookingFee = 2.5;
                else if (TotalPassengers > 2 && TotalPassengers < 5)
                    BookingFee = 2;
                BookingFee = BookingFee * ROE;
                TotalBookingFee = parseFloat(BookingFee * TotalPassengers, 0);
            }
            else {
                BookingFee = 8;
                TotalBookingFee = BookingFee = parseFloat(BookingFee * ROE);
            }
            Amount = Math.round(parseFloat(Amount, 0) + Math.round(parseFloat(TotalBookingFee, 0)));

            var htmlSummary = "";
            htmlSummary = "<table>";
            if (adult > 0) {
                htmlSummary += "<tr>";
                htmlSummary += "<td>Adult</td>";
                htmlSummary += "<td class=\"quantity\">" + adult + "</td>";
                htmlSummary += "<td>" + document.getElementById("hdnSellCurrency").value + " " + document.getElementById("hdnAdultSellAmount").value + "</td>";
                htmlSummary += "<td>" + document.getElementById("hdnSellCurrency").value + " " + AdultAmount + "</td>";
                htmlSummary += "</tr>";
            }
            if (youth > 0) {
                htmlSummary += "<tr>";
                htmlSummary += "<td>Youth</td>";
                htmlSummary += "<td class=\"quantity\">" + youth + "</td>";
                htmlSummary += "<td>" + document.getElementById("hdnSellCurrency").value + " " + document.getElementById("hdnYouthSellAmount").value + "</td>";
                htmlSummary += "<td>" + document.getElementById("hdnSellCurrency").value + " " + YouthAmount + "</td>";
                htmlSummary += "</tr>";
            }

            if (parseFloat(document.getElementById("ddl_Child").value, 0) > 0) {
                if (TotalChild > 0) {
                    htmlSummary += "<tr>";
                    htmlSummary += "<td>Child</td>";
                    htmlSummary += "<td class=\"quantity\">" + TotalChild + "</td>";
                    htmlSummary += "<td>" + document.getElementById("hdnSellCurrency").value + " " + document.getElementById("hdnChildSellAmount").value + "</td>";
                    htmlSummary += "<td>" + document.getElementById("hdnSellCurrency").value + " " + ChildAmount + "</td>";
                    htmlSummary += "</tr>";
                }
                var FreeChild = parseFloat(document.getElementById("ddl_Child").value, 0) - TotalChild;
                if (FreeChild > 0) {
                    htmlSummary += "<tr>";
                    htmlSummary += "<td>Child</td>";
                    htmlSummary += "<td class=\"quantity\">" + FreeChild + "</td>";
                    htmlSummary += "<td>Free</td>";
                    htmlSummary += "<td>Free</td>";
                    htmlSummary += "</tr>";
                }
            }


            htmlSummary += "<tr>";
            htmlSummary += "<td>Transaction Fee</td>";
            if (TotalPassengers < 5)
                htmlSummary += "<td class=\"quantity\">" + TotalPassengers + "</td>";
            else
                htmlSummary += "<td></td>";
            htmlSummary += "<td>" + document.getElementById("hdnSellCurrency").value + " " + BookingFee.toFixed(0) + "</td>";
            htmlSummary += "<td>" + document.getElementById("hdnSellCurrency").value + " " + Math.round(TotalBookingFee).toFixed(0) + "</td>";
            htmlSummary += "</tr>";


            var MtOfferData = [];
            var MtTotalAmountAdt = 0;
            var MtTotalAmountChd = 0;
            var DiscountAmount = 0;
            var OfferName = "Promo";
            $('#ContentPlaceHolder_hdnOfferDiscount').val("0");
            if ($.trim($('#ContentPlaceHolder_hdnOffer').val()) != "") {
                if (JSON.parse(localStorage.getItem("MtOfferData")) != null) {

                    MtOfferData = JSON.parse(localStorage.getItem("MtOfferData"));
                    $.each(MtOfferData, function (i, item) {
                        if (DiscountAmount == 0) {
                            DiscountAmount = parseFloat(item.OfferAmount, 0);
                            OfferName += " (" + item.OfferName + " p.p.)";
                        }
                        if ((adult + youth) > 0 && (item.TariffType).toLowerCase().indexOf("chd") < 0) {
                            htmlSummary += "<tr>";
                            htmlSummary += "<td>" + item.ExcursionName + "</td>";
                            htmlSummary += "<td class=\"quantity\">" + (adult + youth) + "</td>";
                            htmlSummary += "<td>" + item.CnvtCurrency + " " + item.Rate + "</td>";
                            htmlSummary += "<td>" + item.CnvtCurrency + " " + (item.Rate * (adult + youth)) + "</td>";
                            htmlSummary += "</tr>";
                            MtTotalAmountAdt += (item.Rate * (adult + youth));
                        }
                        if (child > 0 && (item.TariffType).toLowerCase().indexOf("chd") >= 0) {
                            MtTotalAmountChd = 0;
                            for (var i = 0; i < child; i++) {
                                if (document.getElementById("chk_Child").checked == true) {
                                    var selectedChdAge = parseFloat(document.getElementById("ddl_Child_" + (i + 1)).value, 0);
                                    if (selectedChdAge > 0) {
                                        if ($.trim(item.TariffType.toLowerCase().replace('chd', '')).length > 0) {
                                            var chdAge = ($.trim(item.TariffType.toLowerCase().replace('chd', '')).indexOf('/') >= 0 ? $.trim(item.TariffType.toLowerCase().replace('chd', '')).split('/') : $.trim(item.TariffType.toLowerCase().replace('chd', '')).split('-'));
                                            chdAge[0] = chdAge[0].toLowerCase() == "u" ? "0" : chdAge[0];
                                            if (parseFloat(chdAge[0]) <= selectedChdAge && parseFloat(chdAge[1]) >= selectedChdAge) {
                                                htmlSummary += "<tr>";
                                                htmlSummary += "<td title='" + $("#ddl_Child_" + (i + 1) + " option:selected").text() + "'>" + item.ExcursionName + "</td>";
                                                htmlSummary += "<td class=\"quantity\">1</td>";
                                                htmlSummary += "<td>" + item.CnvtCurrency + " " + item.Rate + "</td>";
                                                htmlSummary += "<td>" + item.CnvtCurrency + " " + (item.Rate * 1) + "</td>";
                                                htmlSummary += "</tr>";
                                                MtTotalAmountChd += (parseFloat(item.Rate) * 1);
                                            }
                                        }

                                    }
                                }
                            }
                            MtTotalAmountAdt += MtTotalAmountChd;
                        }
                    });
                    Amount = parseFloat(Amount, 0) + parseFloat(MtTotalAmountAdt, 0);
                }
            }
            if (DiscountAmount > 0) {
                DiscountAmount = parseFloat(DiscountAmount, 0) * (adult + youth);
                $('#ContentPlaceHolder_hdnOfferDiscount').val(DiscountAmount);
                htmlSummary += "<tr class='red_txt'>";
                htmlSummary += "<td>" + OfferName + "</td>";
                htmlSummary += "<td colspan='2'><strong style='color:green;font-size:11px'>Applied&nbsp;&nbsp;<a href='javascript:;' onclick='javascript:DeleteOffer(); return false;' class='red_txt' style='font-size:10px;font-weight:700'>(REMOVE)</a></strong></td>";
                htmlSummary += "<td>-&nbsp;" + document.getElementById("hdnSellCurrency").value + "&nbsp;" + DiscountAmount + "</td>";
                htmlSummary += "</tr>";
                Amount = parseFloat(Amount, 0) - parseFloat(DiscountAmount, 0);
            }
            htmlSummary += "</table>";

            document.getElementById("divSummary").innerHTML = htmlSummary;



            var flag = 1;
            document.getElementById("lblAmount").innerHTML = Amount;

            document.getElementById("lblGrandTotal").innerHTML = Amount;

            return false;
        }
        function DivSelection(offer) {

            if (offer != "")
                if (offer.split('|').length > 1) {
                    $('#ContentPlaceHolder_hdndate').val(''); 
                    $('#ContentPlaceHolder_hdnNoOfAdult').val('2');
                }

            $('#ContentPlaceHolder_hdnOffer').val(offer);
            PassFare();
            $('html,body').animate({ scrollTop: $('#selectPass').offset().top + 50 });
        }
        function DeleteOffer() {

            $('#ContentPlaceHolder_hdnOffer').val('');
            $('#ContentPlaceHolder_hdndate').val('');
            PassFare();
            $('html,body').animate({ scrollTop: $('#selectPass').offset().top + 50 });
        }
        function DivDateChangeForOffer() {

            var chkTypeOfPassClass = $('#ContentPlaceHolder_typeOfPassClass input:radio:checked');
            var vTypeOfPassClass = chkTypeOfPassClass.attr('id');
            var div = document.getElementById(vTypeOfPassClass.replace('T', ''));
            $(div).find('input:radio').each(function () {

                if (this.checked)
                    chkSelectedDays = this;
            });
            PassFareCal(chkSelectedDays);
        }
    </script>
    <button style="display: none;" onclick="downloadAll('https://statics-sandbox.era.raileurope.com/2fd186da-61a4-4be9-a833-923364274e02/aa19e20c-c5ff-4092-8198-0b5376dd3fa3/Pass-1-173819481.pdf#https://statics-sandbox.era.raileurope.com/2fd186da-61a4-4be9-a833-923364274e02/aa19e20c-c5ff-4092-8198-0b5376dd3fa3/Pass-2-173819482.pdf#https://statics-sandbox.era.raileurope.com/2fd186da-61a4-4be9-a833-923364274e02/aa19e20c-c5ff-4092-8198-0b5376dd3fa3/Pass-3-173819483.pdf')">Test me!</button>
    <div class="row">
        <div class="container-fluid nstpBannerSection" style="padding: 0;">

            <div class="nstpBanner" style="background-image: url(../images/stp/stp_banner.jpg);">
                <div class="titleBox white_txt">
                    <h1 class="text-uppercase" runat="server" id="txtPassName">Swiss Travel Pass</h1>
                    <h2 class="tag noneIMP">Authorized Seller of Swiss Travel Pass</h2>
                </div>
                <div class="imgDscpText">Bernina Express at the circle viaduct of Brusio.</div>
                <img src="../images/ST_PromoJul_DiscountLabel.png" class="Hero_PromoLabel noneIMP" />
            </div>
        </div>

        <div class="container-fluid nstpJump">
            <div class="nstpFixAnchor" id="sticky-anchor"></div>
            <div class="fix_on_scroll nstpFixed" id="scrollSpy">
                <ul class="nav spyList">
                    <li><a href="#selectPass">Select Pass</a></li>
                    <li><a href="#aboutPass">Overview</a></li>
                    <li><a href="#comboOffers">Combo Offers<strong class="menuNewtag">NEW</strong></a></li>
                    <li><a href="#benefits">Benefits</a></li>
                    <li><a href="#howitsWorks">How It Works</a></li>
                    <li><a href="#faqs">FAQs</a></li>
                </ul>
                <button type="button" class="spyListBtn"><i class="fa fa-angle-down"></i></button>
            </div>
        </div>

        <div class="highlightsSection">
            <ul class="nstpHighlights">
                <li><i class="fa fa-ticket red_txt" style="font-size: 16px"></i>E-Swiss Travel Pass</li>
                <li><i class="fa fa-check-square-o red_txt"></i>Choose from 3, 4, 8, and 15 days pass</li>
                <%--<li><i class="fa fa-percent red_txt" style="font-size: 13px"></i>Enjoy discount up to ₹1,000</li>--%>
                <li id="liStartPrice" runat="server"></li>
                <li><i class="fa fa-child red_txt"></i>Children travel free</li>
                <li><i class="fa fa-picture-o red_txt"></i>Up to 50% off on mountain excursions</li>
            </ul>
        </div>

        <div class="container-fluid maxwidth selectpassSection">

            <div class="title" style="text-transform: none;">
                <div class="container-fluid fixanchor" id="selectPass"></div>
                <h2 class="text-center">Book e-Swiss Travel Pass</h2>
            </div>

            <div class="selectpassContainer" data-sticky_parent>

                <div class="selectionArea">

                    <div class="row passtypeSelection">
                        <div class="col-xs-12 noneIMP">
                            Select Pass
                                    <div class="form-group passSelection">
                                        <asp:DropDownList ID="ddlPassFamily" CssClass="form-control selectpicker" runat="server" DataTextField="FamilyName" DataValueField="FamilyId" title="Explore Other Passes" OnSelectedIndexChanged="ddlPassFamily_SelectedIndexChanged" AutoPostBack="true"></asp:DropDownList>

                                    </div>
                        </div>
                        <div class="col-xs-12" id="typeOfFare" runat="server">
                        </div>
                        <div class="col-xs-12" id="typeOfPass" runat="server">
                        </div>
                        <div class="col-xs-12" id="typeOfPassClass" runat="server">
                        </div>
                    </div>

                    <div class="classTabsData" id="classTabsData" runat="server">
                    </div>

                    <button type="button" class="cta_red cta btn nstpbookBtn_mobile">Book Now</button>

                    <div class="clearfix"></div>
                </div>

                <%--<asp:UpdatePanel ID="updatepnl" runat="server">
                    <ContentTemplate>--%>
                <div class="selectionForm">
                    <div id="openFormDupe"></div>
                    <div class="nstpFormContainer fade_anim" id="openForm" data-sticky_column>
                        <div id="divCalcForm" runat="server">
                        </div>
                        <div class="row">
                            <div class="col-xs-12 text-center">
                                <a id="btnSubmit" class="cta_red cta btn" onclick="javascript:return Validation();">BOOK NOW</a>
                                <%--<asp:Button ID="btnSubmit" runat="server" Text="BOOK NOW" OnClientClick="javascript:return Validation();" OnClick="btnSubmit_Click" class="cta_red cta btn" />--%>
                            </div>
                        </div>

                    </div>
                </div>

            </div>
            <%-- </ContentTemplate>
                </asp:UpdatePanel>--%>

            <div class="clearfix"></div>
            <div class="stickyselect_Btn" id="stickyselectBtn"></div>
        </div>
        <asp:Button ID="btnSubmit1" runat="server" Text="BOOK NOW" OnClick="btnSubmit_Click" class="cta_red cta btn noneIMP" />
        <div class="container-fluid nstOffers" id="divComboOffers">
            <a id="aComboOffer" data-fancybox data-options='{"touch":false}' data-src="#aComboOfferTCapply" href="javascript:;" class="fancy_inline_display"></a>
            <div style="display: none" id="aComboOfferTCapply">
                <img src="/images/chf-30-offswiss-pass-promo-popup.jpg" alt="chf 30 off swiss pass combo offer" class="img-responsive" />
            </div>
            <div class="container-fluid maxwidth">
                <div class="title">
                    <div class="container-fluid fixanchor" id="comboOffers"></div>
                    <h2 class="text-center">Exclusive Combo Offers</h2>
                </div>
                <!-- <h3 class="text-center red_txt" style="font-size:16px;margin-top:-10px;"><strong>Experience More. Save More.</strong></h3> -->

                <div class="row">
                    <div class="slider_D3 sliderScroll">
                        <div>
                            <a href="javascript:;" class="excOffer" onclick="javascript:DivSelection('1|20'); return false;">
                                <div class="packImg">
                                    <img data-lazy="/images/Mountain/Jungfrau-Top-of-Europe-medium.jpg" alt="Save CHF 20" />
                                </div>
                                <div class="packOffer"><strong><small>Save</small> CHF 20</strong></div>
                                <div class="packHighlight">
                                    <div class="bestSeller"><i class="fa fa-star" aria-hidden="true"></i>Bestseller</div>
                                </div>
                                <div class="packContent">
                                    <h2 class="packTitle black_txt"><span class="tag">Combo Offer</span><br />
                                        Swiss Travel Pass + Jungfrau</h2>
                                    <p>Last date of purchase : 27<sup>th</sup> Oct 2021</p>
                                </div>
                                <div class="packfooter"></div>
                            </a>
                        </div>

                        <div>
                            <a href="javascript:;" class="excOffer" onclick="javascript:DivSelection('1,2|30'); return false;">
                                <div class="packImg">
                                    <img data-lazy="/images/Mountain/Harder-Kulm-medium.jpg" alt="Save CHF 30" />
                                </div>
                                <div class="packOffer"><strong><small>Save</small> CHF 30</strong></div>
                                <div class="packHighlight hide">
                                    <div class="bestSeller"><i class="fa fa-star" aria-hidden="true"></i>Bestseller</div>
                                </div>
                                <div class="packContent">
                                    <h2 class="packTitle black_txt"><span class="tag">Combo Offer</span><br />
                                        Swiss Travel Pass + Jungfrau + Harder Kulm</h2>
                                    <p>Last date of purchase : 27<sup>th</sup> Oct 2021</p>
                                </div>
                                <div class="packfooter"></div>
                            </a>
                        </div>

                    </div>
                </div>

                <div class="row hide">
                    <div class="nstofferSlider">
                        <div class="col-md-4">
                            <div class="nstOfferItem">
                                <div class="noiImg fade_anim" style="background-image: url(/images/stp/combooffer_1.jpg)"></div>
                                <div class="noiDetails">
                                    <h3>SAVE CHF 20</h3>
                                    <p class="equate">Swiss Travel Pass + Jungfrau + Titlis + jetboat</p>
                                    <button type="button" class="btn cta cta_red fade_anim">Book Now</button>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="nstOfferItem">
                                <div class="noiImg fade_anim" style="background-image: url(/images/stp/combooffer_2.jpg)"></div>
                                <div class="noiDetails">
                                    <h3>SAVE CHF 20</h3>
                                    <p class="equate">8 Days 2nd Class Continuous Swiss Travel Pass + Jungfrau + Titlis + Matterhorn</p>
                                    <button type="button" class="btn cta cta_red fade_anim">Book Now</button>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="nstOfferItem">
                                <div class="noiImg fade_anim" style="background-image: url(/images/stp/combooffer_3.jpg)"></div>
                                <div class="noiDetails">
                                    <h3>SAVE CHF 20</h3>
                                    <p class="equate">15 Days 2nd Class Continuous Swiss Travel Pass + Jungfrau + Titlis + Matterhorn + Glacier 3000</p>
                                    <button type="button" class="btn cta cta_red fade_anim">Book Now</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>

        <div class="container rounded st21_PromoBannerJul-BG noneIMP">
            <div class="maxWidth mx-auto">
                <div class="row m-auto st21_PromoBannerJul-container">
                    <h3>Get your all-in-one ticket</h3>
                    <h5>Tour the country at a bargain like never before – with your Swiss Travel Pass.</h5>
                    <a data-fancybox data-options='{"touch":false}' data-src="#aSwissPassTCapply" href="javascript:;" class="fancy_inline_display">Offer Conditions</a>
                    <div style="display: none" id="aSwissPassTCapply">
                        <%if (countrycode == "IN")
                            { %>
                        <img src="/images/swiss-pass-promo-popup.jpg" alt="swiss pass 25% off" class="img-responsive" />
                        <% }
                            else
                            { %>
                        <img src="/images/swiss-pass-promo-popup-other.jpg" alt="swiss pass 25% off" class="img-responsive" />
                        <%} %>
                    </div>
                    <style>
                        .fancybox-close-small {
                            color: white !important;
                        }
                    </style>
                    <img class="promoLabel" src="../images/ST_PromoJul_DiscountLabel.png" alt="July Sale 25% Discount" />
                </div>
            </div>
        </div>

        <div class="container-fluid maxwidth nstpAbout">
            <div class="title text-center">
                <div class="container-fluid fixanchor" id="aboutPass"></div>
                <h2>About Swiss Travel Pass </h2>
            </div>
            <div class="aboutInfo text-center">
                <div id="aboutInfo" runat="server">
                </div>
                <div class="nstp_aboutBox text-left">
                    <div id="divExcursionPoints" runat="server"></div>
                    <!-- XXXXXXXXXXXXXXXXXXXXx -->
                    <span class='morelink text-center' style='background: #ffffff !important;'><a class='more' style='display: inline;'>Read more</a></span>
                </div>

            </div>
        </div>

        <div class="container-fluid maxwidth">
            <div class="benefitsSection" style="background-image: url(../images/stp/benefitsBG.jpg)">
                <div class="title text-center">
                    <div class="container-fluid fixanchor" id="benefits"></div>
                    <h2 class="white_txt">Why To Buy Swiss Travel Pass</h2>
                </div>
                <div class="benefitsTable">
                    <div class="btLeft">
                        <strong>Unlimited</strong> Access.<br>
                        <strong>Unforgettable</strong> Experiences.
                    </div>
                    <div class="btRight">
                        <ul>
                            <li>Unlimited Access to Rail, Boat, and Bus in 90+ Towns and Cities</li>
                            <li>Free Entry at 500+ Museums</li>
                            <li>Up to 50% Discount on Many Mountain Excursions and Rail Travel</li>
                            <li>Children Entry Free</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>

        <div class="container-fluid maxwidth howworkSection">
            <div class="title">
                <div class="container-fluid fixanchor" id="howitsWorks"></div>
                <h2 class="text-center">How It Works</h2>
            </div>


            <div class="text-center hwTable">

                <div>
                    <div class="hwItem">
                        <img src="../images/stp/hw_ic_1.png" title="Select Your Swiss Travel Pass">
                        <h2>Select Your Swiss Travel Pass</h2>
                        <p>Choose the right Swiss Travel Pass that suits your requirements in terms of number of days, and class of travel.</p>
                    </div>
                </div>

                <div>
                    <div class="hwItem">
                        <img src="../images/stp/hw_ic_2.png" title="Confirmation">
                        <h2>Confirmation</h2>
                        <p>Follow the step-by-step booking procedure which allows you to view rates, select total number of passengers and see your total amount payable before you make the final booking.</p>
                    </div>
                </div>

                <div>
                    <div class="hwItem">
                        <img src="../images/stp/hw_ic_3.png" title="Make the Payment">
                        <h2>Make the Payment</h2>
                        <p>After selection of the pass and submission of your details (name, date of birth, email id etc.) you will be directed to the 3D secured payment page where you can make payment by Debit/ Credit Card/ Net Banking/ UPI.</p>
                    </div>
                </div>

                <div>
                    <div class="hwItem">
                        <img src="../images/stp/hw_ic_4.png" title="Time to Travel like a Swiss">
                        <h2>Time to Travel like a Swiss</h2>
                        <p>Once you have made the payment, you will immediately receive a confirmation email from us. You can download your e-Swiss Travel Pass from your email (a download link will be in the email).</p>
                    </div>
                </div>

            </div>

            <div class="container-fluid text-center">
                <p>* If you need assistance in selecting the right Swiss Travel Pass for you, please contact us.</p>
                <p>* If you are travelling to multiple countries in Europe, you can also book rail passes of other countries with us.</p>
                <div class="otherpassLinks">
                    <%--<a href="/PassMtEx/Rail-Pass.aspx?FamilyId=100029&cntry=<%=countrycode %>" class="red_txt" style="display: inline-block;"><strong>Global Eurail Pass</strong></a> <span style="margin: 0 15px;">|</span>--%>
                    <a href="/european-rail-tickets" class="red_txt" style="display: inline-block;"><strong>European Rail Tickets</strong></a>
                </div>

            </div>
        </div>

        <div class="container-fluid maxwidth faqSection">

            <div class="title">
                <div class="container-fluid fixanchor" id="faqs"></div>
                <h2 class="text-center">FAQs on Swiss Travel Pass</h2>
            </div>

            <div style="max-width: 1000px; margin: 0 auto 30px; float: none;">
                <ul class="faq_set">

                    <li>
                        <div class="expandhead question">What is a Swiss Travel Pass? </div>
                        <div class="expandbox answer">
                            <p>A Swiss Travel Pass is a pass that allows you to access unlimited travel on a train, bus, boat, and tram across Switzerland’s public transport and provides up to 50% discounts on excursions.</p>
                        </div>
                    </li>

                    <li>
                        <div class="expandhead question">Where can I use my Swiss Travel Pass?  </div>
                        <div class="expandbox answer">
                            <%--<p>You can use your Swiss Travel Pass in the whole Swiss Travel System: in all trains, Post buses, ships, buses and even trams.</p>--%>
                            <p>You can use your Swiss Travel Pass in the whole Swiss Travel System : in all trains, post buses, trams & even boats.</p>
                        </div>
                    </li>

                    <li>
                        <div class="expandhead question">How do I book the Swiss Travel Pass online with Swisstours? </div>
                        <div class="expandbox answer">
                            <ul>
                                <li>Book your pass on www.swisstours.com by clicking on the Swiss Travel Pass tab on the home page. </li>
                                <li>From the list of passes, select the Swiss Travel Pass that suits your travel requirements in terms of the number of days, 1st or 2nd class and consecutive or Flexi days’ pass.</li>
                                <li>If you need help selecting the most appropriate pass, contact our specialists at <a href="mailto:contact@swisstours.com">contact@swisstours.com </a></li>
                                <li>After selection of the pass and submission of your details (name, passport number, date of travel, and other mandatory information) you will be directed to the payment page to the make payment.</li>
                                <li>Once the payment is complete, you will immediately receive an e-Swiss Travel Pass voucher in your email as an attachment. </li>
                            </ul>
                        </div>
                    </li>

                    <li>
                        <div class="expandhead question">How can I validate my Swiss Travel Pass?  </div>
                        <div class="expandbox answer">
                            <p>Effective 1st September 2015, the Swiss Travel Pass is a pre validated &amp; closed dated pass.</p>
                            <p>The traveller will need to provide their first day of use of the pass while making the booking. This date will be printed on the pass.</p>
                            <p>Travellers must carry a valid passport in order to travel with this rail pass.</p>
                        </div>
                    </li>

                    <li>
                        <div class="expandhead question">What is an adult pass?   </div>
                        <div class="expandbox answer">
                            <p>A person aged above 26 years has to purchase an adult Swiss Travel Pass.</p>
                        </div>
                    </li>

                    <li>
                        <div class="expandhead question">What is a youth pass? </div>
                        <div class="expandbox answer">
                            <p>A person aged between 16-25 years can purchase a youth Swiss Travel Pass.</p>
                        </div>
                    </li>

                    <li>
                        <div class="expandhead question">Are there family passes? </div>
                        <div class="expandbox answer">
                            <p>The Swiss travel system offers the Swiss family card. This card provides free travel for children under 16 years when travelling with atleast one parent.</p>
                        </div>
                    </li>

                    <li>
                        <div class="expandhead question">What is the difference between a Consecutive-day pass and a Flexi pass?  </div>
                        <div class="expandbox answer">
                            <p>A consecutive-day pass provides unlimited rail travel on all days for the chosen duration of the pass. This pass is preferred by those who wish to travel every day during their stay in Switzerland. A flexi pass is valid for a specific number of days which can be used consecutively or non-consecutively within a longer period. This pass is preferred by those who wish to travel only on certain days during their stay in Switzerland.</p>
                        </div>
                    </li>

                    <li>
                        <div class="expandhead question">Till what age can children travel free on the Swiss transport system? </div>

                        <div class="expandbox answer">
                            <p>Children under 16 years of age accompanied by at least one parent can travel free on the Swiss travel system. Children travelling without parents can still avail of a 50% discount on the Swiss travel pass.</p>
                        </div>
                    </li>

                    <li>
                        <div class="expandhead question">Is reservation on trains compulsory if I have a Swiss Travel Pass?  </div>
                        <div class="expandbox answer">
                            <p>Swiss Travel Pass is valid on trains operated by SBB (Schweizerische BundesBahn), the national railway company of Switzerland. For domestic trains operated in Switzerland, seat reservations are not required. Exceptions are the special scenic trains such as Bernina Express, Glacier Express, Golden Pass and Wilhelm Tell Express. For these trains, a supplement and/or seat reservation is required for Swiss Travel Pass holders.</p>
                        </div>
                    </li>

                    <li>
                        <div class="expandhead question">What is the cancellation charge if I am unable to use my Swiss Travel Pass?  </div>
                        <div class="expandbox answer">
                            <ul>
                                <% if (countrycode == "IN")
                                    { %>
                                <li>Once the pass has been cancelled the passenger will not be able to use it.</li>
                                <li>After the first day of validity, a 15% penalty applies to completely unused passes.</li>
                                <li>If the passenger is already in Switzerland then the pass must be stamped as unused prior to the first day of validity and then returned to the point of purchase.</li>
                                <%}
                                    else
                                    { %>
                                <li>The swiss pass can be cancelled free of charge until 2 working days (Mon-Fri) prior to the 1st date of validity. After that, a 15% penalty applies to completely unused passes.</li>
                                <li>Once the pass has been cancelled the passenger will not be able to use it.</li>
                                <%} %>
                            </ul>

                        </div>
                    </li>

                    <li>
                        <div class="expandhead question">Can Mountain excursions be bought along with the Swiss Travel Pass? </div>
                        <div class="expandbox answer">
                            <p>Yes, you can surely buy the mountain excursions online with the Swiss Travel Pass and benefit from upto 50% discounted rates. Once you have purchased your Swiss Travel Pass you can add the desired mountain excursions to your shopping cart and pay for all services at one go.</p>
                        </div>
                    </li>

                </ul>

                <div class="clearfix"></div>
            </div>
        </div>

        <div class="container-fluid section_Container" id="divMountain" runat="server" visible="false">
            <div class="maxwidth">

                <div class="title text-center">
                    <h2>You May Also Like</h2>
                </div>

                <div class="slider_D4 sliderScroll">

                    <asp:Repeater ID="rptMountain" runat="server">
                        <ItemTemplate>
                            <div>
                                <a href='\<%#DataBinder.Eval(Container.DataItem, "Path")%>' class="packBox showPerRate">
                                    <div class="packImg">
                                        <img alt='<%#Convert.ToString(DataBinder.Eval(Container.DataItem,"imgALT"))%>' data-lazy='<%#"/Images/Mountain/"+Convert.ToString(DataBinder.Eval(Container.DataItem,"MainImage")).Replace(".","-medium.")%>' />
                                    </div>
                                    <div class='<%#Convert.ToString(DataBinder.Eval(Container.DataItem,"SSOffer"))=="True"?"packOffer":"noneIMP"%>'><strong><%#Convert.ToString(DataBinder.Eval(Container.DataItem,"SSOfferText"))%></strong></div>
                                    <div class="packHighlight">
                                        <div class='<%#Convert.ToString(DataBinder.Eval(Container.DataItem,"IsSnow"))=="True"?"packSnow":"noneIMP"%>'>100% Snow Guaranteed</div>
                                    </div>
                                    <div class="packContent">
                                        <div class="packHead">
                                            <div class="packheadLeft">
                                                <div class="packDuration"><i class="fa fa-map-marker red_txt"></i>&nbsp;<%#DataBinder.Eval(Container.DataItem, "ExcursionCity")%></div>
                                                <%--<div class="packDuration"><%#DataBinder.Eval(Container.DataItem, "ExcursionCity")%></div>--%>
                                            </div>
                                        </div>
                                        <h3 class="packTitle black_txt"><%#DataBinder.Eval(Container.DataItem,"ExcursionName")%></h3>
                                        <p><%#DataBinder.Eval(Container.DataItem,"shortDescription")%></p>
                                    </div>
                                    <div class="packfooter">
                                        <div class='<%#Convert.ToInt64(DataBinder.Eval(Container.DataItem,"MinRateFUF"))>0 && Convert.ToInt64(DataBinder.Eval(Container.DataItem,"MinRateSWP"))>0?"strikePrice":"noneIMP"%>'><s><%#Convert.ToString(DataBinder.Eval(Container.DataItem,"Currency"))+" "+Convert.ToString(DataBinder.Eval(Container.DataItem,"MinRateFUF"))%></s></div>
                                        <div class="packPrice"><%#Convert.ToString(DataBinder.Eval(Container.DataItem,"Currency"))+" "+Convert.ToString(Convert.ToInt64(DataBinder.Eval(Container.DataItem,"MinRateSWP"))>0?Convert.ToInt64(DataBinder.Eval(Container.DataItem,"MinRateSWP")):Convert.ToInt64(DataBinder.Eval(Container.DataItem,"MinRateFUF")))%></div>
                                    </div>
                                </a>
                            </div>
                        </ItemTemplate>
                    </asp:Repeater>

                </div>

            </div>
        </div>

        <div class="container-fluid blogSection noneIMP">
            <div class="maxwidth">
                <div class="title">
                    <h2 class="text-center">Blogs</h2>
                </div>

                <div class="bloglistContainer" id="divBlogs" runat="server">
                </div>

                <p class="text-center" style="font-size: 16px"><a href="/blog?cntry=<%=countrycode %>" class="red_txt text-underline"><strong><u>Read all blogs</u></strong></a></p>

            </div>
        </div>

        <a id="aSwissPass" data-fancybox data-type="ajax" data-src="/PassMtEx/swiss-pass-promo.html" href="javascript:;" data-options='{"touch":false}' style="color: #cc0000; text-decoration: underline; display: none;"></a>

        <div class="fixSelectPassBtn fade_anim">
            <button type="button" class="btnbookpass" id="SelectPassBtn"><strong>Book Your Pass</strong></button>
        </div>

        <!-- xxxxxx  Privacy Policy  xxxxxx -->
        <%--<div class="modal fade" id="privacy_policy" tabindex="-1" role="dialog" style="z-index: 10001" aria-hidden="true">
            <div class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable" role="document">
                <div class="modal-content">
                    <div class="modal-header modalTitle">
                        <h5 class="modal-title">Privacy Policy</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <ul>
                            <li>25% discount on all Swiss Travel Passes.</li>
                            <li>Offer valid from 1st to 31st July.</li>
                            <li>Valid for travel within 11 months from the date of purchase.</li>
                            <li>Free cancellation possible until 1 day prior to the pass validity.</li>
                        </ul>

                    </div>
                </div>
            </div>
        </div>--%>
        <div class="clearfix"></div>
    </div>



    <asp:HiddenField ID="hdnMobileBtn" runat="server" Value="" />
    <asp:HiddenField ID="hdnTypeOfFare" runat="server" Value="" />
    <asp:HiddenField ID="hdnTypeOfPass" runat="server" Value="" />
    <asp:HiddenField ID="hdnTypeOfPassClass" runat="server" Value="" />
    <asp:HiddenField ID="hdnNoOfAdult" runat="server" Value="" />
    <asp:HiddenField ID="hdnNoOfYouth" runat="server" Value="" />
    <asp:HiddenField ID="hdnNoOfSenior" runat="server" Value="" />
    <asp:HiddenField ID="hdnNoOfChild" runat="server" Value="" />
    <asp:HiddenField ID="hdnChildAge" runat="server" Value="" />
    <asp:HiddenField ID="hdnBranchValue" runat="server" Value="" />
    <asp:HiddenField ID="hdndate" runat="server" Value="" />
    <asp:HiddenField ID="hdnChkChild" runat="server" Value="" />
    <asp:HiddenField ID="hdnOfferDiscount" runat="server" Value="0" />
    <asp:HiddenField ID="hdnOffer" runat="server" Value="" />
    <script src="../js/slick.min.js?v20210917R"></script>
    <script src="../js/sliders_script.js?v20210917R"></script>
    <script src="../js/form_script.js?v20210917R"></script>
    <script src="../js/sticky-kit.min.js?v20210917R"></script>

    <script src="../js/ddaccordion.js?v20210917R"></script>

    <script type="text/javascript">

        $('.nstofferSlider').slick({
            slidesToShow: 3, slidesToScroll: 3, infinite: false, speed: 1000, cssEase: 'ease-in-out', dots: false, arrows: false,
            responsive: [{ breakpoint: 991, settings: { slidesToShow: 2, slidesToScroll: 2, dots: true } },
            { breakpoint: 767, settings: { slidesToShow: 1, slidesToScroll: 1, dots: true } }
            ]
        })

        $('.hwTable').slick({
            slidesToShow: 4, slidesToScroll: 4, infinite: false, speed: 1000, cssEase: 'ease-in-out', dots: false, arrows: false,
            responsive: [{ breakpoint: 991, settings: { slidesToShow: 2, slidesToScroll: 2, dots: true } },
            { breakpoint: 767, settings: { slidesToShow: 1, slidesToScroll: 1, dots: true } }
            ]
        })

        $('.bloglistContainer').slick({
            slidesToShow: 3, slidesToScroll: 3, infinite: false, speed: 1000, cssEase: 'ease-in-out', dots: false, arrows: false,
            responsive: [{ breakpoint: 991, settings: { slidesToShow: 2, slidesToScroll: 2, dots: true } },
            { breakpoint: 767, settings: { slidesToShow: 1, slidesToScroll: 1, dots: true } }
            ]
        })

        $('.suggested_sight_slider').slick({
            slidesToShow: 3, slidesToScroll: 3, infinite: false, speed: 1000, cssEase: 'ease-in-out', dots: false, arrows: true,
            responsive: [{ breakpoint: 991, settings: { slidesToShow: 2, slidesToScroll: 2 } },
            { breakpoint: 767, settings: { slidesToShow: 1, slidesToScroll: 1 } }
            ]
        })

        ddaccordion.init({ headerclass: "expandhead", contentclass: "expandbox", revealtype: "click", mouseoverdelay: 0, collapseprev: true, defaultexpanded: [], onemustopen: false, scrolltoheader: false, animatedefault: false, persiststate: false, toggleclass: ["", "openheader"], togglehtml: ["prefix", "", ""], animatespeed: "fast", oninit: function (headers, expandedindices) { }, onopenclose: function (header, index, state, isuseractivated) { } });

        $("[data-toggle=popover]").each(function (i, obj) {
            $(this).popover({
                html: true,
                content: function () {

                    var id = $(this).attr('id')
                    return $('#popover-content-' + id).html();
                }
            });
        });

        function sticky_relocate() {
            var window_top = $(window).scrollTop();
            var div_top = $('#sticky-anchor').offset().top;
            if (window_top > div_top) {
                $('.fix_on_scroll').addClass('stick');
            } else {
                $('.fix_on_scroll').removeClass('stick');
            }
        }
        $(function () {
            $(window).scroll(sticky_relocate);
            sticky_relocate();
        });

        $("ul.spyList li a[href^='#']").on('click', function (e) {
            e.preventDefault();
            var hash = this.hash;
            $('html, body').animate({ scrollTop: $(hash).offset().top }, 1000
            );
        });

        function spylistScroll() {
            var slsLeft = $('ul.spyList li.active').position().left;
            $('ul.spyList').stop().css("transform", "translateX( -" + slsLeft + "px)");
        }

        if ($(window).width() < 768) {
            $('#scrollSpy').on('activate.bs.scrollspy', function () {
                if ($('ul.spyList li').hasClass('active')) { spylistScroll(); }
            })
        }

        $('button.spyListBtn').click(function () {
            $('ul.spyList').toggleClass('spyListOpen');
        });
        $('ul.spyList li').click(function () {
            $('ul.spyList').removeClass('spyListOpen');
        });

        $(".summaryBtn").on('click', function () {
            $(".summaryTable").slideToggle();
            $(this).toggleClass('rotate');
        });

        $(".nstpbookBtn_mobile, .nstOfferItem button").on('click', function () {
            $('#ContentPlaceHolder_hdnMobileBtn').val("1");
            setTimeout(openingForm, 500);
        });

        function openingForm() {
            $.fancybox.open($('#openForm'), {
                type: 'inline', touch: false,
                opts: {
                    afterShow: function (instance, current) {
                        console.info('done!');
                    }
                },
            });
        }


        if ($(window).width() > 992) {
            $('.nstOfferItem button').click(function () {
                $('html, body').animate({ scrollTop: $('.selectionForm').offset().top - 130 })
            });
        }

        $(".classTabBox").hide();
        $(".classTabBox:first").show();

        $(".classTabs label").click(function () {
            $(".classTabBox").hide();
            var activeTab_1 = $(this).attr("rel");
            $('#' + activeTab_1 + ' input:radio:first').trigger("click");
            $("#" + activeTab_1).show();
            $(".classTabs label").removeClass("active");
            $(this).addClass("active");
        })

        if ($(window).width() > 992) {
            $("[data-sticky_column]").stick_in_parent({ parent: "[data-sticky_parent]", offset_top: 165, recalc_every: 1 });
        }
        /*  No. of Childrens */
        function childrenData() {

            $('#ddl_Child').change(function () {

                var s_child = $(this).val();
                if (s_child == '0')
                    $('#ChildrenDetails').slideUp();

                for (var i = 0; i < parseInt(s_child); i++) {
                    if (i == 0)
                        $('#child_1,#child_2,#child_3,#child_4,#child_5,#child_6,#child_7,#child_8,#child_9,#child_10').hide();
                    $('#child_' + (i + 1)).show();
                    $('#ChildrenDetails').slideDown();
                }
            });
        }
        function sticky_relocate2() {
            var window_top = $(window).scrollTop();
            var div_top = $('#stickyselectBtn').offset().top;
            if (window_top > div_top) {
                $('.fixSelectPassBtn').addClass('stick');
            } else {
                $('.fixSelectPassBtn').removeClass('stick');
            }
        }
        $(function () {
            $(window).scroll(sticky_relocate2);
            sticky_relocate2();
        });

        $('#SelectPassBtn').click(function () {
            $('html,body').animate({ scrollTop: $('#selectPass').offset().top + 50 })
        })

        $(".nstp_aboutBox .more").click(function () {

            $(this).parents(".nstp_aboutBox").toggleClass("expand");
            $(this).fadeOut(function () {
                $(this).text(($(this).text() == 'Read more') ? 'Read less' : 'Read more').fadeIn();
            })
            $(this).click(function () { return $("html,body").animate({ scrollTop: $(this).parents(".nstpAbout").offset().top - 150 }, 300), !1 })
        });

        /* Equal Height */
        equalheight = function (t) { var i, e = 0, h = 0, r = new Array; $(t).each(function () { if (i = $(this), $(i).height("auto"), topPostion = i.position().top, h != topPostion) { for (currentDiv = 0; currentDiv < r.length; currentDiv++) r[currentDiv].height(e); r.length = 0, h = topPostion, e = i.height(), r.push(i) } else r.push(i), e = e < i.height() ? i.height() : e; for (currentDiv = 0; currentDiv < r.length; currentDiv++)r[currentDiv].height(e) }) };

        $(function () { equalheight('.equate') });
        $(window).resize(function () { equalheight('.equate') });
        $(function () { equalheight('.hwItem') });
        $(window).resize(function () { equalheight('.hwItem') });
        $(function () { equalheight('.blogBox') });
        $(window).resize(function () { equalheight('.blogBox') });

        //$("#aSwissPass").fancybox({ "touch": false }).trigger("click");
        //$("#aSwissPassTCapply").fancybox({ "touch": false }).trigger("click");
        $('#aComboOfferTCapply').fancybox({
            "touch": false,
            "afterClose": function ()
            { $('html,body').animate({ scrollTop: $('#divComboOffers').offset().top - 110 }); }
        }).trigger("click");
    </script>
    <!-- PAGE CONTENT HOLDER ENDS -->
</asp:Content>

