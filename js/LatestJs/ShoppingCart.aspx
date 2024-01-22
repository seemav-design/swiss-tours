<%@ Page Title="" Language="C#" MasterPageFile="~/Main.master" AutoEventWireup="true" CodeFile="ShoppingCart.aspx.cs" Inherits="PassMtEx_ShoppingCart" EnableEventValidation="false" %>

<asp:Content ID="Content1" ContentPlaceHolderID="ContentPlaceHolder" runat="Server">
    <!-- PAGE CONTENT HOLDER STARTS  -->
    <%--<script>
        jQuery(document).ready(function ($) {
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
    </script>--%>
    <div class="row">

        <div class="container-fluid maxwidth">

            <div class="container-fluid shoppingcart_main">
                <div class="row">

                    <div class="col-xs-12 form_head gray_texture">
                        <div class="row">
                            <div class="col-xs-9" style="border-right: 1px solid #999;">
                                <img src="/images/ic_cart.png" style="vertical-align: middle; float: left; margin-right: 5px;" />
                                <strong class="black_txt">Your Shopping Cart</strong>
                            </div>
                            <div class="col-xs-1 red_txt" style="font-size: 16px; white-space: nowrap">
                                <asp:Label ID="lblCartCnt" Text="0" runat="server"></asp:Label>
                            </div>
                            <div class="col-xs-2 red_txt" style="font-size: 16px; white-space: nowrap; text-align: right; font-weight: bold;">
                                <asp:LinkButton ID="lnkBtnClearAll" runat="server" Text="Clear All" Style="color: blue;" OnClick="lnkBtnClearAll_Click"></asp:LinkButton>
                            </div>
                        </div>
                    </div>
                    <div class="clearfix"></div>
                    <asp:Repeater ID="rptShoppingCart" runat="server" OnItemDataBound="rptShoppingCart_ItemDataBound" Visible="true">
                        <ItemTemplate>

                            <div class="col-xs-12 product_section lightgray_texture fade_anim">
                                <div class="row ps_details">
                                    <div class="col-xs-12 col-sm-9 prod_detail">
                                        <p class="none"><%#DataBinder.Eval(Container.DataItem, "position")%>~~~~<%#DataBinder.Eval(Container.DataItem, "MtExId")%></p>

                                        <p class="prod_name"><strong class="red_txt"><%#DataBinder.Eval(Container.DataItem, "ExcursionName")%></strong></p>
                                        <p class='<%#Convert.ToString(DataBinder.Eval(Container.DataItem, "TravelDate"))==""?"none":""%>'>
                                            <span>Travel Date</span> : <strong><%#Convert.ToString(DataBinder.Eval(Container.DataItem, "TravelDate"))!=""?Convert.ToDateTime(DataBinder.Eval(Container.DataItem, "TravelDate")).ToString("MMM dd, yyyy"):Convert.ToString(DataBinder.Eval(Container.DataItem, "TravelDate"))%></strong>
                                         <i class='<%#Convert.ToString(DataBinder.Eval(Container.DataItem, "ImportantInfo"))==""?"noneIMP":"fa fa-info-circle"%>' data-toggle='tooltip' data-trigger='hover click' data-title="<%#Convert.ToString(DataBinder.Eval(Container.DataItem, "ImportantInfo"))%>"></i>
                                        </p>
                                        <p class='<%#Convert.ToString(DataBinder.Eval(Container.DataItem, "TotalTraveller"))==""?"none":""%>'><span>No. of Travellers</span> : <strong><%#DataBinder.Eval(Container.DataItem, "TotalTraveller")%></strong></p>
                                        <p class='<%#Convert.ToString(DataBinder.Eval(Container.DataItem, "TariffName"))==""?"none":""%>'><%--changeing here Heading--%><span><%#Convert.ToString(DataBinder.Eval(Container.DataItem, "BType"))=="PTP"?"Train Name":"Tour Type"%></span> : <strong><%#DataBinder.Eval(Container.DataItem, "TariffName")%></strong></p>
                                        <p class='<%#Convert.ToString(DataBinder.Eval(Container.DataItem, "DepartureDate"))==""?"none":""%>'><span>Departure</span> : <strong><%#Convert.ToString(DataBinder.Eval(Container.DataItem, "DepartureDate"))!=""?Convert.ToDateTime(DataBinder.Eval(Container.DataItem, "DepartureDate"),dateFormatInf).ToString("MMM dd, yyyy"):Convert.ToString(DataBinder.Eval(Container.DataItem, "DepartureDate"))%> | <%#DataBinder.Eval(Container.DataItem, "DepartureTime")%></strong></p>
                                        <p class='<%#Convert.ToString(DataBinder.Eval(Container.DataItem, "ArrivalDate"))==""?"none":""%>'><span>Arrival</span> : <strong><%#Convert.ToString(DataBinder.Eval(Container.DataItem, "DepartureDate"))!=""?Convert.ToDateTime(DataBinder.Eval(Container.DataItem, "DepartureDate"),dateFormatInf).ToString("MMM dd, yyyy"):Convert.ToString(DataBinder.Eval(Container.DataItem, "DepartureDate"))%> | <%#DataBinder.Eval(Container.DataItem, "ArrivalTime")%></strong></p>
                                        <p class='<%#Convert.ToString(DataBinder.Eval(Container.DataItem, "TicketOption"))==""?"none":""%>'><span>Ticket Delivery</span> : <strong><%#DataBinder.Eval(Container.DataItem, "TicketOption")%></strong></p>
                                        <asp:Label ID="xxpolicy" runat="server" />
                                        <asp:Label ID="lblPriceChange" runat="server" />
                                        <asp:Label ID="lblCartId" Text='<%#DataBinder.Eval(Container.DataItem, "Position")%>' runat="server" Style="display: none;" />
                                        <asp:Label ID="lblbType" Text='<%#DataBinder.Eval(Container.DataItem, "BType")%>' runat="server" Style="display: none;" />
                                        <asp:Label ID="lblproductCode" Text='<%#DataBinder.Eval(Container.DataItem, "ExcursionNameSummary")%>' runat="server" Style="display: none;" />
                                        <asp:Label ID="lblTourGrade" Text='<%#DataBinder.Eval(Container.DataItem, "Conn_Fare_Link")%>' runat="server" Style="display: none;" />

                                        <asp:Label ID="lblProductTotalPrice" Text='<%#DataBinder.Eval(Container.DataItem, "CnvtTariffRate")%>' runat="server" Style="display: none;" />
                                        <asp:Label ID="lblProductCurrency" Text='<%#DataBinder.Eval(Container.DataItem, "CnvtCurrency")%>' runat="server" Style="display: none;" />
                                    </div>
                                    <div class="col-xs-12 col-sm-3 sc_price">
                                        <%#DataBinder.Eval(Container.DataItem, "CnvtCurrency")%>&nbsp;<%#Convert.ToDouble(DataBinder.Eval(Container.DataItem, "CnvtTariffRate"))%></div>
                                </div>
                                <a id='<%#Convert.ToString(DataBinder.Eval(Container.DataItem, "position")) + "~" + Convert.ToString(DataBinder.Eval(Container.DataItem, "BType"))%>' onclick="Delete_Shopping_Items(this)"  title="Delete this item." class='<%#Convert.ToString(DataBinder.Eval(Container.DataItem, "TourGrade"))!="Offer"?"delete_btn fade_anim":"noneIMP"%>'><i class="fa fa-times"></i></a>
                                <%--<asp:LinkButton ID='lnkBtn'  OnCommand='Delete_Shopping_Items' CommandArgument='<%#Convert.ToString(DataBinder.Eval(Container.DataItem, "position")) + "~" + Convert.ToString(DataBinder.Eval(Container.DataItem, "BType"))%>' runat='server' CssClass="delete_btn fade_anim" ToolTip="Delete this item." Visible='<%#Convert.ToString(DataBinder.Eval(Container.DataItem, "TourGrade"))!="Offer"%>'><i class="fa fa-times"></i></asp:LinkButton>--%>
                            </div>
                        </ItemTemplate>
                        <FooterTemplate>
                            <div class="col-xs-12 gray_texture1 cart_total1 text-right" id="divDiscount" runat="server" visible="false">
                                Discount : <strong class="red_txt">
                                    <asp:Label ID="lblDiscount" Text="000" runat="server" /></strong>
                            </div>
                            <div class="col-xs-12 gray_texture cart_total text-right">
                                Total : <strong class="red_txt">
                                    <asp:Label ID="lblTotalPrice" Text="000" runat="server" /></strong>
                            </div>
                        </FooterTemplate>
                    </asp:Repeater>

                    <div id="divRemarks" runat="server" class="col-xs-12 text-center" visible="false">
                        <strong class="red_txt"><sup>*</sup>All Mountain Excursion dates displayed are only indicative. Mountain Excursion vouchers are open dated.
                        </strong>
                        <br />
                        <strong>Do you want more excursions? Please click the Sightseeing Tab above or click Continue to proceed and complete your transaction. 
                        </strong>
                    </div>
                    <div class="col-xs-12 text-center">
                        <strong>
                            <asp:Label ID="lblMsg" runat="server" CssClass="red_txt"></asp:Label></strong>
                    </div>
                    <div id="divContinue" runat="server" class="col-xs-12 text-center">
                        <%--<a class="cta btn fade_anim" href="PassMtPaxEntry.aspx?TransId=<%=TransId %>&cntry=<%=countrycode %>" style="width: 150px">Continue</a>--%>
                    </div>

                    <!-- PROMO CODE POPUP -->
                    <div style="display: none" class="fancy_inline_display" id="promo_popup">

                        <div class="generalpopup">
                            <div class="container-fluid text-center" style="padding-top: 50px;">
                                <p><strong class="red_txt">Thank you for booking the Swiss Travel Pass.</strong></p>
                                <p>You can now purchase mountain excursions (<strong>upto 50% discounted</strong> with the Swiss Travel Pass) online.</p>
                                <p>Would you like to buy now?</p>

                                <div class="row">
                                    <a href="" class="cta btn" style="width: 80px;">Yes</a> &nbsp;
            <a href="" class="cta btn" style="width: 80px;">No</a>
                                </div>

                            </div>
                        </div>

                    </div>
                    <!-- PROMO CODE POPUP ends -->

                </div>
            </div>

            <%--<div class="container-fluid shoppingcart_main" style="border-top: 1px solid #ddd; padding-top: 15px;">
                <div class="black_txt text-center"><strong>Would you like to add more to your booking?</strong></div>
                <div class="clearfix" style="height: 15px"></div>
                <div class="row add_pckg">
                    
                    <a href="/swiss-travel-pass?TransId=<%=TransId %>&cntry=<%=countrycode %>" class="fade_anim"><span>Swiss Travel Pass</span></a>
                    <a href="/european-rail-tickets?TransId=<%=TransId %>&cntry=<%=countrycode %>" class="fade_anim"><span>European Point To Point Train Ticket</span></a>
                    <a href="/Sightseeings?cntry=<%=countrycode %>" class="fade_anim"><span>Sightseeing</span></a>
                    <%if (countrycode == "IN")
                        { %>
                    <a href="/PassMtEx/Rail-Pass.aspx?FamilyId=100029&TransId=<%=TransId %>&cntry=<%=countrycode %>" class="fade_anim"><span>Eurail</span></a>
                    <%} %>
                </div>

            </div>--%>           
            <div class="clearfix"></div>
        </div>

         <div class="container-fluid section_Container" id="divMountain" runat="server" visible="false">
            <div class="maxwidth">

                <div class="title text-center">
                    <h1>Save with Swiss Pass</h1>
                </div>

                <div class="slider_D4 sliderScroll">

                    <asp:Repeater ID="rptMountain" runat="server">
                        <ItemTemplate>
                            <div>
                                <a href='/PassMtEx/MtExcursionHomeCal.aspx?MtExId=<%#DataBinder.Eval(Container.DataItem, "MtExId")%>&cntry=<%=countrycode %>' class="packBox showPerRate">
                                    <div class="packImg">
                                        <img data-lazy='<%#"/Images/Mountain/"+Convert.ToString(DataBinder.Eval(Container.DataItem,"MainImage")).Replace(".","-medium.")%>' />
                                    </div>
                                    <div class='<%#Convert.ToString(DataBinder.Eval(Container.DataItem,"SSOffer"))=="True"?"packOffer":"noneIMP"%>'><strong><%#Convert.ToString(DataBinder.Eval(Container.DataItem,"SSOfferText"))%></strong></div>
                                    <div class="packHighlight">
                                        <div class='<%#Convert.ToString(DataBinder.Eval(Container.DataItem,"IsSnow"))=="True"?"packSnow":"noneIMP"%>'>100% Snow Guaranteed</div>
                                    </div>
                                    <div class="packContent">
                                        <div class="packHead">
                                            <div class="packheadLeft">
                                                <%--<div class="packDuration"><i class="fa fa-clock-o red_txt"></i>&nbsp;<%#DataBinder.Eval(Container.DataItem, "ExcursionCity")%></div>--%>
                                                 <div class="packDuration"></i>&nbsp;<%#DataBinder.Eval(Container.DataItem, "ExcursionCity")%></div>
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
         <asp:LinkButton ID='lnkBtn'  OnCommand='Delete_Shopping_Items' runat='server' CssClass="noneIMP"></asp:LinkButton>
          <asp:HiddenField ID="hdnLnkBtnValue" Value="" runat="server" />                  
        <div class="clearfix"></div>
    </div>

    <script src="/js/slick.min.js"></script>
    <script src="/js/sliders_script.js"></script>
    <script src="/js/form_script.js"></script>
    <script>
        function Delete_Shopping_Items(ids) {
            $('#ContentPlaceHolder_hdnLnkBtnValue').val(ids.id);
            $('#ContentPlaceHolder_lnkBtn')[0].click();
            //return false;
        }
    </script>
    <!-- PAGE CONTENT HOLDER ENDS -->
</asp:Content>

