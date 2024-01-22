/* 
$name:		    Validation of form fields
$version:	    1.0
$filename:	    validateFiels.js
$author:	    Sachin Ghangurde
$createdon:     2014/06/25 12:15
$createdby:     Sachin Ghangurde
$modifiedon:    2014/06/25 12:15
$modifiedby:    Sachin Ghangurde
*/

//$('#textName').keypress(function (e) {
//    var regex = new RegExp("^[a-zA-Z]+$");
//    var str = String.fromCharCode(!e.charCode ? e.which : e.charCode);
//    if (regex.test(str)) {
//        return true;
//    }
//    else {
//        e.preventDefault();
//        alert('Please Enter Alphabate');
//        return false;
//    }
//});
function validateNamePG(e) {    
    var regex = new RegExp("^[a-zA-Z-. ]+$");
    var str = String.fromCharCode(!e.charCode ? e.which : e.charCode);
    if (regex.test(str)) {
        return true;
    }
    else {
        e.preventDefault();
        return false;
    }
}
function validateName(e) {
    var regex = new RegExp("^[a-zA-Z ]+$");
    var str = String.fromCharCode(!e.charCode ? e.which : e.charCode);
    if (regex.test(str)) {
        return true;
    }
    else {
        e.preventDefault();
        return false;
    }
}
function validateAddress(e) {

    var regex = new RegExp("^[a-zA-Z0-9-,._ ]+$");
    var str = String.fromCharCode(!e.charCode ? e.which : e.charCode);
    if (regex.test(str)) {
        return true;
    }
    else {
        e.preventDefault();
        return false;
    }
}
function validateMobile(e) {
    var regex = new RegExp("^[0-9+]+$");
    var str = String.fromCharCode(!e.charCode ? e.which : e.charCode);
    if (regex.test(str)) {
        return true;
    }
    else {
        e.preventDefault();
        return false;
    }
}
function validatePostalCode(e) {
    var regex = new RegExp("^[a-zA-Z0-9]+$");
    var str = String.fromCharCode(!e.charCode ? e.which : e.charCode);
    if (regex.test(str)) {
        return true;
    }
    else {
        e.preventDefault();
        return false;
    }
}
function validateAmount(e) {

    var regex = new RegExp("^[0-9.]+$");
    var str = String.fromCharCode(!e.charCode ? e.which : e.charCode);
    if (regex.test(str)) {
        return true;
    }
    else {
        e.preventDefault();
        return false;
    }
}

function AllowNumberOnly() {
    return ((event.keyCode) >= 48 && (event.keyCode <= 57)) || (event.keyCode == 46) || (event.keyCode == 45); //. and - allow
}
function AllowPhoneNumber() {

    return ((event.keyCode) >= 48 && (event.keyCode <= 57)) || (event.keyCode ==43);//allow only 0-9 and + sign number
}
function AllowAlphannSpace()//allow alphabet n space
{
    return (event.keyCode == 32 || (event.keyCode >= 97 && event.keyCode <= 122) || (event.keyCode >= 65 && event.keyCode <= 90));
}
function validateTextBox(strVal, strChar) {
    
    var flag = false;
    var arrVal = strVal.split('');
    var arrChar = strChar.split('~');
    for (var v = 0; v < arrVal.length; v++) {
        flag = false;
        var arrSubChar1 = arrVal[v];
        for (var c = 0; c < arrChar.length; c++) {
            var arrSubChar = arrChar[c];
            if (arrChar[c].indexOf('-') > 0) {
                arrSubChar = arrChar[c].split('-');
                arrSubChar1 = arrSubChar1;
                ///Below code for 
                //[A-Z] asciicode[56-90]
                //[a-z] asciicode[97-122]
                //[0-9] asciiCode [48-57]
                if (arrVal[v].charCodeAt() >= arrSubChar[0].charCodeAt() && arrVal[v].charCodeAt() <= arrSubChar[1].charCodeAt()) 
                {
                    flag = true;
                    break;
                }
            }
            //Below code for 
            //any other specific char e.g. whitespace,@.
            else if (arrVal[v].charCodeAt() == arrSubChar[0].charCodeAt()) {
                flag = true;
                break;
            }
        }
        if (flag == false)
            break;

    }
    return flag;
}

function IsCommentField()//allow space.-_/ number n alphabet Capitalsmall
{
    return (
        (event.keyCode == 32) ||
        (event.keyCode == 45) ||
        (event.keyCode == 46) ||
        (event.keyCode == 47) ||
        (event.keyCode == 95) ||
        (event.keyCode >= 48 && event.keyCode <= 57) ||
        (event.keyCode >= 97 && event.keyCode <= 122) ||
        (event.keyCode >= 65 && event.keyCode <= 90)
    );
}

function WriteProtect() {
    if ((event.keyCode) >= 256) {
        return true;
    }
    return false;
}

