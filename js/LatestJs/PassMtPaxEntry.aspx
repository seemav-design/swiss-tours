<%@ Page Title="" Language="C#" MasterPageFile="~/Main.master" AutoEventWireup="true" CodeFile="PassMtPaxEntry.aspx.cs" Inherits="PassMtEx_PassMtPaxEntry" %>

<asp:Content ID="Content1" ContentPlaceHolderID="ContentPlaceHolder" runat="Server">
    <link href="/autocomplete/jquery.autocomplete.css" rel="stylesheet" type="text/css" />
    <script src="/autocomplete/jquery.autocomplete.js" type="text/javascript"></script>
    <script src="/js/validateField.js?ver=20210507R"></script>
    <link href="/css/intlTelInput.css?v=20180327P" rel="stylesheet" />
    <script src="/Scripts/Sms-Otp.js?v=20210705R"></script>
    <script src="/Scripts/intlTelInput.js?v=20180327P"></script>
    <!-- PAGE CONTENT HOLDER STARTS  -->
    <script>
        var cntry = '<%=countrycode%>';
        $(document).ready(function ($) {

            if (cntry != 'IN') {
                $('#ContentPlaceHolder_txtPanNo').val('Pan No');
            }
            if (window.history && window.history.pushState) {
                $(window).on('popstate', function () {

                    var hashLocation = location.hash;
                    var hashSplit = hashLocation.split("#!/");
                    var hashName = hashSplit[1];
                    if (hashName !== '') {
                        var hash = window.location.hash;
                        if (hash === '') {
                            window.history.pushState('forward', null, (location.href).replace('#', '') + '#');
                            //alert('Back button was pressed.');
                            $('#ContentPlaceHolder_lblMsg').html('Sorry! You cannot press back button at this level.');
                            $('#ContentPlaceHolder_lblMsg').focus();

                        }
                    }
                });

                window.history.pushState('forward', null, (location.href).replace('#', '') + '#');
                $('#ContentPlaceHolder_lblMsg').html('');
            }

        });
        function AllowDOB(dob) {
            debugger;
            if (((event.keyCode) >= 48 && (event.keyCode <= 57)) || (event.keyCode == 45)) {
                var vAdd = "-";
                if (event.keyCode == 45)
                    vAdd = "";
                var val = $(dob).val();
                if (val.length == 2)
                    $(dob).val(val + vAdd);
                if (val.length == 5)
                    $(dob).val(val + vAdd);
                return true;
            }
            return false;
        }
        function repeatOnBlur(Cntrl) {

            var ids = "#" + Cntrl.id;
            var idsArry = ids.split('_');
            var product = $("#ContentPlaceHolder_hdnTotalProduct").val();
            var rows = $("#ContentPlaceHolder_hdnNoRowPerProduct").val();
            for (var h = 0; h < product; h++) {
                var newIds = idsArry[0] + "_" + h + "_" + idsArry[2];
                if (newIds != ids) {
                    $(newIds).val($(ids).val());
                    //if (parseInt(newIds.indexOf("txtCountryOfResidence")) >= 0) {
                    //    $(newIds.replace("txtCountryOfResidence", "hdnCountryOfResidence")).val($(ids.replace("txtCountryOfResidence", "hdnCountryOfResidence")).val());
                    //}
                }

            }
            if ($.trim($(ids).val()) != '' || $.trim($(ids).val()) != '0') {
                $(ids).removeClass("highlight_error");
                $($(ids).parent()).removeClass("highlight_error");
            }
            $('.selectpicker').selectpicker('refresh');
            return true;
        }
        function ValidateAll() {

            var flag = true;
            var strRow = "";
            var strFinal = "";
            var aspnetForm = document.getElementById("form1");

            for (var i = 0; i < aspnetForm.length; i++) {
                var e = aspnetForm.elements[i];

                if ((e.type == 'text' || e.type == 'textarea' || e.type == 'select-one' || e.type == 'checkbox') && e.id != '') {

                    var IdStr = '#' + e.id;
                    if (parseInt(IdStr.indexOf("txtDOB")) >= 0) {
                        debugger;
                        var flag = false;
                        var hdnDOB = IdStr.replace("txtDOB", "hdnDOB");
                        if ($.trim($(hdnDOB).val()) != "") {
                            if ($.trim($(hdnDOB).val()).split('#').length > 1) {
                                var al = $.trim($(hdnDOB).val()).split('#');
                                if ($.trim(al[0]) != "" && $.trim(al[1]) != "") {
                                    var minAge = parseFloat(al[0].split('-')[0]);
                                    var maxAge = parseFloat(al[0].split('-')[1]);
                                    //var tDate = $.trim(al[1]);
                                    //var pAge = $.trim($(IdStr).val());
                                    var tDate = new Date($.trim(al[1]).split('~')[2], $.trim(al[1]).split('~')[1] - 1, $.trim(al[1]).split('~')[0]);
                                    var pAge = new Date($.trim($(IdStr).val()).split('-')[2], $.trim($(IdStr).val()).split('-')[1] - 1, $.trim($(IdStr).val()).split('-')[0]);
                                    if (pAge.getFullYear() == $.trim($(IdStr).val()).split('-')[2] && pAge.getMonth() == ($.trim($(IdStr).val()).split('-')[1]-1) && pAge.getDate() == $.trim($(IdStr).val()).split('-')[0]) {
                                        var diff = new Date(tDate - pAge);
                                        var cYrs = parseFloat((diff / 1000 / 60 / 60 / 24) / 365);
                                        if (cYrs >= minAge && cYrs <= maxAge) { flag = true; }
                                    }
                                }
                            }
                        }
                        if (!flag) {
                            $(IdStr).addClass("highlight_error");
                            $(IdStr).focus();
                        }
                    }

                    if ($.trim($(IdStr).val()) == "") {
                        if (IdStr == "#ContentPlaceHolder_txtComments" || IdStr == "#ContentPlaceHolder_txtStayDetails" || IdStr == "#ContentPlaceHolder_txtPostalCode" || IdStr == "#ContentPlaceHolder_txtPhoneNo") { }
                        else {
                            $(IdStr).addClass("highlight_error");
                            $(IdStr).focus();
                            $('.selectpicker').selectpicker('refresh');
                            flag = false;
                        }
                    }
                    if ($.trim($(IdStr).val()) == "0") {

                        $(IdStr).addClass("highlight_error");
                        $(IdStr).focus();
                        $('.selectpicker').selectpicker('refresh');
                        flag = false;
                    }
                    if (IdStr == "#ContentPlaceHolder_txtMobileNo") {
                        if (!$(IdStr).attr('readonly') && cntry == 'IN') {
                            $(IdStr).addClass("highlight_error");
                            $(IdStr).focus();
                            $('.selectpicker').selectpicker('refresh');
                            flag = false;
                        }
                        else if ($.trim($("#ContentPlaceHolder_txtMobileNo").val()) == "" && cntry != 'IN') {
                            $(IdStr).addClass("highlight_error");
                            $(IdStr).focus();
                            $('.selectpicker').selectpicker('refresh');
                            flag = false;
                        }
                    }
                    //if (parseInt(IdStr.indexOf("txtCountryOfResidence")) >= 0) {
                    //    var hdnCountryOfResidence = IdStr.replace("txtCountryOfResidence", "hdnCountryOfResidence");
                    //    if ($.trim($(hdnCountryOfResidence).val()) == "") {
                    //        $(IdStr).addClass('highlight_error');
                    //        $(IdStr).focus();
                    //        flag=false;
                    //    }
                    //    else if ($.trim($(IdStr).val()) != $.trim($(hdnCountryOfResidence).val())) {
                    //        $(IdStr).addClass('highlight_error');
                    //        $(IdStr).focus();
                    //        flag=false;
                    //    }
                    //}
                    if (parseInt(IdStr.indexOf("txtCountryOfResidence")) >= 0) {
                        var hdnCountryOfResidence = IdStr;
                        if ($.trim($(hdnCountryOfResidence).val()) == "") {
                            $(IdStr).addClass('highlight_error');
                            $(IdStr).focus();
                            flag = false;
                        }

                    }

                    if (parseInt(IdStr.indexOf("ContentPlaceHolder_txtCountry")) >= 0) {

                        //var hdnCountry = IdStr.replace("ContentPlaceHolder_txtCountry", "ContentPlaceHolder_hdnCountry");
                        var hdnCountry = IdStr;
                        if ($.trim($(hdnCountry).val()) == "") {
                            $(IdStr).addClass('highlight_error');
                            $(IdStr).focus();
                            flag = false;
                        }
                        //else if ($.trim($(IdStr).val()) != $.trim($(hdnCountry).val())) {
                        //    $(IdStr).addClass('highlight_error');
                        //    $(IdStr).focus();
                        //    flag=false;
                        //}
                    }

                    if (IdStr == "#chkPolicy") {
                        if (!$(IdStr).prop("checked")) {
                            $(IdStr).addClass("highlight_error");
                            $($(IdStr).parent()).addClass("highlight_error");
                            $(IdStr).focus();
                            flag = false;
                        }
                    }

                    if (cntry == 'IN') {
                        if (IdStr == "#ContentPlaceHolder_txtPanNo") {
                            var PanNoRregex = /^[A-Za-z]{3}[Pp]{1}[A-Za-z]{1}\d{4}[A-Za-z]{1}$/;
                            if (PanNoRregex.test($.trim($(IdStr).val())) == false) {
                                $(IdStr).addClass('highlight_error');
                                $(IdStr).focus();
                                flag = false;
                            }
                        }
                        if (IdStr == "#chkTCS") {
                            if (!$(IdStr).prop("checked")) {
                                $(IdStr).addClass("highlight_error");
                                $($(IdStr).parent()).addClass("highlight_error");
                                $(IdStr).focus();
                                flag = false;
                            }
                        }
                    }
                    if (IdStr == "#ContentPlaceHolder_txtEmail") {
                        var value = $(IdStr).val();
                        var apos = value.indexOf('@');
                        var apos2 = value.lastIndexOf('@');
                        var apospce = value.indexOf(' ');
                        if (apos == apos2 && apos != -1 && apos2 != -1 && apospce <= 0) {
                            dotpos = value.lastIndexOf('.');
                            if (apos < 1 || dotpos - apos < 2) {
                                $(IdStr).addClass("highlight_error");
                                $(IdStr).focus();
                                flag = false;
                            }
                            else {
                                value = value.split('.')
                                if (value[value.length - 1].length == 0) {
                                    $(IdStr).addClass("highlight_error");
                                    $(IdStr).focus();
                                    flag = false;
                                }
                            }
                        }
                        else {
                            $(IdStr).addClass("highlight_error");
                            $(IdStr).focus();
                            flag = false;
                        }
                    }

                    if (parseInt(IdStr.indexOf("txtId")) >= 0 || parseInt(IdStr.indexOf("txtTitlegvw")) >= 0 || parseInt(IdStr.indexOf("txtFNameGvw")) >= 0 || parseInt(IdStr.indexOf("txtLNameGvw")) >= 0 || parseInt(IdStr.indexOf("txtPassNo")) >= 0 || parseInt(IdStr.indexOf("txtBType")) >= 0 || parseInt(IdStr.indexOf("txtCountryOfResidence")) >= 0 || parseInt(IdStr.indexOf("ddlDD")) >= 0 || parseInt(IdStr.indexOf("ddlMM")) >= 0 || parseInt(IdStr.indexOf("ddlYYYY")) >= 0 || parseInt(IdStr.indexOf("ddlPassportDD")) >= 0 || parseInt(IdStr.indexOf("ddlPassportMM")) >= 0 || parseInt(IdStr.indexOf("ddlPassportYYYY")) >= 0|| parseInt(IdStr.indexOf("txtDOB")) >= 0) {

                        if (parseInt(IdStr.indexOf("txtId")) >= 0) {
                            if (strRow != "")
                                strFinal += strRow + "~";
                            strRow = $(IdStr).val();
                        }
                        else {
                            strRow += "," + $(IdStr).val();
                        }
                    }
                    else if (strRow != "") {
                        strFinal += strRow + "~";
                        strRow = "";
                    }
                }
            }
            $('#ContentPlaceHolder_hdnJValue').val(strFinal);
            if (flag) {
                openProgressIndicator();
            }
            return flag;
        }
    </script>
    <div class="row">
        <div class="container-fluid maxwidth">

            <div class="container-fluid shoppingcart_main">
                <div class="row">
                    <div class="col-xs-12">
                        <div class="form-group" style="text-align: center;">
                            <strong>
                                <asp:Label ID="lblMsg" runat="server" CssClass="red_txt"></asp:Label></strong>
                        </div>
                    </div>
                    <div class="col-xs-12 form_head gray_texture">
                        <div class="row">
                            <div class="col-xs-12"><strong class="black_txt">Passenger Details</strong></div>
                        </div>
                    </div>
                    <div class="clearfix"></div>
                    <div id="DivForm" runat="server">
                    </div>
                </div>

                <div class="row apmt_contactform_main">

                    <div class="col-xs-12" style="margin: 15px 0 5px">
                        <p><strong class="red_txt" style="font-size: 16px">Contact Details</strong></p>
                    </div>

                    <div class="col-xs-12">
                        <div class="row">

                            <div class="col-sm-4">
                                <div class="form-group">
                                    <select class="form-control selectpicker" title="Title" runat="Server" id="ddlTitle" onchange='javascript:return repeatOnBlur(this);'>
                                        <option value="0">Select</option>
                                        <option value="1">Mr</option>
                                        <option value="2">Ms</option>
                                    </select>
                                </div>
                            </div>

                            <div class="col-sm-8">
                                <div class="form-group">
                                    <input type="text" class="form-control" placeholder="Lead Traveller Name" id="txtName" runat="server" onchange='javascript:return repeatOnBlur(this);' onkeypress='javascript:return AllowAlphannSpace();' ondrop='return false;' />
                                </div>
                            </div>

                        </div>
                    </div>

                    <div class="col-xs-12 noneIMP">
                        <div class="row">

                            <div class="col-xs-12">
                                <div class="form-group">
                                    <textarea type="text" class="form-control" placeholder="Insert address without special character" id="txtStayDetails" runat="server" onchange='javascript:return repeatOnBlur(this);' onkeypress='javascript:return IsCommentField();' ondrop='return false;' onpaste="return false;" autocomplete="off">blank</textarea>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="col-xs-12 noneIMP">
                        <div class="row">

                            <div class="col-sm-6">
                                <div class="form-group">
                                    <input type="text" value="100001" class="form-control" placeholder="Postal Code" id="txtPostalCode" runat="server" ondrop='return false;' onchange='javascript:return repeatOnBlur(this);' />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-xs-12">
                        <div class="row">
                            <div class="col-sm-6">
                                <div class="form-group">
                                    <input type="text" class="form-control" placeholder="City" id="txtCity" runat="server" onchange='javascript:return repeatOnBlur(this);' onkeypress='javascript:return AllowAlphannSpace();' ondrop='return false;' />
                                </div>
                            </div>

                            <div class="col-sm-6">
                                <div class="form-group">
                                    <%--<input type="text" class="form-control" placeholder="Country" id="txtCountry" runat="server" onchange='javascript:return repeatOnBlur(this);' onkeypress='javascript:return AllowAlphannSpace();' ondrop='return false;' autocomplete="off" />
                                    <input type='hidden' id='hdnCountry' runat='Server' />--%>
                                    <select class="form-control" title="Country" runat="Server" id="txtCountry" onchange='javascript:return repeatOnBlur(this);'>
                                    </select>
                                </div>
                            </div>

                        </div>
                    </div>

                    <div class="col-xs-12 noneIMP">
                        <div class="row">

                            <div class="col-sm-4">
                                <div class="form-group">
                                    <input type="text" class="form-control" placeholder="Phone No." id="txtPhoneNo" value="999997777" runat="server" onchange='javascript:return repeatOnBlur(this);' onkeypress="javascript:return AllowPhoneNumber();" ondrop="return false;" onpaste="return false;" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-xs-12">
                        <div class="row">
                            <div class="col-sm-5">
                                <div class="form-group">
                                    <input type="text" class="form-control" placeholder="Mobile No." id="txtMobileNo" runat="server" onchange='javascript:return repeatOnBlur(this);' onkeypress="javascript:return AllowPhoneNumber();" ondrop="return false;" onpaste="return false;" />
                                </div>
                            </div>
                            <div class="col-sm-1" id="divOTPPTP" style="padding: 0px !important;">
                            </div>
                            <div class="col-sm-6">
                                <div class="form-group">
                                    <input type="text" class="form-control" placeholder="Email Id" id="txtEmail" runat="server" onchange='javascript:return repeatOnBlur(this);' />
                                </div>
                            </div>

                        </div>
                    </div>
                    <div class="col-xs-12">
                        <div id="divVerifyOTP"></div>
                        <div id="divOTPMsg" class="red"></div>
                    </div>
                    <div class="col-xs-12" id="divBranch" runat="server">
                        <div class="row">

                            <div class="col-sm-6" id="divddlBranch" runat="server">
                                <div class="form-group">
                                    <asp:DropDownList CssClass="form-control selectpicker" ID="ddlBranch" runat="server" DataTextField="BranchName" DataValueField="REAKey" onchange='javascript:return repeatOnBlur(this);'>
                                    </asp:DropDownList>
                                </div>

                                <i class="fa fa-info-circle red_txt" data-toggle="tooltip" data-placement="auto top" title="Your passes will be dispatched from the nearest SWISStours office selected by you." style="position: absolute; font-size: 16px; right: -1px; top: 8px"></i>
                            </div>
                            <div class="col-sm-6">
                                <div class="form-group" style="margin-bottom: unset;">
                                    <input type="text" class="form-control" placeholder="Pan No" id="txtPanNo" runat="server" onchange='javascript:return repeatOnBlur(this);' />
                                </div>
                                <i class="fa fa-info-circle red_txt" data-toggle="tooltip" data-placement="auto top" title="As per RBI regulations PAN card of the lead passenger is mandatory to ensure the foreign remittances per resident individual does not exceed the limit up to USD 2,50,000 during the financial year." style="position: absolute; font-size: 16px; right: -1px; top: 8px"></i>
                                <div class="col-xs-12 row" style="font-size: 12px;">
                                    <div class="ez_checkbox">
                                        <label>
                                            <input id="chkTCS" type="checkbox" onchange='javascript:return repeatOnBlur(this);' /></label>
                                        <strong>I accept that the TCS amount will be credited to the given PAN number.</strong>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>

                    <div class="col-xs-12 noneIMP">
                        <div class="form-group">
                            <textarea class="form-control" placeholder="Comments" id="txtComments" runat="server" onchange='javascript:return repeatOnBlur(this);' onkeypress='javascript:return IsCommentField();' ondrop='return false;' maxlength="150"></textarea>
                        </div>
                    </div>

                    <div class="col-xs-12" style="margin-bottom: 10px;">
                        <div class="ez_checkbox">
                            <label>
                                <input id="chkPolicy" type="checkbox" onchange='javascript:return repeatOnBlur(this);' /></label>
                            <strong>I have read & accepted <a data-fancybox data-src="#promo_popup" href="javascript:;" data-options='{"touch":false}' style="color: #cc0000; text-decoration: underline">Terms & conditions</a></strong>
                        </div>
                    </div>

                    <!-- PROMO CODE POPUP -->
                    <div style="display: none" class="fancy_inline_display" id="promo_popup">

                        <div class="generalpopup">
                            <div class="poptitle lightgray_texture">Terms & conditions</div>

                            <div class="container-fluid">
                                <%--  <p><strong class="red_txt">Hotels:</strong></p>
                                <p>All hotels are operated by various hotel operators and Swisstours acts as an intermediary arranging / facilitating supply of services between the hotel service provider and customers. The hotels are booked by Swisstours in their capacity as an intermediary and we cannot be held liable for any technical errors in the system, lack of availability of hotel rooms, cancellation and disruption of services. In case of any of the above issues, Swisstours will refund the amount as per the terms and conditions of the hotels involved. Cancellation policy is mentioned on the conditions tab on each hotel.  By accepting the above conditions, the passenger undertakes to absolve Swisstours and its representatives of any liabilities arising from technical errors in the system, lack of availability of  hotel rooms, cancellations and disruptions of services.</p>

                                <p><strong class="red_txt">Apartments :</strong></p>
                                <p>All apartments are operated by various apartment operators and Swisstours acts as an intermediary arranging / facilitating supply of services between the apartments service provider and customers. The apartments are booked by Swisstours in their capacity as an intermediary and we cannot be held liable for any technical errors in the system, lack of availability of apartment rooms, cancellation and disruption of services. In case of any of the above issues, Swisstours will refund the amount as per the terms and conditions of the apartments involved. Cancellation policy is mentioned on the cancellation tab on each apartment.  By accepting the above conditions, the passenger undertakes to absolve Swisstours and its representatives of any liabilities arising from technical errors in the system, lack of availability of apartment rooms, cancellations and disruptions of services.</p>--%>
                                <div id="divRail" runat="server" visible="false">
                                    <p><strong class="red_txt">Rail :</strong></p>
                                    <p>All tickets / passes are operated by various rail companies and Swisstours acts as intermediary arranging/facilitating supply of services between the rail service provider and the customers. The tickets / passes are booked by Swisstours in their capacity as an intermediary and we cannot be held liable for any technical errors in the system, lack of availability of seats, delays, cancellation and disruption of services. In case of any of the above issues, Swisstours will refund the amount as per the terms and conditions of the carriers involved. All general conditions and cancellation policy is mentioned on the conditions tab on each rail.By accepting the above conditions, the passenger undertakes to absolve Swisstours and its representatives of any liabilities arising from technical errors in the system, lack of availability of seats, delays, cancellations and disruptions of services.</p>

                                </div>
                                <div id="divCxn" runat="server" visible="false">
                                    <p><strong class="red_txt">Cancellation Policy :</strong></p>
                                </div>
                                <div id="divPass" runat="server" visible="false">
                                    <p><strong class="red_txt">Swiss Travel Pass :</strong></p>
                                    <ul>
                                        <li>Refundable up to 1 day prior to first date of validity. Thereafter, a 15% penalty applies to unused passes. If pass is used or flexi days are activated, it becomes non refundable.</li>
                                        <li>Once the pass has been cancelled the passenger will not be able to use it.</li>
                                    </ul>

                                    <p><strong class="red_txt">Eurail Mobile Pass :</strong></p>
                                    <ul>
                                        <li>No refund on partially used, activated pass. 85% refundable within 1 year from the date of purchase on non activated pass.</li>
                                    </ul>
                                </div>

                                <div id="divPTP" runat="server" visible="false">
                                    <p><strong class="red_txt">Point to Point tickets & Premier Trains :</strong></p>
                                    <ul>
                                        <p>Exchange and refund policies vary depending on type of fare purchased.Please Note:No refund is possible for reservations and tickets or passes lost or stolen.</p>
                                    </ul>
                                </div>
                                <div id="divMtexVIA" runat="server" visible="false">
                                    <p><strong class="red_txt">Mountain excursions & Sightseeing :</strong></p>
                                    <ul>
                                        <p>All sightseeing are operated by various sightseeing companies and Swisstours acts as intermediary arranging/facilitating supply of services between the sightseeing service provider and the customers. The sightseeing are booked by Swisstours in their capacity as an intermediary and we cannot be held liable for any technical errors in the system, lack of availability of seats, delays, cancellation and disruption of services. In case of any of the above issues, Swisstours will refund the amount as per the terms and conditions of the sightseeing companies involved. All general conditions and cancellation policy is mentioned on respective product booking site.By accepting the above conditions, the passenger undertakes to absolve Swisstours and its representatives of any liabilities arising from technical errors in the system, lack of availability of seats, delays, cancellations and disruptions of services.</p>
                                    </ul>
                                </div>
                                <div id="divPKG" runat="server" visible="false">

                                    <p><strong class="red_txt">Packages :</strong></p>
                                    <ul>
                                        <p>All the packages listed under the holiday section have their own cancellation policy depending on the type of accommodation and services included. Please check the same under each package.</p>
                                    </ul>
                                </div>
                            </div>
                        </div>

                    </div>
                    <!-- PROMO CODE POPUP ends -->

                    <div class="col-xs-12">
                        <div class="form-group">
                            <asp:Button runat="server" ID="btnContinue" class="cta btn" Style="width: 150px; margin: auto; float: none; display: block" OnClick="btnContinue_Click" OnClientClick="javascript:return ValidateAll();" Text="Continue"></asp:Button>

                        </div>
                    </div>

                </div>

            </div>

            <div class="clearfix"></div>
        </div>

        <script src="/js/form_script.js"></script>
        <input id="hdnJValue" style="width: 19px" type="hidden" runat="server" />
        <input id="hdnNoRowPerProduct" type="hidden" runat="server" style="width: 1px" />
        <input id="hdnTotalProduct" type="hidden" runat="server" style="width: 1px" />
        <!-- PAGE CONTENT HOLDER ENDS -->
    </div>

    <script>
        try {
            jQuery(document).ready(function ($) {
                $('input[name=CountryOfResidence]').each(function (index, elem) {

                    $(elem).autocomplete({
                        source: "/Hotel/Nationality.ashx",
                        minLength: 1,
                        select: function (event, ui) {

                            var hdnCountryOfResidence = event.target.id;
                            hdnCountryOfResidence = hdnCountryOfResidence.replace("txtCountryOfResidence", "#hdnCountryOfResidence");
                            $(hdnCountryOfResidence).val(ui.item.CountryName);
                            this.value = ui.item.CountryName;
                            return false;
                        }
                    });
                    //var $popover = $(elem).popover({
                    //    html: true,
                    //    placement: 'bottom',
                    //    // title: '<?= lang("Select passengers");?><a class="close demise");">×</a>',
                    //    content: function () {
                    //        return $(this).parent().find('.content').html();
                    //    }
                    //});
                });
                $('#ContentPlaceHolder_txtCountry').autocomplete({
                    source: "/Hotel/Nationality.ashx",
                    minLength: 1,
                    select: function (event, ui) {
                        var hdnCountry = event.target.id;
                        hdnCountry = hdnCountry.replace("ContentPlaceHolder_txtCountry", "#ContentPlaceHolder_hdnCountry");
                        $(hdnCountry).val(ui.item.CountryName);

                        this.value = ui.item.CountryName;
                        return false;
                    }
                });
            });



            $.ui.autocomplete.prototype._renderItem = function (ul, item) {
                var re = new RegExp("(?![^&;]+;)(?!<[^<>]*)(" + $.ui.autocomplete.escapeRegex(this.term) + ")(?![^<>]*>)(?![^&;]+;)", "gi");
                return $("<li></li>")
                    .data("item.autocomplete", item)
                    .append("<div><span style='color:#ce000c;font-size:75%'><i>" + item.CountryName + "</i></span></div>")
                    .appendTo(ul);
            };
        } catch (e) { }
    </script>
</asp:Content>

