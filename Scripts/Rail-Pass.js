var URL = window.location.host;
var html = "";

var hasPormotion = "";
var DisAmt = "SW0";
DisAmt = DisAmt.split('SW');
var isCodeValid = "No";

function ChangePassDetails(id) {
    var st = id.split(';');
    document.getElementById("ContentPlaceHolder_ddlPassFamily").value = id;
    $('.selectpicker').selectpicker('refresh');
    document.getElementById("ContentPlaceHolder_hdnFamilyId").value = st[0];

    $("#PassName").html($("#ContentPlaceHolder_ddlPassFamily option:selected").text()); //////////////Putting here Pass Name to labelhead/////////
    if (st[1] != "0")
        hasPormotion = st[1] + ';' + st[0] + ';' + st[3] + ';' + st[2];
    else
        hasPormotion = "";
    //2 coutry=101102,101103,101104
    //3 coutry=101106,101114,101108
    //4 coutry=101040,101042,101041
    if (st[0] == '101102' || st[0] == '101106' || st[0] == '101040' || st[0] == '101042' || st[0] == '101114' || st[0] == '101103' || st[0] == '101041' || st[0] == '101108' || st[0] == '101104') { //Condition for 2,3,4 countries pass

        document.getElementById("divPassDetails").innerHTML = "";
        ShowCountries();
        document.getElementById("ContentPlaceHolder_divselectCountry").style.display = "block";
    }
    else {
        document.getElementById("ContentPlaceHolder_divselectCountry").style.display = "none";
        DisplayPassRates();
    }
}
function DisplayPassRates() {
    var id = document.getElementById("ContentPlaceHolder_hdnFamilyId").value;
    var REAKey = document.getElementById("ContentPlaceHolder_hdnREAKey").value;
    /////openProgressIndicator();
    var str = "";
    //if (id != '100715' || id != "101167" || id != "101120" || id != "101161" || id != "100942") {
    if (id == '100715' || id == "101167" || id == "101120" || id == "101161" || id == "100942") {
        $("#PassSortDescription").show(); //////////////hiding description/////////
        $("#divfamilycard").show(); //////////////hiding divfamilycard/////////

    }
    else {
        $("#PassSortDescription").hide(); //////////////Showing description/////////
        $("#divfamilycard").hide(); //////////////Showing divfamilycard/////////

    }

    //////////////Hide/Show divStanserhornOffer/////////
    if (id == '100715' || id == '101120') {
        $("#divStanserhornOffer").show();
    }
    else {
        $("#divStanserhornOffer").hide();
    }
    //////////////Hide/Show Super Saver Promo - Rail Passes/////////
  
        if (id == '100715') {
            $("#divApartment").show();
            $("#divComboOffer").show();
            $("#divSupperSaver").hide();
            //$("#popUpPasses").fancybox({ "touch": false }).trigger("click");
        }
        else if (id != '100715' && document.getElementById("ContentPlaceHolder_hdnCountryCode").value == "IN") {
            $("#divApartment").hide();
            $("#divComboOffer").hide();
            $("#divSupperSaver").show();
        }
        else {
            $("#divApartment").hide();
            $("#divComboOffer").hide();
            $("#divSupperSaver").hide();
        }

    if (id == '100029') {
        $("#divGlobalPass").hide();
        $("#aGlobalPass").fancybox({ "touch": false }).trigger("click");
    }
    else { $("#divGlobalPass").hide(); }
    //2 coutry=101102,101103,101104
    //3 coutry=101106,101114,101108
    //4 coutry=101040,101042,101041
    if (id == '101102' || id == '101106' || id == '101040' || id == '101042' || id == '101114' || id == '101103' || id == '101041' || id == '101108' || id == '101104') {
        var cntryno = 0;
        switch (id) {
            case '101102':
            case '101103':
            case '101104':
                cntryno = 2;
                break;
            case '101106':
            case '101114':
            case '101108':
                cntryno = 3;
                break;
            case '101040':
            case '101042':
            case '101041':
                cntryno = 4;
                break;
            default:
                cntryno = 4;
                break;
        }

        for (var i = 0; i < cntryno; i++) {
            var skillsSelect = document.getElementById("ddlCountry" + (i + 1));
            var selectedText = skillsSelect.options[skillsSelect.selectedIndex].text;
            str += selectedText + "-";
        }
        str = str.substring(0, str.length - 1);
    }
    openProgressIndicator();
    $.ajax({
        type: "POST",
        url: "/PassMtEx/Rail-Pass.aspx/GetPassResult",
        data: '{Id: ' + id + ', CountryName:"' + str + '" ,REAKey:"' + REAKey + '"}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: OnSuccess,
        failure: function (response) {
            alert(response.d);
        }
    });
}

