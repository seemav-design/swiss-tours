<%@ Page
    Language="C#"
    MasterPageFile="~/Main.master"
    AutoEventWireup="true"
    CodeFile="Rail-Pass.aspx.cs"
    Inherits="PassMtEx_Rail_Pass"
    Title="Buy Swiss Travel Pass From India | SWISStours"
    MetaDescription="Grab yourself a Switzerland train pass today from SWISStours, a leading Swiss travel agency. Customise your Swiss travel pass online for that pleasant & comfy travel you always wanted. Book today to enlive that majestic experience!"
    MetaKeywords="switzerland train pass, swiss travel pass online, buy swiss travel pass from india" %>

<asp:Content ID="Content1" ContentPlaceHolderID="ContentPlaceHolder" runat="Server">
    <script src="../scripts/Rail-Pass.js?v=20191001PS"></script>
    <div class="row">

        <div class="container-fluid lightgray_texture ex_fix_on_scroll">
            <div class="row maxwidth text-center initial_msg">
                <div class="explore_pass search_forms">
                    <div class="form-group">
                        <div class="input-group">
                            <div class="input-group-addon ic_globe"></div>
                            <asp:DropDownList ID="ddlPassFamily" CssClass="form-control selectpicker" runat="server" DataTextField="FamilyName" DataValueField="FamilyId" title="Explore Other Passes" onchange="ChangePassDetails(this.value)"></asp:DropDownList>
                        </div>
                    </div>
                </div>

            </div>
        </div>
        <div class="clearfix" style="height: 30px" id="sticky-anchor"></div>

        <div class="container-fluid maxwidth content_section_main">

            <div class="content_side_left">

                <div class="inner_content_side">
                    <div class="title" style="float: left;">
                        <h1 id="PassName">Pass Name Here</h1>
                    </div>
                    <div class="clearfix"></div>
                    <p id="PassSortDescription">With a Swiss Travel Pass in your pocket, you have the ideal Rail Pass to travel in Switzerland.</p>

                    <!-- Select Country Pass Form Starts -->

                    <div class="container-fluid country_select_form" style="display: none" id="divselectCountry" runat="server">

                        <div class="row">
                            <div class="col-xs-12 tl red_txt text-center"><strong>Select the countries you want to visit</strong></div>

                            <div class="col-xs-12">
                                <div class="row">
                                    <div class="col-sm-6" id="divCountry1">
                                        <%--<div class="form-group none">
                                            <select class="form-control selectpicker" title="Select the first country">
                                              <option>Country 1</option>
                                                <option>Country 2</option>
                                                <option>Country 3</option>
                                                <option>Country 4</option>
                                            </select>
                                        </div>--%>
                                    </div>

                                    <div class="col-sm-6" id="divCountry2">
                                        <%-- <div class="form-group">
                                            <select class="form-control selectpicker" title="Select the second country" id="ddlCountry2">
                                                <option>Country 1</option>
                                                <option>Country 2</option>
                                                <option>Country 3</option>
                                                <option>Country 4</option>
                                            </select>
                                        </div>--%>
                                    </div>
                                </div>
                            </div>

                            <div class="col-xs-12">
                                <div class="row">
                                    <div class="col-sm-6" id="divCountry3">
                                        <%-- <div class="form-group">
                                            <select class="form-control selectpicker" title="Select the third country" id="ddlCountry3">
                                                <option>Country 1</option>
                                                <option>Country 2</option>
                                                <option>Country 3</option>
                                                <option>Country 4</option>
                                            </select>
                                        </div>--%>
                                    </div>

                                    <div class="col-sm-6" id="divCountry4">
                                        <%--<div class="form-group">
                                            <select class="form-control selectpicker" title="Select the fourth country" id="ddlCountry4">
                                                <option>Country 1</option>
                                                <option>Country 2</option>
                                                <option>Country 3</option>
                                                <option>Country 4</option>
                                            </select>
                                        </div>--%>
                                    </div>
                                </div>
                            </div>

                            <div class="col-xs-12">
                                <a href="#" id="btnCountrySubmit" class="cta btn" style="margin: auto; float: none; width: 150px; display: block;">Submit</a>
                            </div>

                            <div class="clearfix"></div>
                        </div>

                        <div class="clearfix"></div>
                    </div>

                    <!-- Select Country Pass Form Ends -->

                    <div class="jumpto_links">
                        <strong class="red_txt" style="float: left; margin-right: 10px;">Jump to :</strong>
                        <div style="float: left">
                            <a id="Tabbenefits" href="#benefits" class="fade_anim">Benefits</a>
                            <a id="Tabhowitworks" href="#howitworks" class="fade_anim">How its works</a>
                            <a id="TabFaq" href="/Info/FAQ.aspx?Tab=SWISSPASS&cntry=<%=countrycode %>" target="_blank" class="fade_anim">FAQs</a>
                        </div>
                        <div class="clearfix"></div>
                    </div>
                    <div class="clearfix"></div>
                    <div id="divPassDetails">
                    </div>

                    <div class="clearfix"></div>
                    <div class="pass_extra_details" id="benefits">
                        <%-- <div class="heading black_txt"><i class="fa fa-check"></i>Benefits :</div>
                        <ul>
                            <li>Unlimited travel on bus, boat & train within Switzerland</li>
                            <li>Free Entry to over 500 museums.</li>
                            <li>Up to 50% discount on most mountain excursions</li>
                            <li>Free travel on scenic routes with just an additional seat reservation charge.</li>
                            <li>Children under 16 yrs accompanied by at least one parent; travel free with the complimentary Swiss Family Card.</li>
                            <li>Children aged 6 to 16 yrs not accompanied by a parent qualify for a 50% reduction on all Swiss Travel passes.</li>
                            <li>Only persons domiciled outside Switzerland and the Principality of Liechtenstein are entitled to purchase this ticket</li>
                        </ul>--%>
                    </div>

                    <div class="pass_extra_details" id="howitworks">
                        <%--<div class="heading black_txt"><i class="fa fa-check"></i>How it works :</div>
                        <ul>
                            <li>Select the Swiss Travel Pass that suits your travel requirements in terms of number of days & class of travel.</li>
                            <li>Follow the step-by-step booking procedure which allows you to view rates, select total number of passengers and see your total amount payable before you make the final booking.</li>
                            <li>After selection of the pass and submission of your details (name, passport number, courier address, date of travel etc.) you will be directed to the 3D secured payment page where you can make payment by debit/credit card.</li>
                            <li>Effective 1st September 2015, the Swiss Travel Pass is a pre validated & closed dated pass, therefore please enter your start date of travel correctly.</li>
                            <li>Once you have made the payment, you will immediately receive a confirmation email from us.</li>
                            <li>Your Swiss Travel Pass will be couriered to your mentioned postal address within 3-4 working days.</li>
                            <li>If you need help selecting the most appropriate pass you can contact our specialists or write to us at <a href="mailto:contact@swisstours.com">contact@swisstours.com</a></li>
                        </ul>--%>
                    </div>

                    <div class="clearfix"></div>
                </div>

            </div>

            <div class="content_aside">

                <%--Super Saver Promo - Rail Passes--%>
                <div class='asides_box' id="divSupperSaver">
                    <div class="promo_ad_box equate">
                        <div class="tl black_txt">Super Saver Promo - Rail Passes</div>
                        <div class="box_tailtip"></div>
                        <div class="slider_holder">
                            <div class="slider promo_slider">
                                <%--<div class="slide">
                                    <h3 class="red_txt">SAVE <i class="fa fa-inr" aria-hidden="true"></i>4100</h3>
                                    <p>
                                        on a minimum order of <i class="fa fa-inr" aria-hidden="true"></i><strong>49,999</strong>
                                        <br />
                                        <strong>with promo code</strong> <span class="promo_arrow">
                                            <img src="/images/promo_arrow.png" /></span>
                                    </p>
                                    <div class="promocode">
                                        <span>SW4100</span>
                                    </div>
                                </div>

                                <div class="slide">
                                    <h3 class="red_txt">SAVE <i class="fa fa-inr" aria-hidden="true"></i>6500</h3>
                                    <p>
                                        on a minimum order of <i class="fa fa-inr" aria-hidden="true"></i><strong>68,999</strong>
                                        <br>
                                        <strong>with promo code</strong> <span class="promo_arrow">
                                            <img src="/images/promo_arrow.png" /></span>
                                    </p>
                                    <div class="promocode">
                                        <span>SW6500</span>
                                    </div>
                                </div>--%>
                                <div class="slide">
                                    <h3 class="red_txt">SAVE <i class="fa fa-inr" aria-hidden="true"></i>500</h3>
                                    <p>
                                        on a minimum order of <i class="fa fa-inr" aria-hidden="true"></i><strong>19,000</strong>
                                        <br />
                                        <strong>with promo code</strong> <span class="promo_arrow">
                                            <img src="/images/promo_arrow.png" /></span>
                                    </p>
                                    <div class="promocode">
                                        <span>SW500</span>
                                    </div>
                                </div>

                                <div class="slide">
                                    <h3 class="red_txt">SAVE <i class="fa fa-inr" aria-hidden="true"></i>750</h3>
                                    <p>
                                        on a minimum order of <i class="fa fa-inr" aria-hidden="true"></i><strong>40,000</strong>
                                        <br>
                                        <strong>with promo code</strong> <span class="promo_arrow">
                                            <img src="/images/promo_arrow.png" /></span>
                                    </p>
                                    <div class="promocode">
                                        <span>SW750</span>
                                    </div>
                                </div>

                                <div class="slide">
                                    <h3 class="red_txt">SAVE <i class="fa fa-inr" aria-hidden="true"></i>1000</h3>
                                    <p>
                                        on a minimum order of <i class="fa fa-inr" aria-hidden="true"></i><strong>60,000</strong>
                                        <br />
                                        <strong>with promo code</strong> <span class="promo_arrow">
                                            <img src="/images/promo_arrow.png" /></span>
                                    </p>
                                    <div class="promocode">
                                        <span>SW1000</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <%--Offer on  - Rail Passes Buy 1 Get 1 Free--%>
                <%--<div class='<%=Convert.ToString(countrycode)=="IN"?"asides_box":"noneIMP"%>'>

                    <div class="promo_ad_box equate">
                        <div class="tl black_txt">Swiss Travel Pass Promo</div>
                        <div class="box_tailtip"></div>
                        <div class="slider_holder">
                            <div class="slider promo_slider">

                                <div class="slide">
                                    <a href="/PassMtEx/MtExcursionHomeCal.aspx?MtExId=2&cntry=<%=countrycode %>">
                                        <h3 class="red_txt" style="font-size: 20px;">HARDER KULM</h3>
                                        <p>
                                            Book your Harder Kulm ticket with your Swiss Travel pass to get this
                                            <br />
                                            offer.
                                        <br />
                                            <strong>13 April - 31 May</strong><span class="promo_arrow">
                                                <img src="/images/promo_arrow.png" /></span>
                                        </p>

                                        <div class="promocode">
                                            <span style="font-size: 16px;">Buy 1 & Get 1 Free</span>
                                        </div>
                                    </a>
                                </div>
                                <div class="slide">
                                    <a href="/PassMtEx/MtExcursionHomeCal.aspx?MtExId=36&cntry=<%=countrycode %>">
                                        <h3 class="red_txt" style="font-size: 20px;">ALETSCH ARENA</h3>
                                        <p>
                                            Book your Aletsch Arena excursion along with your Swiss Travel Pass to get this offer.
                                        <br />
                                            <strong>28 April - 07 June</strong><span class="promo_arrow">
                                                <img src="/images/promo_arrow.png" /></span>
                                        </p>

                                        <div class="promocode">
                                            <span style="font-size: 16px;">Buy 1 & Get 1 Free</span>
                                        </div>
                                    </a>
                                </div>
                                <div class="slide">
                                    <a href="/PassMtEx/MtExcursionHomeCal.aspx?MtExId=35&cntry=<%=countrycode %>">
                                        <h3 class="red_txt" style="font-size: 20px;">SWISS TRANSPORT MUSEUM</h3>
                                        <p>
                                            Book your Swiss Transport Museum Day Pass ticket with your Swiss Travel pass to get this offer.
                                        <br />
                                            <strong>01 May - 31 May</strong><span class="promo_arrow">
                                                <img src="/images/promo_arrow.png" /></span>
                                        </p>

                                        <div class="promocode">
                                            <span style="font-size: 16px;">50% OFF on 2<sup>nd</sup> Pass</span>
                                        </div>
                                    </a>
                                </div>
                                 <div class="slide">
                                    <a href="MtExcursionHomeCal.aspx?MtExId=6&cntry=<%=countrycode %>">
                                        <h3 class="red_txt">MT. PILATUS</h3>
                                        <p>
                                            Available only through SWISStours in India.<br />
                                            Vaild for travel
                                        <br />
                                            <strong>1 April - 30 May</strong><span class="promo_arrow">
                                                <img src="/images/promo_arrow.png" /></span>
                                        </p>

                                        <div class="promocode">
                                            <span style="font-size: 16px;">Buy 1 & Get 1 Free</span>
                                        </div>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>--%>

                <%--Super Saver Promo - Rail Passes--%>
                <div class='asides_box noneIMP' id="divComboOffer">

                    <div class="promo_ad_box equate">
                        <div class="tl black_txt">Swiss Travel Pass Offer</div>
                        <div class="box_tailtip"></div>
                        <div class="slider_holder">
                            <div class="slider promo_slider">
                                <div class="slide">
                                    <a href="/PassMtEx/Rail-PassCal.aspx?OtherDetails=STS Swiss Travel Pass (RE);Regular:;adult; 4 Days Continuous;2nd Class;INR;18469;9235;false;68.4000015258789;281;CHF;1/166234;166235;;100715;0-15;26-99;135&cntry=<%=countrycode%>&offer=true">
                                        <h3 class="red_txt">&nbsp;</h3>
                                        <p>
                                            Book Jungfrau* and Titlis* excursions to get CHF 20 Off per person on your 4 Days Continuous (2<sup>nd</sup> Class) Swiss Travel Pass&nbsp; &nbsp; &nbsp; &nbsp;<br />

                                            <strong class="red_txt">Book Your Mountain</strong><span class="promo_arrow">
                                                <img src="/images/promo_arrow.png" /></span>
                                        </p>
                                        <div class="promocode">
                                            <span style="font-size: 22px; bottom: 5px !important;">CHF 20<br />
                                                OFF</span>
                                        </div>
                                        <div>
                                            <span style="font-size: 10px;"><sup>*</sup>Condition apply</span>
                                        </div>
                                    </a>

                                </div>

                                <div class="slide">
                                    <a href="/PassMtEx/Rail-PassCal.aspx?OtherDetails=STS Swiss Travel Pass (RE);Regular:;adult; 8 Days Continuous;2nd Class;INR;27224;13612;false;68.4000015258789;418;CHF;1/166246;166247;;100715;0-15;26-99;199&cntry=<%=countrycode %>&offer=true">
                                        <h3 class="red_txt">&nbsp;</h3>
                                        <p>
                                            Book Jungfrau*, Titlis* and Matterhorn* excursions to get CHF 20 Off per person on your 8 Days Continuous (2<sup>nd</sup> Class) Swiss Travel Pass &nbsp; &nbsp; &nbsp; &nbsp;<br />

                                            <strong class="red_txt">Book Your Mountain</strong><span class="promo_arrow">
                                                <img src="/images/promo_arrow.png" /></span>
                                        </p>
                                        <div class="promocode">
                                            <span style="font-size: 22px; bottom: 5px !important;">CHF 20<br />
                                                OFF</span>
                                        </div>
                                        <div>
                                            <span style="font-size: 10px;"><sup>*</sup>Condition apply</span>
                                        </div>
                                    </a>
                                </div>
                                <div class="slide">
                                    <a href="/PassMtEx/Rail-PassCal.aspx?OtherDetails=STS Swiss Travel Pass (RE);Regular:;adult; 15 Days Continuous;2nd Class;INR;33175;16622;false;68.4000015258789;513;CHF;1/166252;166253;;100715;0-15;26-99;243&cntry=<%=countrycode%>&offer=true">
                                        <h3 class="red_txt">&nbsp;</h3>
                                        <p>
                                            Book Jungfrau*, Titlis*, Matterhorn* and Glacier* excursions to get CHF 20 Off per person on your 15 Days Continuous (2<sup>nd</sup> Class) Swiss Travel Pass<br />

                                            <strong class="red_txt">Book Your Mountain</strong><span class="promo_arrow">
                                                <img src="/images/promo_arrow.png" /></span>
                                        </p>

                                        <div class="promocode">
                                            <span style="font-size: 22px; bottom: 5px !important;">CHF 20<br />
                                                OFF</span>
                                        </div>
                                        <div>
                                            <span style="font-size: 10px;"><sup>*</sup>Condition apply</span>
                                        </div>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

                <%--Eurail Global Pass Promo--%>
                <div class='asides_box' id="divGlobalPass">
                    <div class="promo_ad_box equate">
                        <div class="tl black_txt">Eurail Global Pass Promo</div>
                        <div class="box_tailtip"></div>
                        <div class="slider_holder">
                            <div class="slider promo_slider">
                                <div class="slide">
                                    <h3 class="red_txt">GET EUR 25 OFF</h3>
                                    <p>
                                        On purchase of Eurail Global Pass in conjunction with Jungfraujouch.                                                                              
                                    </p>
                                    <div class="promocode">
                                        <span>EUR<br />
                                            25 OFF</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <a id="aGlobalPass" data-fancybox data-type="ajax" data-src="/PassMtEx/Global-Pass-Offer.html" href="javascript:;" data-options='{"touch":false}' style="color: #cc0000; text-decoration: underline; display: none;"></a>
                <%--Swiss Tarvel Pass Offer on Apartment booking--%>
                <div class="asides_box noneIMP" id="divApartment">
                    <a href="/?cntry=<%=countrycode%>&IsDirectHit=18122">
                        <div class="familycard_box equate">
                            <div class="tl" style="font-weight: bold;">
                                Free Dinner (Veg/Jain)
                            </div>
                            <div class="fmlycard_img">
                                <img src="/images/fourbox/15111-Diwali-Offer-2018.jpg" />
                            </div>
                            <div class="text">Book select apartments for travel between 15 Jun – 31 Oct 2019 and get complimentary dinner (Set Menu Veg/Jain Meal only) for all nights.</div>
                            <div>
                                <span style="font-size: 10px;"><sup>*</sup>Condition apply</span>
                            </div>
                        </div>
                    </a>
                </div>

                <!--  xxxxxxxxxxxxxxxxxxxxx  -->
                <div class="asides_box noneIMP">
                    <div class="offer_ad_box equate" style="background-image: url(/images/offer_ad_bg.jpg);">
                        <div class="offer_detail">
                            <div class="tl">Festive Offer</div>
                            <div class="text">
                                Buy a Swiss Travel Pass &
                                <h3>Get Free Nights*</h3>
                                in Switzerland
                            </div>
                            <div class="text">
                                Pay for <strong>3/4/5/6/7</strong>,<br>
                                & Stay for <strong>4/5/7/8/9</strong> nights
                            </div>
                            <div class="cond">*Conditions apply</div>
                        </div>
                    </div>
                </div>

                <!--  xxxxxxxxxxxxxxxxxxxxx  -->
                <div class='noneIMP'>
                    <a href="/Winatrip/win-trip-contest.aspx?cType=WFSTP&cntry=<%=countrycode %>">
                        <div class="familycard_box equate">
                            <div class="tl">WIN A FREE SWISS TRAVEL PASS</div>
                            <div class="fmlycard_img">
                                <img src="/images/Win-A-Swiss-Pass.jpg" />
                            </div>
                            <div class="tl"></div>
                            <div class="text">Book your Swiss Travel Pass online. Answer 4 easy questions & stand a chance to win the lucky draw.</div>
                        </div>
                    </a>
                </div>
                <div class="asides_box" id="divfamilycard">
                    <div class="familycard_box equate">
                        <div class="tl">Free Family Card</div>
                        <div class="fmlycard_img">
                            <img src="/images/familycard_img.jpg" />
                        </div>
                        <div class="text">Children aged 6-15 years accompanied by at least one parent travel free. Children travelling without their parents receive a 50% reduction of the adult individual Swiss Travel Pass.</div>

                    </div>

                </div>

                <div class="asides_box noneIMP" id="divStanserhornOffer">
                    <div class="familycard_box equate">
                        <div class="tl">Free with the Swiss Travel Pass - Mount Stanserhorn</div>
                        <div class="fmlycard_img">
                            <img src="/images/Swiss-Pass-Stanserhorn-Free.jpg" />
                        </div>
                        <div class="text">Experience the CabriO - The double-decker cable car with an open upper deck that lets you enjoy fresh air and great views around Mount Stanserhorn. 18 - 21 minutes by train from Lucerne, Stanserhorn, Stans is open till the 18th of November 2018.</div>

                    </div>

                </div>
                <!--  xxxxxxxxxxxxxxxxxxxxx  -->

            </div>

        </div>
        <div class="container-fluid main_content_container">
            <div class="aboutInfo text-center" runat="server">
                <div id="aboutInfo" runat="server">About</div>
                <div class="nstp_aboutBox text-left">
                    <div id="AboutContent" runat="server"></div>
                    <!-- XXXXXXXXXXXXXXXXXXXXx -->
                    <span class='morelink text-center' style='background: #ffffff !important;'><a class='more' style='display: inline;'>Read more</a></span>
                </div>

            </div>
        </div>
        <div class="clearfix"></div>
        <%--FOR SUPER SAVER PROMO- RAIL PASSES--%>
        <a id="popUpPasses" data-fancybox data-type="ajax" data-src="/PassMtEx/promo-chf-100-off-on-STP.html?V=20190420R" href="javascript:;" data-options='{"touch":false}' style="display: none"></a>
    </div>

    <script src="/js/slick.min.js"></script>
    <script src="/js/form_script.js"></script>
    <script>
        $(".nstp_aboutBox .more").click(function () {

            $(this).parents(".nstp_aboutBox").toggleClass("expand");
            $(this).fadeOut(function () {
                $(this).text(($(this).text() == 'Read more') ? 'Read less' : 'Read more').fadeIn();
            })
            $(this).click(function () { return $("html,body").animate({ scrollTop: $(this).parents(".nstpAbout").offset().top - 150 }, 300), !1 })
        });
        /* Fixing the Explore button */

        function sticky_relocate() {
            var window_top = $(window).scrollTop();
            var div_top = $('#sticky-anchor').offset().top;
            if (window_top > div_top) {
                $('.ex_fix_on_scroll').addClass('stick');
            } else {
                $('.ex_fix_on_scroll').removeClass('stick');
            }
        }
        $(function () {
            $(window).scroll(sticky_relocate);
            sticky_relocate();
        });

        ///*  Pass Type Tabs  */
        //$(".rates_tab_container").hide();
        //$(".rates_tab_container:first").show();
        //$(".tab_detail").hide();
        //$('#regular').children('.tabs_content_container').children('.tab_detail').eq(0).show();

        //$(".pass_types li").click(function () {
        //    $(".rates_tab_container").hide();
        //    var activeTab = $(this).attr("rel");
        //    $("#" + activeTab).show();
        //    $(".pass_types li").removeClass("active");
        //    $(this).addClass("active");
        //    $(".tab_detail").hide();
        //    $("#" + activeTab).children('.tabs_content_container').children('.tab_detail').eq(0).show();

        //    $("#" + activeTab).children('.tabs').children('li').eq(0).addClass('active');
        //    $("#" + activeTab).children('.tabs').children('li').eq(0).siblings('li').removeClass('active');
        //});

        //$(".tabs li").click(function () {
        //    $(".tab_detail").hide();
        //    var activeTab_1 = $(this).attr("rel");
        //    $("#" + activeTab_1).show();
        //    $(".tabs li").removeClass("active");
        //    $(this).addClass("active");
        //})

        ///*  Conditions  */

        //$('.condition_btn').click(function () {
        //    $('.condition_details').slideToggle();
        //})
        //$('.closeBtn').click(function () {
        //    $('.condition_details').slideToggle();
        //    if ($(window).width() < 992) { $('html,body').animate({ scrollTop: $('.tabs').offset().top - 160 }, 600) }
        //    else { $('html,body').animate({ scrollTop: $('.tabs').offset().top - 200 }, 600) }
        //})
        ///* Selection fare */
        //$(".pass_fare_list label").click(function () {
        //    $(".pass_fare_list label").css({ color: '#333', fontWeight: '400' });
        //    $(this).css({ color: '#cc0000', fontWeight: '700' });
        //});
        ///*  Jump to links  */
        //$('.jumpto_links a').on('click', function (event) {
        //    var target = $($(this).attr('href'));
        //    if (target.length) {
        //        event.preventDefault();
        //        if ($(window).width() < 992) { $('html,body').animate({ scrollTop: target.offset().top - 190 }, 600) }
        //        else { $('html,body').animate({ scrollTop: target.offset().top - 220 }, 600) }
        //    }
        //});

        $(".promo_slider").slick({ slidesToShow: 1, slidesToScroll: 1, dots: true, arrows: false, autoplay: true, autoplaySpeed: 5000, speed: 500, infinite: true, cssEase: 'ease', pauseOnHover: false });

        /* Equal Height */

        equalheight = function (container) {

            var currentTallest = 0,
                currentRowStart = 0,
                rowDivs = new Array(),
                $el,
                topPosition = 0;
            $(container).each(function () {

                $el = $(this);
                $($el).height('auto')
                topPostion = $el.position().top;

                if (currentRowStart != topPostion) {
                    for (currentDiv = 0; currentDiv < rowDivs.length; currentDiv++) {
                        rowDivs[currentDiv].height(currentTallest);
                    }
                    rowDivs.length = 0; // empty the array
                    currentRowStart = topPostion;
                    currentTallest = $el.height();
                    rowDivs.push($el);
                } else {
                    rowDivs.push($el);
                    currentTallest = (currentTallest < $el.height()) ? ($el.height()) : (currentTallest);
                }
                for (currentDiv = 0; currentDiv < rowDivs.length; currentDiv++) {
                    rowDivs[currentDiv].height(currentTallest);
                }
            });
        }

        if ($(window).width() <= 992 && $(window).width() > 651) {
            $(window).load(function () {
                equalheight('.equate');
            });
            $(window).resize(function () {
                equalheight('.equate');
            });
        }
    </script>


    <input type="hidden" id="hdnFamilyId" runat="server" />
    <input type="hidden" id="hdnLevel" runat="server" />
    <input type="hidden" id="hdnCountryCode" runat="server" />
    <input type="hidden" id="hdnREAKey" runat="server" />
    <input type="hidden" id="hdnRate" runat="server" />
</asp:Content>

