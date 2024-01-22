/*
*<Authour>Rajanikant bhanu</Authour>
*<InseretedDate>15 jan 2019 14:49</InseretedDate>
*<AuthourRemarks>
*below script will create hyperlink on the webpage, according to the class by selecter or id by selecter which is mention in json file(/scripts/InterLinkKeyword.json) below in the script. This file can be called on required webpage to increase internal click of pages for SEO.
*</AuthourRemarks>
*<ApprovedBy>Shreya Patil (15 Jan 2019 15:39)</ApprovedBy>
*/
$(document).ready(function () {
    InterLinkKeyword();
    AddSchema();
});
function AddSchema() {
    $.getJSON("/scripts/Schema.json?V=20210209S", function (data) {

        var pg = $.trim(window.location.pathname).replace("/", "");
        if (pg != "") {
            if (data[pg] != null) {
                $.each(data[pg], function (i, item) {

                    var script = document.createElement('script');
                    script.type = "application/ld+json";
                    script.innerHTML = JSON.stringify(item);
                    //document.getElementsByTagName('head')[0].appendChild(script);
                    $('head').append(script);
                });
            }
        }
    });
}
function InterLinkKeyword() {

    $.getJSON("/scripts/InterLinkKeyword.json?V=202010011R", function (data) {

        if (data.classes != "") {
            var strIds = data.classes.split(',');
            for (var s = 0; s < strIds.length; s++) {
                var strHtml = $(strIds[s]).html();
                if (strHtml != null) {
                    if (data.KeyWords.length > 0) {
                        for (var i = 0; i < data.KeyWords.length; i++) {
                            if (data.KeyWords[i].KeyWord.length > 0) {
                                for (var w = 0; w < data.KeyWords[i].KeyWord.length; w++) {

                                    var strwords = data.KeyWords[i].KeyWord[w].words;
                                    const regexwords = new RegExp('\\s' + strwords, 'gi');//global and case insensitive
                                    var strUrl = data.KeyWords[i].URL;
                                    if (strUrl.toLowerCase().search("cntry=") >= 0)
                                        strUrl = strUrl + $('#hdnCountryCode').val();
                                    strHtml = strHtml.replace(regexwords, " <a href='" + strUrl + "' target='" + data.KeyWords[i].Target + "' style='text-decoration:underline !important;'>" + strwords + "</a>");
                                }
                            }
                        }
                    }

                }
                $(strIds[s]).html(strHtml);
            }
        }
    });
}