// Display all rail pass name and rates
function OnSuccess(response) {

    var list = response.d;
    html = "";
    if (list.length > 0) {
        ////start #UL# label of Family type (eg. Regular, saver, party)
        //please let here html var without +
        html = "<ul class='lightgray_texture text-uppercase pass_types'>";
        ////This for loop contains label of Family type (eg. Regular, saver, party)
        for (var i = 0; i < list.length; i++) {


            //////////////////start for benifits///////////////////
            if (list[i].Benefits != "") {
                var BenefitsHtml = "";
                if (list[i].Benefits.split('~').length > 0) {
                    $("#Tabbenefits").css({ display: "inline-block" });
                    $("#benefits").removeClass("none");

                    var Benefits = list[i].Benefits.split('~');
                    //please let here html var without +
                    BenefitsHtml = "<div class='heading black_txt'><i class='fa fa-check'></i>Benefits :</div>";
                    BenefitsHtml += "<ul>";
                    for (var b = 0; b < Benefits.length; b++) {

                        BenefitsHtml += "<li>" + Benefits[b] + "</li>";


                    }
                    BenefitsHtml += "</ul>";
                }
                $("#benefits").html(BenefitsHtml);
            }
            else {
                $("#Tabbenefits").css({ display: "none" });
                $("#benefits").addClass("none");
            }

            //////////////////End for benifits///////////////////

            //////////////////start for howitworks///////////////////
            if (list[i].HowItWorks != "") {
                var HowItWorksHtml = "";
                if (list[i].HowItWorks.split('~').length > 0) {
                    $("#Tabhowitworks").css({ display: "inline-block" });
                    $("#howitworks").removeClass("none");

                    var HowItWorks = list[i].HowItWorks.split('~');
                    //please let here html var without +
                    HowItWorksHtml = "<div class='heading black_txt'><i class='fa fa-check'></i>How it works :</div>";
                    HowItWorksHtml += "<ul>";
                    for (var h = 0; h < HowItWorks.length; h++) {

                        HowItWorksHtml += "<li>" + HowItWorks[h] + "</li>";


                    }
                    HowItWorksHtml += "</ul>";
                }
                $("#howitworks").html(HowItWorksHtml);
            }
            else {
                $("#Tabhowitworks").css({ display: "none" });
                $("#howitworks").addClass("none");
            }
            //////////////////End for howitworks///////////////////

            var vTitle = list[i].PassType == "Regular" ? "" : (list[i].PassType == "Party" ? "Group rates" : (list[i].PassType == "Saver" ? "3-5 persons" : ""));
            if (i == 0) {
                //if (list.length > 1)
                html += "<li class='active' rel='" + list[i].PassType + "'>" + list[i].PassType + " Pass </li>";
            }
            else {
                html += "<li rel='" + list[i].PassType + "' data-toggle='tooltip' data-placement='auto top' title='" + vTitle + "'>" + list[i].PassType + " Pass </li>";
            }
        }
        if (hasPormotion != "")
            html += "<li rel='offer' data-toggle='tooltip' data-placement='auto top' title='" + hasPormotion.split(';')[3] + "' onclick='ChangePassDetails(\"" + $.trim(hasPormotion) + "\");'>" + hasPormotion.split(';')[3] + "</li>";
        html += "</ul>";
        ////Closed #UL# label of Family type (eg. Regular, saver, party)

        html += "<div class='clearfix'></div>";
        
        ////start #rates_tab_container# This for loop contains label of passenger type according to family type (eg. Regular-Adult, Regular-Youth, Regular-senior, saver-Adult, saver-Youth etc)
        for (var i = 0; i < list.length; i++) {
            html += "<div class='rates_tab_container' id='" + list[i].PassType + "'>";

            ////Here all passenger type according to family type (eg. Regular-Adult, Regular-Youth, Regular-senior, saver-Adult, saver-Youth etc)
            html += "<ul class='tabs'>";
            for (var j = 0; j < list[i].FamilyPassList.length; j++) {

                var BgColour = list[i].FamilyPassList[j].PassengerType == "Adult" ? "#3878a1" : (list[i].FamilyPassList[j].PassengerType == "Youth" ? "#757a3e" : "#999");
                if (j == 0)
                    html += "<li class='active' rel='" + list[i].PassType + "_" + list[i].FamilyPassList[j].PassengerType + "' style='background-color: " + BgColour + ";'>" + list[i].FamilyPassList[j].PassengerType + "</li>";
                else
                    html += "<li rel='" + list[i].PassType + "_" + list[i].FamilyPassList[j].PassengerType + "' style='background-color: " + BgColour + ";'>" + list[i].FamilyPassList[j].PassengerType + "</li>";
            }
            html += "</ul>";
            html += "<div class='clearfix'></div>";
             
            ///Start #tabs_content_container# price container for passenger type wise tabs_content_container
            html += "<div class='tabs_content_container'>";
            //for (var i = 0; i < list.length; i++) {
            if (list[i].FamilyPassList.length > 0) {
                var FamilyPassList = list[i].FamilyPassList;
                for (var j = 0; j < FamilyPassList.length; j++) {

                    if (FamilyPassList[j].PassengerList.length > 0) {
                        var PassengerList = FamilyPassList[j].PassengerList;
                        ///Start #tab_detail
                        html += "<div class='tab_detail' id='" + list[i].PassType + "_" + FamilyPassList[j].PassengerType + "'>";
                        html += "<div class='age_info'><strong>" + FamilyPassList[j].PassengerType + "s are aged " + (FamilyPassList[j].AgeLimit + " yrs") + "</strong></div>";
                        html += "<div class='condition_btn'><i class='fa fa-info-circle' aria-hidden='true'></i>Conditions Apply</div>";
                        html += "<div class='clearfix'></div>";

                        var infoSplit = PassengerList[0].Info;
                        //Start #condition_details	
                        var strCondition = "";
                        //if (list[i].FamilyPassList[0].PassengerList[0].PassList[0].ProductList[0].FamilyId == "101167")
                        //	strCondition = " style='display:block'";

                        html += "<div class='condition_details'" + strCondition + ">";
                        html += infoSplit;
                        //close #condition_details
                        html += "</div>";
                        html += "<div class='clearfix' style='height: 20px'></div>";
                        //start UL pass_fare_list
                        html += "<ul class='pass_fare_list ez_checkbox'>";
                        // Consecutive and Flexi loop here
                        for (var p = 0; p < PassengerList.length; p++) {
                            var Ids = list[i].PassType + '_' + PassengerList[p].Type + FamilyPassList[j].PassengerType;
                            if (PassengerList[p].PassList.length > 0) {
                                var PassList = PassengerList[p].PassList;
                                for (var r = 0; r < PassList.length; r++) {
                                    //start li#fade_anim days basis price
                                    html += "<li class='fade_anim'>";
                                    var OfferClass = PassList[r].OfferDescription == "" ? "offer" : "offer";
                                    html += "<div class='passduration'><span class='fade_anim'>" + PassList[r].ProductName + "</span></div>";
                                    html += "<div class='passfare'>";
                                    if (PassList[r].ProductList.length > 0) {
                                        var ProductList = PassList[r].ProductList;
                                        for (var k = 0; k < ProductList.length; k++) {
                                            var PassClass = ProductList[k].PassClass == "1" ? "1" : "2";
                                            var PassClass1 = ProductList[k].PassClass == "1" ? "1st" : "2nd";
                                            var RadioValue = ProductList[k].FamilyName + ";" +  //[0] Pass Name
                                                list[i].PassType + ":" + (list[i].PassType == "Saver" ? list[i].LblFamily : "") + ";" +//[1] PassType(Regular/Saver/Party)
                                                ProductList[k].DefaultPassengerType + ";" +     //[2] PassengerType(Adult/Youth/Senior)
                                                ProductList[k].ProductName + ";" +              //[3] ProductName
                                                PassClass1 + " " + "Class" + ";" +                //[4] PassClass
                                                ProductList[k].SellCurrency + ";" +             //[5] Sellcurrency
                                                ProductList[k].SellAdultPrice + ";" +           //[6] SellAdultAmount
                                                ProductList[k].SellChildPrice + ";" +           //[7] SellChildAmount
                                                ProductList[k].ChildFree + ";" +                //[8] Child Free 
                                                ProductList[k].ExchangeRate + ";" +             //[9] ROE
                                                ProductList[k].Price + ";" +                    //[10]NetAdultAmount
                                                ProductList[k].NetCurrency + ";" +              //[11]NetCurrency
                                                ProductList[k].ProductId + ";" +                //[12]ProductId(eg. 3 Days Pass Id)
                                                ProductList[k].ChildProductId + ";" +           //[13]Child ProductId
                                                ProductList[k].CountriesSelected + ";" +        //[14]if 2,3,4 countries selected
                                                ProductList[k].FamilyId + ";" +                 //[15]Family id(eg. global eurail pass)
                                                ProductList[k].ChildAgelbl + ";" +              //[16]Child age
                                                ProductList[k].AgeLimit + ";" +                 //[17]Adult age
                                                ProductList[k].NetChildPrice;                   //[18]NetChildAmount
                                            var displayRate = ProductList[k].NetCurrency == ProductList[k].SellCurrency ? "" : "(" + ProductList[k].SellCurrency + "&nbsp;" + ProductList[k].SellAdultPrice + ")";//here ignoring display currency
                                            //html += "<div class='pass_rate'><label><div class='ez-radio'><input id='radio_" + Ids + "_" + r + "_" + k + "' type='radio' value='" + encodeURIComponent(RadioValue) + "' name='adultrate' class='ez-hide' onclick ='checkRadio(this.id)'></div> Class " + PassClass + " : <span>" + ProductList[k].NetCurrency + "&nbsp;" + ProductList[k].Price + "</span> " + displayRate + "</label> </div>";
                                            html += "<div class='pass_rate'><label><div class='ez-radio'><input id='radio_" + Ids + "_" + r + "_" + k + "' type='radio' value='" + encodeURIComponent(RadioValue) + "' name='adultrate' class='ez-hide' onclick ='checkRadio(this.id); PopUpOffer(this.id);'></div> Class " + PassClass + " : <span>" + ProductList[k].NetCurrency + "&nbsp;" + ProductList[k].Price + "</span> " + displayRate + "</label> </div>";
                                            //html += "<div class='pass_rate'><label><div class='ez-radio'><input type='radio' name='adultrate' class='ez-hide'></div> Class 2 : <span>CHF 216</span> (<i class='fa fa-inr'></i>14624)</label></div>";                                            
                                            //offer detail here
                                            if (ProductList[k].OfferDescription != "") {
                                                html += "<a class='fancybox_trig' href='#divOffer_" + Ids + "_" + r + "_" + k + "' id='anchOffer_" + Ids + "_" + r + "_" + k + "' style='display:none'></a>";
                                                html += "<div style='display: none' class='fancy_inline_display' id='divOffer_" + Ids + "_" + r + "_" + k + "'>";

                                                html += "<div class='eventpopup black_txt'>";

                                                html += "<div class='container-fluid'>";
                                                html += "<div class='row event_tl white_txt text-uppercase'>SWISSTOURS' SUPER SAVER OFFER</div>";

                                                //html += "<div class='row event_details'>";
                                                //html += "<div class='event_date lightgray_texture'><strong> Book and get <strong class='red_txt'>CHF 20 Off</strong> on" + ProductList[k].ProductName + " with below mountains</strong> </div>";
                                                //html += "<div class='event_date'>Jungfraujoch<sup class='red_txt'>*</sup>, Titles<sup class='red_txt'>*</sup>, Galacier paradise<sup class='red_txt'>*</sup><br>+ any other</div>";
                                                //html += "</div>";

                                                //html += "<div class='row event_note'>";
                                                //html += "<span class='red_txt'><sup>*</sup>Offer is conjustion on booking of above lsited mountains only</span><br>";                                                
                                                //html += "Travel Date 1<sup>st</sup> May 2018 to 30 June 2018.";
                                                //html += "</div>";
                                                //html += "<div class='row'>";
                                                html += ProductList[k].OfferDescription.replace("XXXX", ProductList[k].ProductName);
                                                //html += "</div>";
                                                html += "</div>";

                                                html += "</div>";

                                                html += "</div>";
                                            }
                                        }
                                    }
                                    //html += "<div class='pass_rate'> <label><input type='radio' name='adultrate'> Class 2 : <span>" + PassList[r].NetCurrency + "&nbsp;" + PassList[r].NetCurrency + "/span> (<i class='fa fa-inr'></i>14624)</label> </div>";
                                    html += "<a class='cta btn pass_bookbtn fade_anim' id='btn_" + Ids + "_" + r + "' href='#'>Book now</a>";
                                    html += "</div>";
                                    html += "</li>";
                                    //close li#fade_anim
                                }

                            }

                        }
                        html += "</ul>";
                        
                        //close ULfare/price
                        html += "<div class='clearfix'></div>";
                        html += "</div>";
                        ///closed #tab_detail
                    }

                }

            }

            //}

            html += "<div class='clearfix'></div>";
            html += "</div>";
            ///Closed #tabs_content_container# price container for passenger type wise 

            html += "</div>";
            ////Closed #rates_tab_container# This for loop contains label of passenger type according to family type (eg. Regular-Adult, Regular-Youth, Regular-senior, saver-Adult, saver-Youth etc)
        }
    }
    $("#divPassDetails").html(html);

    closeProgressIndicator();
    /*  Pass Type Tabs  */
    $(".rates_tab_container").hide();
    $(".rates_tab_container:first").show();
    $(".tab_detail").hide();
    $('#Regular').children('.tabs_content_container').children('.tab_detail').eq(0).show();

    $(".pass_types li").click(function () {
        $(".rates_tab_container").hide();
        var activeTab = $(this).attr("rel");
        $("#" + activeTab).show();
        $(".pass_types li").removeClass("active");
        $(this).addClass("active");
        $(".tab_detail").hide();
        $("#" + activeTab).children('.tabs_content_container').children('.tab_detail').eq(0).show();

        $("#" + activeTab).children('.tabs').children('li').eq(0).addClass('active');
        $("#" + activeTab).children('.tabs').children('li').eq(0).siblings('li').removeClass('active');
    });

    $(".tabs li").click(function () {
        $(".tab_detail").hide();
        var activeTab_1 = $(this).attr("rel");
        $("#" + activeTab_1).show();
        $(".tabs li").removeClass("active");
        $(this).addClass("active");
    })

    /*  Conditions  */

    $('.condition_btn').click(function () {
        $('.condition_details').slideToggle();
    })
    $('.closeBtn').click(function () {
        $('.condition_details').slideToggle();
        if ($(window).width() < 992) { $('html,body').animate({ scrollTop: $('.tabs').offset().top - 160 }, 600) }
        else { $('html,body').animate({ scrollTop: $('.tabs').offset().top - 200 }, 600) }
    })
    /* Selection fare */
    $(".pass_fare_list label").click(function () {
        $(".pass_fare_list label").css({ color: '#333', fontWeight: '400' });
        $(this).css({ color: '#cc0000', fontWeight: '700' });
        $(this).parents('li').siblings().removeClass('selected');
        $(this).parents('li').addClass('selected');
    });
    /*  Jump to links  */
    $('.jumpto_links a').on('click', function (event) {
        var target = $($(this).attr('href'));
        if (target.length) {
            event.preventDefault();
            if ($(window).width() < 992) { $('html,body').animate({ scrollTop: target.offset().top - 190 }, 600) }
            else { $('html,body').animate({ scrollTop: target.offset().top - 220 }, 600) }
        }
    });
    $('[data-toggle="tooltip"]').tooltip();
    InterLinkKeyword();
}
function OfferDisplay(id) {

    if (document.getElementById(id.id).style.display == "none") {

        document.getElementById(id.id).style.display = "block";
    } else {
        document.getElementById(id.id).style.display = "none";
    }
}
function ShowPasses(id) //When click on Adult/Senior/Youth subcategory then this functionality used
{
    var ids = id.split('_');
    var divId = "divPassFamily_" + ids[1] + "_" + ids[2];
    var liId = "li_" + ids[1] + "_" + ids[2];

    for (var i = 0; i < 3; i++) {
        try {
            document.getElementById("divPassFamily_" + ids[1] + "_" + i).style.display = "none";
        } catch (ex) { }
        try {
            document.getElementById("li_" + ids[1] + "_" + i).className = "padding_tab resp-tab-item ";
        } catch (ex) { }
    }
    document.getElementById(liId).className = "padding_tab resp-tab-item resp-tab-active";
    document.getElementById(divId).style.display = "block";
}

