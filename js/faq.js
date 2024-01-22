function faq()
{
    var sHtml = "";
    sHtml += "<ul class='faq_set'>";
    sHtml += "<li>";
    sHtml += "<div class='expandhead question'>1 Does Swisstours offer tours for independent travellers and families?</div>";
    sHtml += "<div class='expandbox answer'>";
    sHtml += "<p>Yes, at Swisstours we offer customized tours based on rail travel for all individual travellers and families desiring to explore the destination on their own. Our tours provide flexibility of time and your own preference of travel dates.</p>";
    sHtml += "</div>";
    sHtml += "</li>";
    sHtml += "</ul>";
    sHtml += "<style type='text/css'>";
    sHtml += ".expandbox{display: none}";
    sHtml += " a.hiddenajaxlink{display: none}";
    sHtml += "</style>"; 
    sHtml += "<script src='/js/ddaccordion.js'></script><script>";
    ////sHtml += "$('.expandhead').accordion('refresh');";
    sHtml += "ddaccordion.init({ headerclass: 'expandhead', contentclass: 'expandbox', revealtype: 'click', mouseoverdelay: 0, collapseprev: true, defaultexpanded: [], onemustopen: false, scrolltoheader: true, animatedefault: false, persiststate: false, toggleclass: ['', 'openheader'], togglehtml: ['prefix', '', ''], animatespeed: 'fast', oninit: function (e, a) { }, onopenclose: function (e, a, n, o) { } });";
    sHtml += "</script>";
    $('#Holiday_Packages').html(sHtml);
}