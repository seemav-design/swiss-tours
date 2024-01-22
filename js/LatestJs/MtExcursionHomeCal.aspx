<%@ Page Language="C#" MasterPageFile="~/Main.master" AutoEventWireup="true" CodeFile="MtExcursionHomeCal.aspx.cs" Inherits="PassMtEx_MtExcursionHomeCal" %>

<asp:Content ID="Content1" ContentPlaceHolderID="ContentPlaceHolder" runat="Server">
    <!-- PAGE CONTENT HOLDER STARTS  -->

    <div class="row">
        <a class="fancybox_trig" href="#contestpopup" style="display: block"></a>
        <div style="display: none" class="fancy_inline_display" id="event_pop_Condition" >
           <%-- <div class="generalpopup">--%>

                <div class="generalpopup ssImpContainer" style="margin-bottom: 0px">
                    <div class="ssic_tl black_txt text-uppercase">Important Info</div>

                    <div id="divImportantInfo" runat="server">
                        <ul class="ssImpinfoList">
                            <li>
                                <i class="fa fa-calendar fa-fw red_txt"></i>
                                <strong>Rates</strong> Rates valid till Dec 12, 2020</li>

                            <li>
                                <i class="fa fa-check-square-o fa-fw red_txt"></i>
                                <strong>Operational days</strong> Excursion operates all year round.</li>

                            <li>
                                <i class="fa fa-window-close-o fa-fw red_txt"></i>
                                <strong>Cancellation</strong> A cancellation penalty of 15% will apply on totally unutilised voucher, unless stamped and signed by the mountain authority personnel in circumstances of excursions being closed due to bad weather.</li>
                        </ul>
                    </div>
                </div>
            <%--</div>--%>
            <button data-fancybox-close='' class='fancybox-close-small'></button>
        </div>
        <div class="ssBannerContainer" id="divImageRate" runat="server">
            <img src="/images/sightseeing/Jungfraujoch_banner.jpg" class="ssBanner" />
            <div class="maxwidth ssBrief">

                <div class="ssBriefBox">
                    <h1 class="sstitle"></h1>
                    <ul class="ssProps">
                        <li><i class="fa fa-map-marker fa-fw"></i><strong>Interlaken, Switzerland</strong></li>
                    </ul>
                    <div class="ssPriceBox">
                        <div class="ssOffer"><strong>EUR 25 OFF On Eurail Global Pass</strong></div>
                        <div class="clearfix"></div>
                        <div class="ssPrice">INR 10126 </div>
                        <div class="clearfix"></div>
                        <small>(Starting price per person)</small>
                    </div>
                    <ul class="ssPackFeatures noneIMP">
                        <li><i class="fa fa-ticket"></i>Get instant voucher in your mail </li>
                        <li><i class="fa fa fa-check-square-o"></i>33% off with Swiss Travel Pass </li>
                        <li><i class="fa fa-money"></i>Cheaper to buy in India </li>
                    </ul>
                    <div class="clearfix"></div>
                </div>

            </div>
        </div>
        <div class="clearfix"></div>

        <div class="container-fluid contact_main" id="divCal" runat="server">
            <div class="maxwidth ">

                <div class="row" style="border-bottom: 1px solid #eee;">
                    <div class="col-md-12 text-center">

                        <div class="tour_tl_block pckg_brief_main">

                            <div class="gray_texture tour_tl black_txt text-center">
                                Book
                                <asp:Label ID="lblExcursionName" runat="server" Text=""></asp:Label>
                            </div>

                            <div class="tourbook_details text-center">
                                 
                                <div class="pckgDateForm">
                                    <%--<div class="condition_btn" style="margin-top: 3px;"><i class="fa fa-info-circle" aria-hidden="true"></i>Condition Apply</div>--%>
                                    
                                    Select Date :
                                <div class="form-group">
                                    <div class="input-group" data-date="" data-date-format="dd MM yyyy" data-link-field="dtp_input2">
                                        <div class="input-group-addon ic_date"></div>
                                        <input id="depDate" runat="server" type="text" placeholder="Select Travel Date" class="form-control date" readonly />
                                    </div>
                                    <input type="hidden" id="dtp_input2" value="" />
                                </div>

                                   
                                    <%--<i class="fa fa-info-circle" data-toggle="tooltip" data-trigger="hover click" data-title="<%=ImportantInfoOnI%>"></i>--%>

                                    <p class="red_txt text-center" style="font-size: 20px; display: none;">
                                        <strong>
                                            <asp:Label ID="lblvouchermsg" runat="server" Text=""></asp:Label></strong>
                                    </p>

                                    <p class="red_txt text-center" style="font-size: 20px; display: none;" id="pmsg" runat="server">
                                        <strong>
                                            <asp:Label ID="lblmsg" runat="server" Text=""></asp:Label></strong>
                                    </p>
                                </div>
                                <div class="link_box text-right"><a data-fancybox="" data-src="#event_pop_Condition" href="javascript:;" style="font-size:12px;color:#4b4b4b"><i class="fa fa-info-circle" data-toggle="tooltip" data-trigger="hover click" data-title="<%=ImportantInfoOnI%>"></i> Conditions Apply</a></div>

                            </div>

                            <asp:Repeater ID="rptMountainRates" runat="server">
                                <HeaderTemplate>
                                    <table class="pckgprice_table excprice_table">
                                        <thead>
                                            <tr>
                                                <td class="roomtl">Fare Type</td>
                                                <td><%#((System.Data.DataTable)(rptMountainRates.DataSource)).Rows[0]["Currency"]%></td>
                                                <td><%#((System.Data.DataTable)(rptMountainRates.DataSource)).Rows[0]["CnvtCurrency"]%></td>
                                                <td>No. of PAX</td>
                                                <td>Amount (<%#((System.Data.DataTable)(rptMountainRates.DataSource)).Rows[0]["CnvtCurrency"]%>)</td>
                                            </tr>
                                        </thead>
                                </HeaderTemplate>
                                <ItemTemplate>
                                    <tr>
                                        <td class="roomtl">
                                            <input type="hidden" id="ids" value="<%#DataBinder.Eval(Container.DataItem, "TariffId")%>" /><%#DataBinder.Eval(Container.DataItem, "TariffName")%></td>
                                        <td class="black_txt"><span class='<%#Convert.ToInt64(DataBinder.Eval(Container.DataItem, "StrikeRate"))<=0?"noneIMP":""%>' style="text-decoration-color: red;text-decoration-line: line-through;text-decoration-thickness: 2px;"><%#DataBinder.Eval(Container.DataItem, "StrikeRate")%></span>
                                            <strong>
                                                <%#DataBinder.Eval(Container.DataItem, "ActualRate")%></strong></td>
                                        <td>
                                            <asp:Label ID="lblRate" runat="server" Text='<%#DataBinder.Eval(Container.DataItem, "Rate")%>'></asp:Label></td>
                                        <td>
                                            <div class="form-group">
                                                <%if (MtExId == 32)
                                                    { %>
                                                <select class="form-control selectpicker" id="ddlxPax" runat="server" onchange="javascript:return ddlPax_Change(this);">
                                                    <option>0</option>
                                                    <option>1</option>
                                                    <option>2</option>
                                                    <option>3</option>
                                                    <option>4</option>
                                                    <option>5</option>
                                                </select>
                                                <%}
                                                    else
                                                    {%>
                                                <select class="form-control selectpicker" id="ddlPax" runat="server" onchange="javascript:return ddlPax_Change(this);">
                                                    <option>0</option>
                                                    <option>1</option>
                                                    <option>2</option>
                                                    <option>3</option>
                                                    <option>4</option>
                                                    <option>5</option>
                                                    <option>6</option>
                                                    <option>7</option>
                                                    <option>8</option>
                                                    <option>9</option>
                                                    <option>10</option>
                                                    <option>11</option>
                                                    <option>12</option>
                                                    <option>13</option>
                                                    <option>14</option>
                                                    <option>15</option>
                                                    <option>16</option>
                                                    <option>17</option>
                                                    <option>18</option>
                                                    <option>19</option>
                                                    <option>20</option>
                                                </select>
                                                <% }%>
                                            </div>
                                        </td>
                                        <td>
                                            <asp:Label ID="lblTotal" runat="server" Text="0.00"></asp:Label></td>
                                    </tr>
                                </ItemTemplate>
                                <FooterTemplate>
                                    </table>
                                    <table class="pckgtotal_table">
                                        <tr>
                                            <td colspan="2" style="padding: 0; height: 3px; background: #cc0000;"></td>
                                        </tr>
                                        <tr>
                                            <td><strong class="red_txt">Grand Total</strong></td>
                                            <td><strong class="red_txt">
                                                <asp:Label ID="lblGrandTotal" runat="server" Text="0.00"></asp:Label></strong></td>
                                        </tr>
                                    </table>
                                </FooterTemplate>
                            </asp:Repeater>

                            <div class="row" style="margin-bottom: 20px; display: none;" id="divbtn" runat="server">
                                <div class="col-xs-12 text-center">
                                    <%-- <button class="btn cta" style="width: 150px;">Book Now</button>--%>
                                    <asp:Button ID="btnBookNow" runat="server" class="btn" Style="width: 150px;" Text="Book Now" OnClientClick="javascript:return ValidateForm();" OnClick="btnBookNow_Click" disabled />
                                    <asp:Button ID="btnGetRates" runat="server" class="btn noneIMP" Style="width: 150px;" Text="Get Rates" CausesValidation="false" autopostback="false" OnClick="btnGetRates_Click" />
                                </div>
                            </div>

                        </div>


                    </div>
                    
                </div>

            </div>
        </div>
        <div class="clearfix"></div>
        <div class="container-fluid maxwidth nstpAbout">
            <div class="title text-center">
                <div class="container-fluid fixanchor"></div>
                <h2>About
                    <asp:Label ID="lblExcursionNameBottom" runat="server" Text=""></asp:Label></h2>
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

            <div class="ssvideo_container" id="divVideo" runat="server" visible="false">
                <div class="ssvideo_holder">
                    <iframe id="iframe" runat="server" src="#" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                    <div class="logoverlap">
                        <img src="/images/logo.png" alt="SWISStours Logo" />
                    </div>
                </div>
            </div>

        </div>
        <div class="clearfix"></div>

        <div class="container-fluid section_Container" id="divMountain" runat="server" visible="true">
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
                                        <img alt='<%#DataBinder.Eval(Container.DataItem, "imgALT")%>' data-lazy='<%#"/Images/Mountain/"+Convert.ToString(DataBinder.Eval(Container.DataItem,"MainImage")).Replace(".","-medium.")%>' />
                                    </div>
                                    <div class='<%#Convert.ToString(DataBinder.Eval(Container.DataItem,"SSOffer"))=="True"?"packOffer":"noneIMP"%>'><strong><%#Convert.ToString(DataBinder.Eval(Container.DataItem,"SSOfferText"))%></strong></div>
                                    <div class="packHighlight">
                                        <div class='<%#Convert.ToString(DataBinder.Eval(Container.DataItem,"IsSnow"))=="True"?"packSnow":"noneIMP"%>'>100% Snow Guaranteed</div>
                                    </div>
                                    <div class="packContent">
                                        <div class="packHead">
                                            <div class="packheadLeft">
                                                <div class="packDuration"><i class="fa fa-map-marker red_txt"></i>&nbsp;<%#DataBinder.Eval(Container.DataItem, "ExcursionCity")%></div>
                                            </div>
                                        </div>
                                        <h2 class="packTitle black_txt"><%#DataBinder.Eval(Container.DataItem,"ExcursionName")%></h2>
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
        <div class="fancy_inline_display" id="contest_validitypop" style="display: none">
            <div class="eventpopup black_txt" style="min-height: 180px; width: 500px;">
                <div class="container-fluid">
                    <div class="row event_tl white_txt text-uppercase">Please Note</div>
                    <div class="row event_details">
                        <%-- <div class="container-fluid">--%>
                        <div class="event_date lightgray_texture" style="font-size: 18px;">
                            <%=ImportantInfo %>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="clearfix"></div>

        <input id="hdnServerTime" style="width: 19px" type="hidden" runat="server" />
        <input id="hdnOfferSDate" style="width: 1px" type="hidden" runat="server" />
        <input id="hdnOfferEDate" style="width: 1px" type="hidden" runat="server" />
        <input id="hdnOfferTDate" style="width: 1px" type="hidden" runat="server" />
        <input id="hdnValidityDate" style="width: 1px" type="hidden" runat="server" />
        <input id="hdnMtStartDate" style="width: 1px" type="hidden" runat="server" />
        <input id="hdnMtExId" style="width: 1px" type="hidden" runat="server" />
        <input id="hdnIsOffer" style="width: 1px" type="hidden" runat="server" />
        <input id="hdnMaintenanceOpenDate" style="width: 1px" type="hidden" runat="server" />
        <input id="hdnMaintenanceCloseDate" style="width: 1px" type="hidden" runat="server" />
        <input id="hdnVisitCountry21" style="width: 1px" type="hidden" runat="server" />
        <input id="hdnRateRow" style="width: 1px" type="hidden" runat="server" />
        <input id="OfferValidityEndDate" style="width: 1px" type="hidden" runat="server" />
        <input id="hdnImportantInfo" style="width: 1px" type="hidden" runat="server" />
    </div>

    <script src="/js/slick.min.js"></script>
    <script src="/js/sliders_script.js"></script>
    <script src="/js/form_script.js"></script>
    <script>
 
        $(".nstp_aboutBox .more").click(function () {

            $(this).parents(".nstp_aboutBox").toggleClass("expand");
            $(this).fadeOut(function () {
                $(this).text(($(this).text() == 'Read more') ? 'Read less' : 'Read more').fadeIn();
            })
            $(this).click(function () { return $("html,body").animate({ scrollTop: $(this).parents(".nstpAbout").offset().top - 150 }, 300), !1 })
        });



        <%--var count = '<%=popupcount%>';
        if (count == 1) {           
            $("#contest_validitypop").fancybox({
                "touch": false
            }).trigger("click");
        }--%>

        var strCountry = '<%=countrycode%>';
        function ddlPax_Change(ctrl) {
            var rowCnt = $('#ContentPlaceHolder_hdnRateRow').val();
            var strId = '#' + ctrl.id;
            var NoOfPax = parseFloat($(strId).val());
            var rate = parseFloat($(strId.replace('ddlPax', 'lblRate').replace('ddlxPax', 'lblRate')).text());
            var total = parseFloat(rate * NoOfPax);

            $(strId.replace('ddlPax', 'lblTotal').replace('ddlxPax', 'lblTotal')).text(total.toFixed(2));
            var grandtotal = 0;
            //var NoTotalEx = 0;
            var strddlPax = '#ContentPlaceHolder_rptMountainRates_ddlPax_';
            if (strId.indexOf('ddlxPax') > 0)
                strddlPax = strddlPax.replace('ddlPax', 'ddlxPax');
            for (var i = 0; i < rowCnt; i++) {
                if (parseFloat($(strddlPax + i).val()) > 0) {
                    grandtotal += parseFloat($('#ContentPlaceHolder_rptMountainRates_lblTotal_' + i).text());
                    //NoTotalEx += parseFloat($('#ContentPlaceHolder_rptMountainRates_ddlPax_' + i).val());                    
                }
            }
            if (grandtotal > 0) {
                $('#ContentPlaceHolder_btnBookNow').removeAttr("disabled");
                $('#ContentPlaceHolder_btnBookNow').addClass("cta");
                //document.getElementById('ContentPlaceHolder_btnBookNow').disabled = false;
            }
            else {
                $('#ContentPlaceHolder_btnBookNow').prop("disabled", "true");
                $('#ContentPlaceHolder_btnBookNow').removeClass("cta");
            }
            //$('#ContentPlaceHolder_hdnNoTotalEx').val(NoTotalEx);
            $('#ContentPlaceHolder_rptMountainRates_lblGrandTotal').text(grandtotal.toFixed(2));

            return false;
        }
        function ValidateForm() {

            if ($.trim($("#ContentPlaceHolder_depDate").val()) == "") {
                $('#ContentPlaceHolder_depDate').addClass("highlight_error");
                $("#ContentPlaceHolder_depDate").focus();
                return false;
            }
            return true;
        }
        /* Book Btn */
        $(".tripadviser_stop").click(function () {
            if ($(window).width() < 992) { $('html,body').animate({ scrollTop: $(".exc_reviews_box").offset().top - 140 }, 600) }
            else { $('html,body').animate({ scrollTop: $(".exc_reviews_box").offset().top - 160 }, 600) }
        });

        $(".tour_book").click(function () {
            if ($(window).width() < 992) { $('html,body').animate({ scrollTop: $(".tour_tl_block").offset().top - 140 }, 600) }
            else { $('html,body').animate({ scrollTop: $(".tour_tl_block").offset().top - 160 }, 600) }
        });

        var strEndDate = "";
        var strStartDate = "";
        var array = $("#ContentPlaceHolder_hdnMaintenanceCloseDate").val();
        strEndDate = $("#ContentPlaceHolder_hdnValidityDate").val();
        strStartDate = $("#ContentPlaceHolder_hdnMtStartDate").val();
        //var days = +4;
        //var date1 = new Date();
        //date1.setDate(date1.getDate() + days);

        $("#ContentPlaceHolder_depDate").datetimepicker({
            startDate: strStartDate,
            initialDate: strStartDate,
            endDate: strEndDate,
            datesDisabled: array,//["16 Feb 2018","18 Feb 2018"],
            minView: 2,
            format: 'dd M yyyy',
            autoclose: 1,
        });
        $("#ContentPlaceHolder_depDate").on('changeDate', function (ev) {
            $(this).removeClass('highlight_error');

            $('#ContentPlaceHolder_btnGetRates').trigger('click');

            return false;
        });
        var $status = $('.bdpaging');
        var $slickElement = $('.bestdeals');
        $slickElement.on('init reInit afterChange', function (event, slick, currentSlide, nextSlide) {
            var i = (currentSlide ? currentSlide : 0) + 2;
            $status.html(i + '/' + slick.slideCount);
        });
        var minWidth = 993,
            slickVar = {
                dots: false, infinite: false, slidesToShow: 1, slidesToScroll: 1, speed: 1000, mobileFirst: true,
                responsive: [
                    { breakpoint: 993, settings: "unslick" },
                    { breakpoint: 651, settings: { slidesToShow: 2, slidesToScroll: 2 } },
                    { breakpoint: 300, settings: { slidesToShow: 1, slidesToScroll: 1 } }
                ]
            },
            runSlick = function () {
                $('.bestdeals').slick(slickVar);
            };

        // slick initialization while document ready
        runSlick();

        // listen to jQuery's window resize
        $(window).on('resize', function () {
            var width = $(window).width();
            if (width < minWidth) {
                // reinit slick while window's width is less than maximum width (641px)
                runSlick();
            }
        });
        function CalPosition() {
            if ($(window).width() < 992) { $('html,body').animate({ scrollTop: $(".tour_tl_block").offset().top - 140 }, 600) }
            else { $('html,body').animate({ scrollTop: $(".tour_tl_block").offset().top - 160 }, 600) }
            $("#ContentPlaceHolder_lblmsg").html("");
            $("#ContentPlaceHolder_hdnIsOffer").val("");
            //$("#ContentPlaceHolder_hdnlblmsg").val("");
            var jSwissTravelPass = $("#ContentPlaceHolder_hdnVisitCountry21").val();
            var jMtExId = $("#ContentPlaceHolder_hdnMtExId").val();
            var jhdnOfferSDate = $("#ContentPlaceHolder_hdnOfferSDate").val();
            var jhdnOfferEDate = $("#ContentPlaceHolder_hdnOfferEDate").val();
            var ev = new Date($("#ContentPlaceHolder_depDate").val());
            var dat = '' + ev.getDate() + ''
            var mnth = '' + (ev.getMonth() + 1) + ''
            var yrs = '' + ev.getFullYear() + ''

            var jTravelDate = yrs + '' + (mnth.length <= 1 ? ('0' + mnth) : mnth) + '' + (dat.length <= 1 ? ('0' + dat) : dat);
            $("#ContentPlaceHolder_hdnOfferTDate").val(jTravelDate);
            $("#ContentPlaceHolder_lblvouchermsg").html("Your voucher will be valid till " + $("#ContentPlaceHolder_OfferValidityEndDate").val());
            if (parseFloat(jTravelDate) >= parseFloat(jhdnOfferSDate) && parseFloat(jTravelDate) <= parseFloat(jhdnOfferEDate)) {
                if ((jMtExId == "14" || jMtExId == "36") && strCountry == "IN")//Swiss miniatur OR Aletsch Arena
                {
                    $("#ContentPlaceHolder_pmsg").css("display", "block");
                    $("#ContentPlaceHolder_lblmsg").html("Discounted promo price will show on next page.");
                    $("#ContentPlaceHolder_hdnIsOffer").val("Yes");
                }
                //            else if (jMtExId == "6" && strCountry == "IN_Stoped" && jSwissTravelPass == '100715')//Mount Pilatus buy 1 get 1 free with swiss pass
                //            {
                //	//$("#ContentPlaceHolder_hdnlblmsg").val("Discounted promo price will show on next page.");
                //	$("#ContentPlaceHolder_lblmsg").html("Discounted promo price will show on next page.");
                //                $("#ContentPlaceHolder_hdnIsOffer").val("Yes");
                //            }
                //            else if (jMtExId == "6" && strCountry == "IN_Stoped" && jSwissTravelPass != '100715') {
                //                $('#link_id').trigger('click');
                //            }
                //            else if (jMtExId == "21" && strCountry == "IN_Stopped")//Mount Pilatus buy 1 get 1 free with swiss pass
                //            {
                //	//$("#ContentPlaceHolder_hdnlblmsg").val("Child Discounted promo price will show on next page.");
                //	$("#ContentPlaceHolder_lblmsg").html("Child Discounted promo price will show on next page.");
                //                $("#ContentPlaceHolder_hdnIsOffer").val("Yes");
                //}
                //            else if (jMtExId == "21" && strCountry == "IN") {
                //                $('#link_id').trigger('click');
                //}
               <%-- else if ((jMtExId == "2" || jMtExId == "35" || jMtExId == "36") && strCountry == "IN" && jSwissTravelPass == '100715')//Harder Kulum OR Aletsch Arena OR Swiss Transport Museum buy 1 get 1 free with swiss pass
                {
                    //$("#ContentPlaceHolder_hdnlblmsg").val("Discounted promo price will show on next page.");
                    $("#ContentPlaceHolder_pmsg").css("display", "block");
                    $("#ContentPlaceHolder_lblmsg").html("Discounted promo price will show on next page.");
                    $("#ContentPlaceHolder_hdnIsOffer").val("Yes");
                }
                else if ((jMtExId == "2" || jMtExId == "35" || jMtExId == "36") && strCountry == "IN" && jSwissTravelPass != '100715') {
                    $('#link_id').attr("href", "DiscountMtEx.aspx?MtExId=" + jMtExId + "&cntry=<%=countrycode%>");
                    $('#link_id').trigger('click');
                }
                else if (jMtExId == "14" && strCountry == "IN")//Swiss Miniatur buy 1 get 1 free with swiss pass
                {
                    $("#ContentPlaceHolder_pmsg").css("display", "block");
                    $("#ContentPlaceHolder_lblmsg").html("Discounted promo price will show on next page.");
                    $("#ContentPlaceHolder_hdnIsOffer").val("Yes");
                }--%>
            }
        }
    </script>
    <!-- PAGE CONTENT HOLDER ENDS -->
</asp:Content>