function ShowPassFamily(id) { //When click on Regular/Party/Saver Main category then this functionality used
    var ids = id.split('_');
    var divId = "divPass_" + ids[1];
    var liId = "li_" + ids[1];
    var ulId = "ul_" + ids[1];
    var arrowdisplayId = "arrowdisplay_" + ids[1];
    for (var i = 0; i < 3; i++) {
        try {
            document.getElementById("divPass_" + i).style.display = "none";
        } catch (ex) { }
        try {
            document.getElementById("li_" + i).className = "padding_tab resp-tab-item ";
        } catch (ex) { }
        try {
            document.getElementById("ul_" + i).style.display = "none";
        } catch (ex) { }
        try {
            document.getElementById("arrowdisplay_" + i).style.display = "none";
        } catch (ex) { }
    }
    document.getElementById(liId).className = "padding_tab resp-tab-item resp-tab-active";
    document.getElementById(divId).style.display = document.getElementById(ulId).style.display = document.getElementById(arrowdisplayId).style.display = "block";
}

function showhideFun(id) {
    var spid = id.split('_');
    var ids = 'Div_' + spid[1] + "_" + spid[2] + "_" + spid[3];
    var spn = 'spn_' + spid[1] + "_" + spid[2] + "_" + spid[3];
    $("#" + ids).toggle("slow");
    if (document.getElementById(spn).className == "tog minus") {
        document.getElementById(spn).className = "tog plus";
    }
    else {
        document.getElementById(spn).className = "tog minus";
    }

    return false;
}


