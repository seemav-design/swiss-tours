function Validation() {
    debugger;
    $($('.request_form').find('.highlight_error')).each(function (index, elem) {
        $(elem).removeClass('highlight_error');
    });

    var flag = true;

    var adult = $("#ContentPlaceHolder_drdTitle").val();
    if (adult == "") {
        $("#ContentPlaceHolder_drdTitle").addClass('highlight_error');
        document.getElementById("ContentPlaceHolder_drdTitle").focus();
        flag = false;
    }
    if (document.getElementById("ContentPlaceHolder_txtuserName").value == "") {
        $("#ContentPlaceHolder_txtuserName").addClass('highlight_error');
        document.getElementById("ContentPlaceHolder_txtuserName").focus();
        flag = false;
    }

    if (document.getElementById("ContentPlaceHolder_txtCity").value == "") {
        $("#ContentPlaceHolder_txtCity").addClass('highlight_error');
        document.getElementById("ContentPlaceHolder_txtCity").focus();
        flag = false;
    }

    if (document.getElementById("ContentPlaceHolder_txtCountry").value == "") {
        $("#ContentPlaceHolder_txtCountry").addClass('highlight_error');
        document.getElementById("ContentPlaceHolder_txtCountry").focus();
        flag = false;
    }
    if (document.getElementById("ContentPlaceHolder_txtPhoneNumber").value == "") {
        $("#ContentPlaceHolder_txtPhoneNumber").addClass('highlight_error');
        document.getElementById("ContentPlaceHolder_txtPhoneNumber").focus();
        flag = false;
    }
    else {
        var mob = /^[1-9]{1}[0-9]{9}$/;
        var txtMobile = document.getElementById("ContentPlaceHolder_txtPhoneNumber");
        if (mob.test(txtMobile.value) == false) {
            $("#ContentPlaceHolder_txtPhoneNumber").addClass('highlight_error');
            document.getElementById("ContentPlaceHolder_txtPhoneNumber").focus();
            flag = false;
        }
    }

    if (document.getElementById("ContentPlaceHolder_txtEMailID").value == "") {
        $("#ContentPlaceHolder_txtEMailID").addClass('highlight_error');
        document.getElementById("ContentPlaceHolder_txtEMailID").focus();
        flag = false;
    }
    else {
        var email = document.getElementById("ContentPlaceHolder_txtEMailID")
        var filter = /^([a-zA-Z0-9_.-])+@(([a-zA-Z0-9-])+.)+([a-zA-Z0-9]{2,4})+$/;
        if (!filter.test(email.value)) {
            $("#ContentPlaceHolder_txtEMailID").addClass('highlight_error');
            document.getElementById("ContentPlaceHolder_txtEMailID").focus();
            flag = false;
        }
    }

    if (document.getElementById("ContentPlaceHolder_txtDateOfBirth").value == "") {
        $("#ContentPlaceHolder_txtDateOfBirth").addClass('highlight_error');
        document.getElementById("ContentPlaceHolder_txtDateOfBirth").focus();
        flag = false;
    }

    if (document.getElementById("ContentPlaceHolder_txtCIVNUmber").value == "" && document.getElementById("ContentPlaceHolder_txtTransactionID").value == "") {
        $("#ContentPlaceHolder_txtCIVNUmber").addClass('highlight_error');
        $("#ContentPlaceHolder_txtTransactionID").addClass('highlight_error');
        flag = false;
    }
    if (!$('#ContentPlaceHolder_checkTermConditions').prop("checked")) {
        $('#ContentPlaceHolder_checkTermConditions').addClass("highlight_error");
        $($('#ContentPlaceHolder_checkTermConditions').parent()).addClass("highlight_error");
        $('#ContentPlaceHolder_checkTermConditions').focus();
        flag= false;
    }  
    $('.selectpicker').selectpicker('refresh');

    return flag;
}