function showMoreInfo(id, v) {
    var spid = id.split('_');
    var ids = 'moreinfo_' + spid[1] + "_" + spid[2] + "_" + spid[3];
    $("#" + ids).toggle("slow");
    if (v == 1) {
        document.getElementById(id).style.display = "none";
    }
    else { document.getElementById(id).style.display = "inline-block"; }
    return false;
}

function checkRadio(id)//Radion Button functionality
{

    if (document.getElementById("ContentPlaceHolder_hdnRate").value != "") {
        try {
            document.getElementById(document.getElementById("ContentPlaceHolder_hdnRate").value).href = "#";
        }
        catch (ex) { }

    }
    var spnId = id.replace('radio', 'spnPrice');
    var lblId = id.replace('radio', 'lbl');
    var str = lblId.substring(0, lblId.length - 2);
    //document.getElementById(str).innerHTML = document.getElementById(spnId).innerHTML;

    var btnId = str.replace('lbl', 'btn');
    var OtherDetails = document.getElementById(id).value;
    document.getElementById("ContentPlaceHolder_hdnRate").value = btnId;
    document.getElementById(btnId).href = "/PassMtEx/Rail-PassCal.aspx?OtherDetails=" + OtherDetails + "&cntry=" + document.getElementById("ContentPlaceHolder_hdnCountryCode").value;
    var rdoSelected = $("ul.pass_fare_list li.fade_anim div.passfare div.pass_rate label div.ez-selected")
    $(rdoSelected).each(function () {
        $(this).removeClass("ez-selected");
    });
    //$("ul.pass_fare_list li").find('ez-selected');
    $($('#' + id).parent()).addClass('ez-selected');
}
function PopUpOffer(id) {
    var divOfferId = id.replace('radio', 'divOffer');
    var anchOfferId = id.replace('radio', 'anchOffer');
    if ($.trim($('#' + divOfferId).html()) != "") {
        $('#' + anchOfferId).fancybox({ "touch": false }).trigger("click");
    };
}

//////////////////////////////////////////////////////////////////////////////2-3-4 Country code//////////////////////////////////////////////////////////////////////////////////////

function ShowCountries() { //2,3,4 countries pass functionality

    var id = document.getElementById("ContentPlaceHolder_hdnFamilyId").value;
    //var ddlCountryCount = (id == '101102' ? 2 : (id == '101106' ? 3 : 4));
    //var ddlCountryCount = (id == ('101102' && '101103') ? 2 : (id == ('101106' && '101114') ? 3 : 4));
    //2 coutry=101102,101103,101104
    //3 coutry=101106,101114,101108
    //4 coutry=101040,101042,101041
    var ddlCountryCount = 0;
    switch (id) {
        case '101102':
        case '101103':
        case '101104':
            ddlCountryCount = 2;
            break;
        case '101106':
        case '101114':
        case '101108':
            ddlCountryCount = 3;
            break;
        case '101040':
        case '101042':
        case '101041':
            ddlCountryCount = 4;
            break;
        default:
            ddlCountryCount = 4;
            break;
    }

    var html = "";
    for (var q = 0; q < 4; q++) { var divid = 'divCountry' + (q + 1); $('#' + divid).html(""); }//removing from all div data then binding according to selected country

    for (var j = 0; j < ddlCountryCount; j++) {
        var ddlid = 'ddlCountry' + (j + 2);
        var divid = 'divCountry' + (j + 1);
        var array = ['first', 'second', 'thrid', 'fouth'];
        html = "<div class='form-group'>";
        html += "<select class='form-control selectpicker' title='Select the " + array[j] + " country' id='ddlCountry" + (j + 1) + "' onchange='FillCountry(" + ddlid + ", this.id);'>";
        html += "<option>Select the " + array[j] + " country</option>";
        html += "</select>";
        html += "</div>";
        $('#' + divid).html(html);
    }

    $("#btnCountrySubmit").attr("onclick", "return chkCntry();");
    FillCountry(document.getElementById("ddlCountry1"), "");

    //for (var j = 0; j < ddlCountryCount; j++) {
    //    var ddlid = 'ddlCountry' + (j + 2);
    //    html += "<select id ='ddlCountry" + (j + 1) + "' onchange='FillCountry(" + ddlid + ", this.id)'><option>Country" + (j + 1) + "</option></select>";
    //}
    //html += "<div style='text-align: center;'>";
    //html += "<button type='button' id='scOkBtn' runat='server' class='red_bttn_small' onclick='return chkCntry();'>OK</button>";
    //html += "</div>";
    //document.getElementById("ContentPlaceHolder_Divddl").innerHTML = html;
    //FillCountry(document.getElementById("ddlCountry1"), "");
    $('.selectpicker').selectpicker('refresh');
}
function FillCountry(control, ddlCountryVal) { //Fill countries in dropdown box

    var id = $("#ContentPlaceHolder_hdnFamilyId").val();
    if (ddlCountryVal != "") {
        ddlCountryVal = document.getElementById(ddlCountryVal).value;
        document.getElementById(control.id).options.length = 0;
    }
    //var ddlCountryCount = (id == '101102' ? 2 : (id == '101106' ? 3 : 4));
    //2 coutry=101102,101103,101104
    //3 coutry=101106,101114,101108
    //4 coutry=101040,101042,101041
    var ddlCountryCount = 0;
    switch (id) {
        case '101102':
        case '101103':
        case '101104':
            ddlCountryCount = 2;
            break;
        case '101106':
        case '101114':
        case '101108':
            ddlCountryCount = 3;
            break;
        case '101040':
        case '101042':
        case '101041':
            ddlCountryCount = 4;
            break;
        default:
            ddlCountryCount = 4;
            break;
    }
    var AllCountiesName = "";
    for (var j = 0; j < ddlCountryCount; j++) {
        if (document.getElementById("ddlCountry" + (j + 1)).selectedIndex != 0)
            $("#ddlCountry" + (j + 1)).removeClass('highlight_error');
        AllCountiesName += document.getElementById("ddlCountry" + (j + 1)).value + ",";
    }
    $('.selectpicker').selectpicker('refresh');
    $.ajax({
        type: "POST",
        url: "/PassMtEx/Rail-Pass.aspx/PopulateCountries",
        data: '{FamilyId: ' + id + ', CountryId: "' + ddlCountryVal + '",AllCountiesName:"' + AllCountiesName + '"}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            OnCountryPopulated(data, control)
        },
        failure: function (response) {
            alert(response.d);
        }
    });
}

function OnCountryPopulated(response, select) {

    var list = $.parseJSON(response.d);
    var option;
    if (list.length > 0) {
        //if (select.id != 'ddlCountry1') {
        //    option = document.createElement('option');
        //    option.value = option.text = select.id.replace("ddl", "");
        //    select.add(option);
        //}
        for (var i = 0; i < list.length; i++) {
            option = document.createElement('option');
            option.value = option.text = list[i].Country;
            select.add(option);
        }
    }
    $('.selectpicker').selectpicker('refresh');

}

function chkCntry() {

    //2 coutry=101102,101103,101104
    //3 coutry=101106,101114,101108
    //4 coutry=101040,101042,101041
    var id = document.getElementById("ContentPlaceHolder_hdnFamilyId").value;
    if (id == '101102' || id == '101106' || id == '101040' || id == '101042' || id == '101114' || id == '101103' || id == '101104' || id == '101108' || id == '101041') { //2,3,4 country pass functionality to validate the country when user not selecting the country
        //var cntryno = (id == '101102' ? 2 : (id == '101106' ? 3 : 4));
        //var cntryno = (id == ('101102' || '101103') ? 2 : (id == ('101106' || '101114') ? 3 : 4));
        var cntryno = 0;
        switch (id) {
            case '101102':
            case '101103':
            case '101104':
                cntryno = 2;
                break;
            case '101106':
            case '101114':
            case '101108':
                cntryno = 3;
                break;
            case '101040':
            case '101042':
            case '101041':
                cntryno = 4;
                break;
            default:
                cntryno = 4;
                break;
        }
        for (var i = 1; i <= parseInt(cntryno); i++) {
            if (document.getElementById("ddlCountry" + i).selectedIndex == 0) {
                $("#ddlCountry" + i).focus();
                $("#ddlCountry" + i).addClass("highlight_error");
                $('.selectpicker').selectpicker('refresh');
                return false;
            }

        }
    }
    DisplayPassRates(id);
    document.getElementById("ContentPlaceHolder_divselectCountry").style.display = "none";
    return true;
}

/////////////////////////////////////////////////////////////////////////////////////////////////////Rail-PassCal.aspx////////////////////////////////////////////////////////////////////
function AddAdult() {

    if (document.getElementById("ContentPlaceHolder_CldRow").style.display != "none") {

        AddChild(); //Add child based on no. of adult count
        document.getElementById('select-container').innerHTML = "";
    }
    CalcAmount();//Calculate price (Adult + Child)
}

function AddChild() {//Add child based on no. of adult count	
    var PassType = document.getElementById('ContentPlaceHolder_hdnTypeOfPass').value;
    var id = document.getElementById("ContentPlaceHolder_hdnFamilyId").value;
    //if you select swiss travel pass & swiss travel pass print at home pass then child should be "10" and if you select party then child should be same as adult and other passes child should be display multiple by adult into 2
    var ChildCount = ((id == "100715" || id == "101167" || id == "101120") ? 10 : (PassType == 'Party' ? document.getElementById('ContentPlaceHolder_Adultnum').value : document.getElementById('ContentPlaceHolder_Adultnum').value * 2));
    ChildCount = ChildCount > 10 ? 10 : ChildCount;

    var optionsAsString = "";
    document.getElementById("ContentPlaceHolder_drpChld").options.length = 0;
    var chdRange = $("#ContentPlaceHolder_hdnChildRange").val();
    for (var i = 0; i <= ChildCount; i++) {
        var iText = i;
        if (i == 0)
            iText = "Children (" + chdRange + " yrs)";
        else
            iText = i == 1 ? i + " Child (" + chdRange + " yrs)" : i + " Children (" + chdRange + " yrs)";

        optionsAsString += "<option value='" + i + "'>" + iText + "</option>";
    }
    $('#ContentPlaceHolder_drpChld').append(optionsAsString);
    $('.selectpicker').selectpicker('refresh');
}

///<Author>Rajanikant bhanu</Author>
///<InseretedDate>11 Feb 2019 12:55</InseretedDate>
///<AuthorRemarks>
///below function is being called on apply button on Rail-PassCal.aspx page and validating the code from code_master and accordingly applying discount"
///</AuthorRemarks>
///<ApprovedBy></ApprovedBy>
function applyPromo() {
    if ($.trim($('#ContentPlaceHolder_txtOfferCode').val()) != "") {
        $.ajax({
            type: "POST",
            url: "Rail-PassCal.aspx/ValidatePromoCode",
            data: '{PromoCode: "' + $('#ContentPlaceHolder_txtOfferCode').val() + '"}',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                debugger;
                if (response.d == "Yes") {
                    isCodeValid = "Yes";
                    $("#spnDiscountHeading").html("Discount<br>(CHF 100)")
                    //document.getElementById("ContentPlaceHolder_liofferCode").style.display = "block";
                    var disVal = 100 * parseFloat($('#ContentPlaceHolder_hdnROE').val()).toFixed(0);
                    DisAmt = "SW" + disVal;
                    DisAmt = DisAmt.split('SW');
                    flag = 0;
                }
                else {
                    isCodeValid = "No";
                }
                CalcAmount();

            },
            failure: function (response) {
                $("#ContentPlaceHolder_lbloffer").html("Offer code is invalid");
                flag = 1;
            }
        });
    }
    return false;
}
function CalcAmount() //Calculate price (Adult + Child)
{
    debugger;
    //var chkchild = 0;
    var FamilyCardChild = 0;
    var strSelectedChildAges = '';
    var adult = 1; child = 0; var FamilyCard = ""; var FamilyCardChildVal = "";
    if (document.getElementById("ContentPlaceHolder_Adultnum").value != '')
        adult = parseFloat(document.getElementById("ContentPlaceHolder_Adultnum").value, 0) == 0 ? 1 : parseFloat(document.getElementById("ContentPlaceHolder_Adultnum").value, 0);

    document.getElementById("ContentPlaceHolder_hdnFamilyCardChild").value = FamilyCardChild;
    child = parseInt(document.getElementById("ContentPlaceHolder_drpChld").value, 0);
    var AllowChild = 0;
    var FamilyId = document.getElementById("ContentPlaceHolder_hdnFamilyId").value;

    for (var i = 1; i <= document.getElementById("ContentPlaceHolder_drpChld").value; i++) {
        if (FamilyId == "100715" || FamilyId == "101167" || FamilyId == "101120" || FamilyId == "101161" || FamilyId == "100942") {
            var chkbox = "chkchd" + i;
            if (document.getElementById(chkbox).checked == false) {
                $($('#' + chkbox).parent()).removeClass('ez-checked-select');
                FamilyCard = "0";

                if (parseInt(document.getElementById("drpChld" + i).value, 0) >= parseInt(document.getElementById("ContentPlaceHolder_hdnFromChildAge").value, 0)) {
                    AllowChild++;
                }

            }
            else {
                $($('#' + chkbox).parent()).addClass('ez-checked-select');
                //if chk box is available and uncheck with parent then familycard value should be "1"
                FamilyCardChild++;
                document.getElementById("ContentPlaceHolder_hdnFamilyCardChild").value = FamilyCardChild;
                FamilyCard = "1";
            }
            FamilyCardChildVal += FamilyCard + ",";
        }
        else if (FamilyId == "100029")//this is for global pass..
        {
            FamilyCardChild++;
            document.getElementById("ContentPlaceHolder_hdnFamilyCardChild").value = FamilyCardChild;
            FamilyCard = "1";
            FamilyCardChildVal += FamilyCard + ",";
        }
        if (document.getElementById("drpChld" + i).value != "0")
            strSelectedChildAges = strSelectedChildAges == "" ? document.getElementById("drpChld" + i).value : strSelectedChildAges + "|" + document.getElementById("drpChld" + i).value;
    }
    //child = chkchild;
    document.getElementById("ContentPlaceHolder_hdnSelectedChildAges").value = strSelectedChildAges;
    document.getElementById("ContentPlaceHolder_hdnFamilyCard").value = FamilyCardChildVal.substring(0, FamilyCardChildVal.length - 1);

    var AdultAmount = (adult * parseFloat(document.getElementById("ContentPlaceHolder_hdnAdultAmount").value, 0)).toFixed(2);
    var ChildAmount = 0;
    if (FamilyId == "100715" || FamilyId == "101167" || FamilyId == "101120" || FamilyId == "101161" || FamilyId == "100942") {
        ChildAmount = (parseFloat(AllowChild, 0) * parseFloat(document.getElementById("ContentPlaceHolder_hdnChdAmount").value, 0)).toFixed(2);
    }
    else {
        if (document.getElementById("ContentPlaceHolder_drpChld").value != "") {
            ChildAmount = (parseFloat(document.getElementById("ContentPlaceHolder_drpChld").value, 0) * parseFloat(document.getElementById("ContentPlaceHolder_hdnChdAmount").value, 0)).toFixed(2);
        }
    }
    var Amount = (parseFloat(AdultAmount, 0) + parseFloat(ChildAmount, 0));
    var BookingFee = document.getElementById("ContentPlaceHolder_hdnBookingFee").value * (adult + AllowChild);
    $("#ContentPlaceHolder_lblBookingfee").html(BookingFee);

    var DiscountPP = document.getElementById("ContentPlaceHolder_hdnDiscountPP").value * adult;
    $("#ContentPlaceHolder_lblDiscountPPTotal").html(DiscountPP);
    //Amount = Amount - parseFloat(DiscountPP, 0);

    $("#ContentPlaceHolder_lblInitialAmount1").html(Amount);
    //if (Amount >= 28000) {
    //if (Amount >= 19000) {
    //	document.getElementById("ContentPlaceHolder_divOfferCode").style.display = "block";
    //}
    //else {
    //	document.getElementById("ContentPlaceHolder_divOfferCode").style.display = "none";
    //	//document.getElementById("ContentPlaceHolder_Divtkt").style.display = "none";
    //	document.getElementById("ContentPlaceHolder_txtOfferCode").value = "";
    //}
   
    ///<Author>Rajanikant bhanu</Author>
    ///<InseretedDate>11 Feb 2019 12:55</InseretedDate>
    ///<AuthorRemarks>
    ///Here changed the way of applying the promo code.. because there is 2 promo offers are going on(e.g. SW500,SW750,SW1000 and a code which is depend on aprtment booking)"
    ///Code which a customer got at the time of aprtment booking will apply only on SWISS TRAVEL PASS and SW500,SW750,SW1000 these code will apply on rest of passes.
    ///</AuthorRemarks>
    ///<ApprovedBy></ApprovedBy>
    var flag = 1;
    $("#ContentPlaceHolder_lbloffer").html("");
    if (document.getElementById("ContentPlaceHolder_txtOfferCode").value != "") {
        
        if (isCodeValid == "Yes" && FamilyId == "100715") {
            $("#ContentPlaceHolder_lbloffer").html("Offer code applied");
            flag = 0;
        }  
        //else {
        //    if (parseInt($("#ContentPlaceHolder_lblInitialAmount1").html()) >= 49999 && parseInt($("#ContentPlaceHolder_lblInitialAmount1").html()) <= 68998) {
        //        if ($.trim(document.getElementById("ContentPlaceHolder_txtOfferCode").value) == "SW4100") {
        //            $("#ContentPlaceHolder_lbloffer").html("");
        //            flag = 0;
        //        }
        //        else {
        //            $("#ContentPlaceHolder_lbloffer").html("Offer code is invalid");
        //            flag = 1;
        //        }
        //    }           
        //    else if (parseInt($("#ContentPlaceHolder_lblInitialAmount1").html()) >= 68999) {
        //        if ($.trim(document.getElementById("ContentPlaceHolder_txtOfferCode").value) == "SW6500" || $.trim(document.getElementById("ContentPlaceHolder_txtOfferCode").value) == "SW4100") {
        //            $("#ContentPlaceHolder_lbloffer").html("");
        //            flag = 0;
        //        }
        //        else {
        //            $("#ContentPlaceHolder_lbloffer").html("Offer code is invalid");
        //            flag = 1;
        //        }
        //    }
        //    DisAmt = document.getElementById("ContentPlaceHolder_txtOfferCode").value.split('SW');
        //}    
        // below code commented.. if need to full fill below open the same
        else {
            if (parseInt($("#ContentPlaceHolder_lblInitialAmount1").html()) >= 19000 && parseInt($("#ContentPlaceHolder_lblInitialAmount1").html()) <= 39999) {
                if ($.trim(document.getElementById("ContentPlaceHolder_txtOfferCode").value) == "SW500") {
                    $("#ContentPlaceHolder_lbloffer").html("");
                    flag = 0;
                }
                else {
                    $("#ContentPlaceHolder_lbloffer").html("Offer code is invalid");
                    flag = 1;
                }
            }
            else if (parseInt($("#ContentPlaceHolder_lblInitialAmount1").html()) >= 40000 && parseInt($("#ContentPlaceHolder_lblInitialAmount1").html()) <= 59999) {

                if ($.trim(document.getElementById("ContentPlaceHolder_txtOfferCode").value) == "SW750" || $.trim(document.getElementById("ContentPlaceHolder_txtOfferCode").value) == "SW500") {
                    $("#ContentPlaceHolder_lbloffer").html("");
                    flag = 0;
                }
                else {
                    $("#ContentPlaceHolder_lbloffer").html("Offer code is invalid");
                    flag = 1;
                }
            }
            else if (parseInt($("#ContentPlaceHolder_lblInitialAmount1").html()) >= 60000) {
                if ($.trim(document.getElementById("ContentPlaceHolder_txtOfferCode").value) == "SW750" || $.trim(document.getElementById("ContentPlaceHolder_txtOfferCode").value) == "SW500" || $.trim(document.getElementById("ContentPlaceHolder_txtOfferCode").value) == "SW1000") {
                    $("#ContentPlaceHolder_lbloffer").html("");
                    flag = 0;
                }
                else {
                    $("#ContentPlaceHolder_lbloffer").html("Offer code is invalid");
                    flag = 1;
                }
            }
            DisAmt = document.getElementById("ContentPlaceHolder_txtOfferCode").value.split('SW');
        }        
    }
    var DiscountAmt = 0;

    if (parseFloat(DisAmt[1], 0) > 0 && flag == 0) {
        document.getElementById("ContentPlaceHolder_liofferCode").style.display = "block";
        document.getElementById("ContentPlaceHolder_lblOfferTotal").innerHTML = DisAmt[1];
        document.getElementById("ContentPlaceHolder_hdnOfferDiscount").value = DisAmt[1];
    }
    else {
        document.getElementById("ContentPlaceHolder_liofferCode").style.display = "none";
        document.getElementById("ContentPlaceHolder_lblOfferTotal").innerHTML = 0;
        document.getElementById("ContentPlaceHolder_hdnOfferDiscount").value = 0;
    }
    DiscountAmt = Amount - (((flag == 1) ? 0 : parseFloat(DisAmt[1], 0)) + parseFloat(DiscountPP, 0));

    var AmountWithDeliveryAmt = (parseFloat(DiscountAmt, 0) + parseFloat(document.getElementById("ContentPlaceHolder_hdnDeliveryFee").value, 0)) + BookingFee;
    document.getElementById("ContentPlaceHolder_lblAmount").innerHTML = AmountWithDeliveryAmt;
    var BankCharge = Math.ceil(parseFloat(AmountWithDeliveryAmt, 0) * parseFloat(document.getElementById("ContentPlaceHolder_hdnBankCharge").value, 0) / 100);
    document.getElementById("ContentPlaceHolder_lblBankChargeAmt").innerHTML = BankCharge;
    document.getElementById("ContentPlaceHolder_hdnTotalAmount").value = document.getElementById("ContentPlaceHolder_lblGrandTotal").innerHTML = (parseFloat(AmountWithDeliveryAmt, 0) + BankCharge);
    return false;
}

function AddChildAge() {//Add child Age dropdown based on no. of Child count
    var NoOfChild = document.getElementById('ContentPlaceHolder_drpChld').value;
    var html = '';
    var ToChildAge = parseInt(document.getElementById("ContentPlaceHolder_hdnToChildAge").value, 0) + 1;
    var FamilyId = document.getElementById("ContentPlaceHolder_hdnFamilyId").value;
    if (NoOfChild > 0) {
        //////////heading for children//////////
        html += "<div class='col-xs-12'>";
        html += "<div class='row' style='margin-bottom: 5px;'>";
        html += "<div class='col-xs-6'>Age : </div>";
        if (FamilyId == "100715" || FamilyId == "101167" || FamilyId == "101120" || FamilyId == "101161" || FamilyId == "100942") {
            html += "<div class='col-xs-6'>With Parent : </div>";
        }
        html += "</div>";
        html += "</div>";

        for (var j = 0; j < NoOfChild; j++) {
            //////////binding here children with or without parent//////////
            html += "<div class='row'>";
            html += "<div class='col-xs-6'>";
            html += "<div class='form-group'>";
            html += "<select ID='drpChld" + (j + 1) + "' class='form-control selectpicker' onchange='javascript:CalcAmount();'>";
            var FromAge = FamilyId == "101120" ? document.getElementById("ContentPlaceHolder_hdnFromChildAge").value : 1;
            html += "<option value='" + 0 + "'>Child " + (j + 1) + "</option>";
            for (var i = FromAge; i < ToChildAge; i++) {
                html += "<option value='" + i + "'>" + i + "</option>";
            }
            html += "</select>";
            html += "</div>";
            html += "</div>";
            ////This is Swiss familycard coding with swiss travel pass & swiss travel pass print at home
            if (FamilyId == "100715" || FamilyId == "101167" || FamilyId == "101120" || FamilyId == "101161" || FamilyId == "100942") {
                html += "<div class='col-xs-6'>";
                html += "<label class='parent_check'><div class='ez-checkbox ez-checked-select'><input ID='chkchd" + (j + 1) + "' type='checkbox' checked='true' class='ez-hide' onclick='javascript:CalcAmount();'></div></label>";
                html += "</div>";
            }
            html += "</div>";
        }
        //html += "<div class='input_box_1' runat='server' id='Ages'>";
        //html += "<div class='input_row1_1'>";
        //html += "<label id='TR0' runat='server'>Age:</label>";
        //for (var j = 0; j < NoOfChild; j++) {
        //    html += "<div class='child_box_1' id='TR1' runat='server'>";
        //    html += "<span class='child_text_1'>Child " + (j + 1) + "</span>";
        //    html += "<select ID='drpChld" + (j + 1) + "' class='select_btn_1'  onchange='javascript:CalcAmount();'>";
        //    var FromAge = FamilyId == "101120" ? document.getElementById("ContentPlaceHolder_hdnFromChildAge").value : 1;
        //    for (var i = FromAge; i < ToChildAge ; i++) {
        //        html += "<option value='" + i + "'>" + i + "</option>";
        //    }
        //    html += "</select>";
        //    html += "</div>";
        //}
        //html += "</div>";

        ////This is Swiss familycard coding with swiss travel pass & swiss travel pass print at home
        //if (FamilyId == "100715" || FamilyId == "101120" || FamilyId == "101161" || FamilyId == "100942") {
        //    html += "<div class='input_row1_1'>";
        //    html += "<label id='Td0' runat='server'>With parent:</label>";
        //    for (var k = 0; k < NoOfChild; k++) {

        //        html += "<div class='check_box_1' id='Td'" + (k + 1) + " runat='server'>";
        //        html += "<span class='check_btn_1'>";
        //        html += "<input type='checkbox' ID='chkchd" + (k + 1) + "' checked='true' runat='server' onclick='javascript:CalcAmount();'/>";
        //        html += "</span>";
        //        html += "</div>";
        //    }
        //    html += '</div>';
        //}
        ////End
        //html += '</div>';
    }
    document.getElementById('select-container').innerHTML = html;
    $('.selectpicker').selectpicker('refresh');
     CalcAmount();
}

