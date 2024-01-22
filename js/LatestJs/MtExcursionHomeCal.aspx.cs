using AdminClasses;
using System;
using System.Data;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using EurailClasses;
using System.Globalization;
using System.Web.UI.HtmlControls;
using System.Text;
using HotelClasses;

public partial class PassMtEx_MtExcursionHomeCal : System.Web.UI.Page
{

    public String countrycode = "";
    public String CnvtCurrency = "INR";
    public int MtExId = 0;
    public String transId = "";
    DataSet dsMt = new DataSet();
    LoginDetail oLoginDetail = new LoginDetail();
    Eurail oClsEurail = new Eurail();
    DateTimeFormatInfo dateFormatInfo = new DateTimeFormatInfo();
    String strSessionName = "dsMt";
    public string ImportantInfo = string.Empty;
    public string ImportantInfoOnI = string.Empty;
    public int popupcount = 1;
    List<MarkupDO> mrkup = new List<MarkupDO>();
    protected void Page_Load(object sender, EventArgs e)
    {
        dateFormatInfo.ShortDatePattern = "dd MMM yyyy"; //date format don't delete
        //////////login detail extracting here for through out on page use
        if (Session["LoginDetailList"] != null)
        { oLoginDetail = (LoginDetail)Session["LoginDetailList"]; }
        else
        {
            Boolean IsSessionDone = LoginSession.GetLoginResult("", "", "", "", "", "SWISSTOURS");
            if (!IsSessionDone)
                Response.Redirect("/default.aspx", true);
            else
                oLoginDetail = (LoginDetail)Session["LoginDetailList"];

        }
        try
        {
            //if (Request.QueryString["cntry"] != null && Request.QueryString["cntry"].ToString() != string.Empty)
            if (!string.IsNullOrEmpty(oLoginDetail.UrlCountry))
            {
                var regexItem = new Regex("^[A-Z]*$");
                if (regexItem.IsMatch(Convert.ToString(oLoginDetail.UrlCountry)))
                {
                    countrycode = Convert.ToString(oLoginDetail.UrlCountry);
                    CnvtCurrency = Convert.ToString(oLoginDetail.UrlCurrency);
                    //CnvtCurrency = Convert.ToString(oLoginDetail.UrlCurrency) != Convert.ToString(oLoginDetail.OptCurrency) ? Convert.ToString(oLoginDetail.OptCurrency) : Convert.ToString(oLoginDetail.UrlCurrency);

                    mrkup = new CommonFunction().Get_MarkUp_Comission_AgencyAndSupplierwise(Convert.ToInt32(oLoginDetail.AgencyId), 5);
                    mrkup[0].ServiceTax = CnvtCurrency == "INR" ? mrkup[0].ServiceTax : 0;

                }
            }

            transId = Convert.ToString(Session["TransId"]);
            if (Request.QueryString["TransId"] != null && Request.QueryString["TransId"].ToString() != string.Empty)
            {
                var regexItem = new Regex("^[A-Za-z0-9]*$");
                if (regexItem.IsMatch(Convert.ToString(Request.QueryString["TransId"])))
                {
                    Session["TransId"] = Convert.ToString(Request.QueryString["TransId"]);
                    transId = Session["TransId"].ToString();
                }
                else
                {
                    throw new Exception("TransId is Not Valid");
                }
            }
            MtExId = string.IsNullOrEmpty(Request.QueryString["MtExId"]) ? (string.IsNullOrEmpty(Request.Path.Split('/')[2].Split('-')[0]) ? 0 : Convert.ToInt32(Request.Path.Split('/')[2].Split('-')[0])) : Convert.ToInt32(Request.QueryString["MtExId"]);

            hdnMtExId.Value = Convert.ToString(MtExId);
            strSessionName += Convert.ToString(MtExId);//f

            //specilly fetching datafrom shopping cart that containg what
            DataTable dtShop = new DataTable();
            oClsEurail.TransactionId = Convert.ToString(Session["TransId"]);
            dtShop = oClsEurail.Get_Eurail_Tariff_ShoppingCart();

            if (dtShop.Rows.Count > 0)
            {

                var FamilyId = (from d in dtShop.AsEnumerable()
                                where d.Field<string>("VisitCountry") == "100715"
                                select d.Field<string>("VisitCountry")).ToList();//for swiss travel pass

                if (FamilyId.Count > 0)
                    hdnVisitCountry21.Value = Convert.ToString(FamilyId[0]);
            }

            if (!IsPostBack)
            {
                Get_MountainHomeData();
                popupcount++;
                Bind_Mountain();
                btnGetRates_Click(sender, e);
            }
        }
        catch (Exception ex)
        {
            Utilities.ErrDetail oErrDetail = new Utilities.ErrDetail();
            oErrDetail.ModuleName = "Page_Load" + "##" + Convert.ToString(System.Web.HttpContext.Current.Request.Url.AbsolutePath);
            oErrDetail.ErrDescription = Convert.ToString(ex.Message) + "###" + Convert.ToString(ex.StackTrace);
            oErrDetail.AgencyId = Convert.ToDouble(oLoginDetail.AgencyId);
            oErrDetail.DeskId = Convert.ToDouble(oLoginDetail.UserMasterId);
            oErrDetail.SearchRefId = Convert.ToString(Session["SearchRefID"]);
            oErrDetail.TransactionId = Convert.ToString(Session["TransId"]);
            oErrDetail.Insert_ErrDetail();
            Response.Redirect("/Info/ErrorMessagepg.aspx?cntry=" + countrycode + "&Error=" + Convert.ToString(ex.Message), true);
        }
    }
    public void Bind_Mountain()
    {
        oClsEurail.MtExId = MtExId;
        oClsEurail.AgencyId = Convert.ToInt32(oLoginDetail.AgencyId);
        oClsEurail.Currency = CnvtCurrency;
        oClsEurail.Days = "123456";
        oClsEurail.Site = "B2C";//CnvtCurrency == "INR" ? "B2C" : "";
        dsMt = oClsEurail.Get_Mountain_Excursions_wise_Details();
        if (dsMt.Tables.Count == 4)
        {
            Session[strSessionName] = dsMt;
            if (dsMt.Tables[0].Rows.Count > 0)
            {
                if (Request.QueryString.Count > 0 || Request.Path.IndexOf("aspx") > 0)
                {
                    Response.Status = "301 Moved Permanently";
                    Response.AddHeader("Location", "/" + Convert.ToString(dsMt.Tables[0].Rows[0]["path"]));
                }
                this.Title = Convert.ToString(dsMt.Tables[0].Rows[0]["title"]);
                this.MetaDescription = Convert.ToString(dsMt.Tables[0].Rows[0]["Metadescription"]);
                lblExcursionName.Text = lblExcursionNameBottom.Text = Convert.ToString(dsMt.Tables[0].Rows[0]["ExcursionName"]);

                String strImageRateDetails = "";

                string strRate = Convert.ToString(dsMt.Tables[0].Rows[0]["MinRate"]);
                string strCurrency = Convert.ToString(dsMt.Tables[0].Rows[0]["CnvtCurrency"]);

                strImageRateDetails = "";
                strImageRateDetails += "<img src=\"/images/swisstours-instant-e-voucher.png\" class=\"Hero_PromoLabel mobHide\" style=\"z-index: 10;\">";
                strImageRateDetails += "<img src =\"/images/Mountain/" + Convert.ToString(dsMt.Tables[0].Rows[0]["MainImage"]) + "\" alt='" + (Convert.ToString(dsMt.Tables[0].Rows[0]["imgALT"])) + "' class=\"ssBanner\">";
                strImageRateDetails += "<div class=\"maxwidth ssBrief\">";

                strImageRateDetails += "<div class=\"ssBriefBox\">";
                strImageRateDetails += "<h1 class=\"sstitle\">" + Convert.ToString(dsMt.Tables[0].Rows[0]["ExcursionName"]) + "</h1>";
                strImageRateDetails += "<ul class=\"ssProps\">";
                strImageRateDetails += "<li><i class=\"fa fa-map-marker fa-fw\"></i><strong>" + Convert.ToString(dsMt.Tables[0].Rows[0]["CityAndCountry"]) + "</strong></li>";
                strImageRateDetails += "</ul>";
                strImageRateDetails += "<div class=\"ssPriceBox\">";
                if (Convert.ToString(dsMt.Tables[0].Rows[0]["SSOfferText"]) != "")
                    strImageRateDetails += "<div class=\"ssOffer\"><strong>" + Convert.ToString(dsMt.Tables[0].Rows[0]["SSOfferText"]) + "</strong></div>";
                strImageRateDetails += "<div class=\"clearfix\"></div>";
                strImageRateDetails += "<div class='ssPrice1 noneIMP' style='font-weight: 700;font-size: 20px;color: yellow;'>Currently, " + Convert.ToString(dsMt.Tables[0].Rows[0]["ExcursionName"]) + " is Unavailable.</div>";

                strImageRateDetails += "<div class='Rate'><div class=\"ssPrice\">" + strCurrency + " " + strRate + "</div>";
                strImageRateDetails += "<div class=\"clearfix\"></div>";
                strImageRateDetails += "<small>(Starting price per person)</small>";
                strImageRateDetails += "</div></div>";
                strImageRateDetails += "<ul class=\"ssPackFeatures noneIMP\">";
                strImageRateDetails += "<li><i class=\"fa fa-ticket\"></i>Get instant voucher in your mail</li>";
                strImageRateDetails += "<li><i class=\"fa fa fa-check-square-o\"></i>33% off with Swiss Travel Pass</li>";
                strImageRateDetails += "<li><i class=\"fa fa-money\"></i>Cheaper to buy in India</li>";
                strImageRateDetails += "</ul>";
                strImageRateDetails += "<div class=\"clearfix\"></div>";
                strImageRateDetails += "</div>";

                strImageRateDetails += "</div>";

                divImageRate.InnerHtml = strImageRateDetails;

                if (Convert.ToString(dsMt.Tables[0].Rows[0]["YoutubeCode"]) != "")
                {
                    divVideo.Visible = true;
                    iframe.Src = "https://www.youtube.com/embed/" + Convert.ToString(dsMt.Tables[0].Rows[0]["YoutubeCode"]) + "?version=3&loop=1&controls=1&rel=0&modestbranding=1&playlist=" + Convert.ToString(dsMt.Tables[0].Rows[0]["YoutubeCode"]);
                }

                string importantInfo = string.Empty;
                importantInfo += "<ul class=\"ssImpinfoList\">";
                for (int y = 0; y < dsMt.Tables[2].Rows.Count; y++)
                {
                    importantInfo += "<li>";
                    string icon = string.Empty;
                    switch (Convert.ToString(dsMt.Tables[2].Rows[y]["ExcursionInfoName_B2C"]))
                    {
                        case "Operational days":
                        case "Must Read":
                            icon = "check-square-o";
                            break;
                        case "Note":
                            icon = "calendar";
                            break;
                        case "Cancellation":
                            icon = "window-close-o";
                            break;
                        default:
                            icon = "check-square-o";
                            break;
                    }
                    importantInfo += "<i class=\"fa fa-" + icon + " fa-fw red_txt\"></i>";
                    importantInfo += "<strong>" + Convert.ToString(dsMt.Tables[2].Rows[y]["ExcursionInfoName_B2C"]) + "</strong> " + Convert.ToString(dsMt.Tables[2].Rows[y]["ExcursionInfoDetails"]);
                    importantInfo += "</li>";
                }
                if (dsMt.Tables[2].Select("[ExcursionInfoName_B2C] = 'Must Read'").Length == 0)
                {
                    importantInfo += "<li>";
                    importantInfo += "<i class=\"fa fa-check-square-o fa-fw red_txt\"></i>";
                    importantInfo += "<strong>Must Read</strong>";
                    importantInfo += "Please select an indicative travel date.<br/>";
                    importantInfo += "If you have chosen a with-swiss-pass discounted rate, your voucher will be valid till the last date of validity of the pass and can be utilized once during that period.<br/>";
                    importantInfo += "If you have chosen any other rate (full fare, with-Eurail-Pass fare), your voucher will be valid for 30 days from the chosen date";
                    importantInfo += "</li>";
                }
                importantInfo += "</ul>";
                divImportantInfo.InnerHtml = importantInfo;

                /*String strReview = "";
                strReview += "<p><i class=\"fa fa-commenting red_txt\" style=\"font-size: 15px\"></i><strong class=\"black_txt text-uppercase\">Travellers Reviews</strong></p>";
                strReview += "<iframe  src=\"https://www.tripadvisor.com/WidgetEmbed-cdspropertydetail?display=true&amp;partnerId=8E6CA032B62042C199172F3A61C3AA42&amp;lang=en_IN&amp;locationId=" + Convert.ToString(dsMt.Tables[0].Rows[0]["TripAdvisorId"]) + "\" id=\"IframeReview\" marginwidth=\"0\" width=\"100%\" scrolling=\"Yes\" height=\"500\" marginheight=\"0\" frameborder=\"0\" allowtransparency=\"true\" class=\"exc_TP\"></iframe>";
                divIframeTripAdvisor.InnerHtml = strReview;*/



                DataTable dtMountaindetailsinfo = new DataTable();
                StringBuilder htmlInfo = new StringBuilder();
                try
                {
                    oClsEurail.MtExId = MtExId;
                    oClsEurail.AgencyId = Convert.ToInt32(oLoginDetail.AgencyId);
                    dtMountaindetailsinfo = oClsEurail.GetMountainsInfo_Seo();
                }
                catch (Exception ex) { }

                if (dtMountaindetailsinfo.Rows.Count > 0)
                {
                    DataTable dtHeading = new DataTable();
                    dtHeading = dtMountaindetailsinfo.DefaultView.ToTable(true, "HSequence", "Heading", "HeadingType");

                    for (int i = 0; i < dtHeading.Rows.Count; i++)
                    {
                        string HSequence = "", Heading = "", HeadingType = ""; int SHSequence = 0;
                        HSequence = Convert.ToString(dtHeading.Rows[i]["HSequence"]);
                        Heading = Convert.ToString(dtHeading.Rows[i]["Heading"]);
                        HeadingType = Convert.ToString(dtHeading.Rows[i]["HeadingType"]);
                        //SHSequence = Convert.ToInt32(dtHeading.Rows[i]["SHSequence"]);
                        DataTable dtData = new DataTable();
                        dtData = dtMountaindetailsinfo.Select("HSequence=" + HSequence + " and Heading='" + Heading + "' and HeadingType='" + HeadingType + "'").CopyToDataTable();
                        if (HeadingType.ToUpper() == "H2" || HeadingType.ToUpper() == "H21")
                        {
                            if (HeadingType.ToUpper() != "H21") { htmlInfo.Append("<" + HeadingType + ">" + Heading + "</" + HeadingType + ">"); }

                            for (int d = 0; d < dtData.Rows.Count; d++)
                            {
                                if (!string.IsNullOrEmpty(dtData.Rows[d]["DataType"].ToString()))
                                {
                                    htmlInfo.Append("<" + Convert.ToString(dtData.Rows[d]["DataType"]).Replace("Paragraph", "P") + ">" + Convert.ToString(dtData.Rows[d]["TextData"]) + "</" + Convert.ToString(dtData.Rows[d]["DataType"]).Replace("Paragraph", "P") + ">");
                                }

                            }
                            //htmlInfo.Append("");
                        }
                        else if (HeadingType.ToUpper() == "UL")
                        {
                            htmlInfo.Append("<ul>");
                            for (int d = 0; d < dtData.Rows.Count; d++)
                            {
                                htmlInfo.Append("<" + Convert.ToString(dtData.Rows[d]["DataType"]).Replace("List", "li") + ">" + Convert.ToString(dtData.Rows[d]["TextData"]) + "</" + Convert.ToString(dtData.Rows[d]["DataType"]).Replace("List", "li") + ">");
                            }
                            htmlInfo.Append("</ul>");
                        }
                        else if (HeadingType.ToUpper() == "TABLE")
                        {
                            htmlInfo.Append("<Table width='500px'>");

                            DataTable dtTRHead = new DataTable();
                            dtTRHead = dtData.Select("DataType='tr'").CopyToDataTable();
                            htmlInfo.Append("<tr>");
                            for (int tr = 0; tr < dtTRHead.Rows.Count; tr++)
                            {
                                htmlInfo.Append("<th>" + Convert.ToString(dtTRHead.Rows[tr]["TextData"]) + "</th>");
                            }
                            htmlInfo.Append("</tr>");

                            DataTable dtTD = new DataTable();
                            //if (Convert.ToString(dtData.Rows[i]["datatype"])=="")
                            dtTD = dtData.Select("DataType='td'").CopyToDataTable();
                            for (int td = 0; td < dtTD.Rows.Count; td++)
                            {
                                htmlInfo.Append("<tr>");
                                string strTd = Convert.ToString(dtTD.Rows[td]["TextData"]);
                                for (int s = 0; s < strTd.Split(';').Length; s++)
                                {
                                    htmlInfo.Append("<td>" + Convert.ToString(strTd.Split(';')[s]) + "</td>");
                                }
                                htmlInfo.Append("</tr>");
                                //htmlInfo.Append("<" + Convert.ToString(dtData.Rows[d]["DataType"]).Replace("List", "li") + ">" + Convert.ToString(dtData.Rows[d]["TextData"]) + "</" + Convert.ToString(dtData.Rows[d]["DataType"]).Replace("List", "li") + ">");
                            }
                            htmlInfo.Append("</Table>");
                        }
                        if (i == 0)
                        {
                            aboutInfo.InnerHtml = htmlInfo.ToString();
                            htmlInfo = new StringBuilder();
                        }

                    }


                    //htmlInfo.Append("<span class='morelink text-center' style='background: #ffffff !important;'><a class='more' style='display: inline;'>Read more</a></span>");
                    divExcursionPoints.InnerHtml = htmlInfo.ToString();
                    //String ExcursionDetails = Convert.ToString(dsMt.Tables[0].Rows[0]["ExcursionDetails"]);
                    //ExcursionDetails = ExcursionDetails.Replace("li>", "p>");// removeing li to p because in new site designer used p but it was earlier li
                    //if (ExcursionDetails.IndexOf("<span") >= 0)
                    //    ExcursionDetails = ExcursionDetails.Remove(ExcursionDetails.IndexOf("<span"));// removeing string after ward where ever useed <span.. this is not sutable for new site..once go fully live b2b/b2c then we can remove it from there;
                    //ExcursionDetails = ExcursionDetails.Replace("Popular Routes :", "<b>Popular Routes :</b>");
                    //divExcursionPoints.InnerHtml = ExcursionDetails;
                }
                else
                {
                    String ExcursionDetails = Convert.ToString(dsMt.Tables[0].Rows[0]["ExcursionDetails"]);
                    ExcursionDetails = ExcursionDetails.Replace("li>", "p>");// removeing li to p because in new site designer used p but it was earlier li
                    if (ExcursionDetails.IndexOf("<span") >= 0)
                        ExcursionDetails = ExcursionDetails.Remove(ExcursionDetails.IndexOf("<span"));// removeing string after ward where ever useed <span.. this is not sutable for new site..once go fully live b2b/b2c then we can remove it from there;
                    ExcursionDetails = ExcursionDetails.Replace("Popular Routes :", "<b>Popular Routes :</b>");
                    aboutInfo.InnerHtml = ExcursionDetails;
                    //divExcursionPoints.InnerHtml = ExcursionDetails;
                    //htmlInfo.Append(htmlInfo.ToString() + "<span class='morelink text-center' style='background: #ffffff !important;'><a class='more' style='display: inline;'>Read more</a></span>");
                    //divExcursionPoints.InnerHtml = htmlInfo.ToString();

                }
                if (Convert.ToString(dsMt.Tables[0].Rows[0]["OfferValidityStartDate"]) != "" && Convert.ToString(dsMt.Tables[0].Rows[0]["OfferValidityDate"]) != "")
                {
                    hdnOfferSDate.Value = Convert.ToDateTime(dsMt.Tables[0].Rows[0]["OfferValidityStartDate"]).ToString("yyyyMMdd");
                    hdnOfferEDate.Value = Convert.ToDateTime(dsMt.Tables[0].Rows[0]["OfferValidityDate"]).ToString("yyyyMMdd");

                }
                hdnValidityDate.Value = Convert.ToDateTime(dsMt.Tables[0].Rows[0]["ValidityDate"]).ToString("dd/MM/yyyy").Replace("-", "/");


                string strCalStartDate = "";
                DateTime currentDate = new DateTime();
                currentDate = DateTime.Now;
                if (dsMt.Tables[2].Rows.Count > 0)
                {

                    if (dsMt.Tables[2].Select("Excursion_Mntn_CloseDate<>''").Length > 0)
                    {
                        string DateRange = Convert.ToString(dsMt.Tables[2].Select("Excursion_Mntn_CloseDate<>''")[0]["Excursion_Mntn_CloseDate"]);
                        string ArrDateRange = "";
                        for (var i = 0; i < DateRange.Split('|').Length; i++)
                        {
                            string DateSplit = Convert.ToString(DateRange.Split('|')[i]);
                            if (DateSplit.Split('~').Length > 0)
                            {
                                DateTime startDate = Convert.ToDateTime(DateSplit.Split('~')[0]);
                                DateTime endDate = Convert.ToDateTime(DateSplit.Split('~')[1]);

                                if (startDate >= currentDate && strCalStartDate == "")
                                    strCalStartDate = "";
                                else if (endDate >= currentDate && strCalStartDate == "")
                                    strCalStartDate = endDate.AddDays(1).ToString("dd MMM yyyy");

                                for (int d = 0; startDate <= endDate; d++)
                                {
                                    if (ArrDateRange == "")
                                        ArrDateRange = "\"" + startDate.ToString("dd MMM yyyy") + "\"";
                                    else
                                        ArrDateRange += ", \"" + startDate.ToString("dd MMM yyyy") + "\"";
                                    startDate = startDate.AddDays(1);
                                }
                            }

                        }

                        hdnMaintenanceCloseDate.Value = ArrDateRange;
                    }
                }
                ///Start Calling btnGetRates_Click fucntion on Tarvel date basis on page load
                ///<Author>Rajanikant Bhanu</Author>
                ///<InseretedDate>26 Feb 2019 03:43PM</InseretedDate>
                ///<AuthorRemarks>
                ///here "strCalStartDate" variable will hold latest available date and "btnGetRates_Click" funcation will show respective selected date rates                    
                ///</AuthorRemarks>  
                ///<ApprovedBy>Shreya Patil (27 Feb 2019 10:39AM)</ApprovedBy>
                hdnMtStartDate.Value = strCalStartDate == "" ? currentDate.ToString("dd MMM yyyy") : strCalStartDate;
                #region Lake Lucerne disable sun, tue, wed, fri days
                string TempData = "";
                if (dsMt.Tables[2].Rows.Count > 0)
                {
                    DateTime startDate = Convert.ToDateTime(hdnMtStartDate.Value);
                    DateTime endDate = Convert.ToDateTime(hdnValidityDate.Value, dateFormatInfo);
                    if (dsMt.Tables[2].Select("Excursion_OpenDays<>''").Length > 0)
                    {
                        string strOpenDaysData = Convert.ToString(dsMt.Tables[2].Select("Excursion_OpenDays<>''")[0]["Excursion_OpenDays"]);
                        if (!String.IsNullOrEmpty(strOpenDaysData))
                        {
                            string[] strOpenDaysPart = strOpenDaysData.Split('|');
                            for (int d = 0; d < strOpenDaysPart.Length; d++)
                            {
                                string[] strDatenDays = Convert.ToString(strOpenDaysPart[d]).Split('#');
                                if (strDatenDays.Length > 0)
                                {
                                    DateTime FromDate = Convert.ToDateTime(strDatenDays[0].Split('~')[0]);
                                    DateTime ToDate = Convert.ToDateTime(strDatenDays[0].Split('~')[1]);
                                    string weekDays = Convert.ToString(strDatenDays[1]);
                                    for (int m = 0; FromDate <= ToDate; m++)
                                    {
                                        string DayOfWeek = FromDate.ToString("ddd").ToUpper();
                                        //$A$1 <= A2 &$A$366 >= A2
                                        if (startDate <= FromDate && endDate >= FromDate && (!weekDays.ToUpper().Contains(DayOfWeek)))
                                        {
                                            hdnMaintenanceCloseDate.Value += ", \"" + FromDate.ToString("dd MMM yyyy") + "\"";
                                        }

                                        FromDate = FromDate.AddDays(1);
                                    }
                                }

                            }

                        }

                    }
                }
                // below code was for only MtExId=21 now we have implemnted above for all those have close and open days
                if (MtExId == 21111)
                {
                    DateTime startDate = Convert.ToDateTime(hdnMtStartDate.Value);
                    DateTime endDate = Convert.ToDateTime(hdnValidityDate.Value, dateFormatInfo);
                    for (int d = 0; startDate <= endDate; d++)
                    {
                        string DayOfWeek = Convert.ToString(startDate.DayOfWeek);
                        if (startDate <= Convert.ToDateTime("2020-06-30") && (DayOfWeek == "Sunday" || DayOfWeek == "Wednesday" || DayOfWeek == "Friday"))
                        {
                            hdnMaintenanceCloseDate.Value += ", \"" + startDate.ToString("dd MMM yyyy") + "\"";
                        }
                        else if (startDate >= Convert.ToDateTime("2020-06-30") && (DayOfWeek == "Sunday" || DayOfWeek == "Tuesday" || DayOfWeek == "Wednesday" || DayOfWeek == "Friday"))
                        {
                            hdnMaintenanceCloseDate.Value += ", \"" + startDate.ToString("dd MMM yyyy") + "\"";
                        }
                        startDate = startDate.AddDays(1);
                    }
                }
                #endregion

            }
            else
            {
                Response.Redirect("/Info/PageNotFound.aspx?cntry=" + countrycode, false);
            }
        }
        else
        {
            Response.Redirect("/Info/PageNotFound.aspx?cntry=" + countrycode, false);
        }
    }
    protected void btnBookNow_Click(object sender, EventArgs e)
    {
        oClsEurail.MtExId = MtExId;
        oClsEurail.AgencyId = Convert.ToInt32(oLoginDetail.AgencyId);
        oClsEurail.Currency = oLoginDetail.UrlCurrency;
        oClsEurail.Days = "999";
        oClsEurail.FromDate = Convert.ToDateTime(depDate.Value, dateFormatInfo);
        dsMt = oClsEurail.Get_Mountain_Excursions_wise_Details();
        //dsMt = (DataSet)Session[strSessionName];
        int noEx = 0;
        try
        {
            if (dsMt != null)
            {


                if (dsMt.Tables.Count == 4 && Convert.ToDateTime(depDate.Value, dateFormatInfo) <= Convert.ToDateTime(hdnValidityDate.Value, dateFormatInfo))
                {
                    HtmlSelect ddlPax = new HtmlSelect();
                    #region offer code
                    ///<Authour>Shreya Patil</Authour>
                    ///<InseretedDate>25 Feb 2019 01:03PM</InseretedDate>
                    ///<AuthourRemarks>
                    ///Below for loop use for buy 1 get 1 free, 50% off or child free so on.
                    ///strLoop = 1  used for buy 1 get 1 free
                    ///strLoop = 2  used for buy 1 get 50% free on 2
                    ///strLoop = 3  used for child free
                    ///</AuthourRemarks>      
                    ///<ApprovedBy>Rajani (27 Feb 2019 11:07)</ApprovedBy>

                    for (int c = 0; c < dsMt.Tables[1].Rows.Count; c++)
                    {
                        Int32 Id1 = 0; //this id for adult with swiss pass  
                        Int32 Id2 = 0; //this id for 1st child with swiss pass  
                        Int32 Id3 = 0; //this id for 2nd child with swiss pass  
                        //ddlPax = (HtmlSelect)rptMountainRates.Items[c].FindControl("ddlPax");
                        //if (MtExId == 32)
                        //    ddlPax = (HtmlSelect)rptMountainRates.Items[c].FindControl("ddlxPax");//we make dropdown with this name for helicopter excursion
                        if (Request.Form["ctl00$ContentPlaceHolder$rptMountainRates$ctl0"+(c+1)+"$ddlPax"] != null)
                        {
                            if (Convert.ToInt32(Request.Form["ctl00$ContentPlaceHolder$rptMountainRates$ctl0" + (c + 1) + "$ddlPax"]) >0)
                            {
                                noEx = Convert.ToInt32(Request.Form["ctl00$ContentPlaceHolder$rptMountainRates$ctl0" + (c + 1) + "$ddlPax"]);
                                for (int i = 1; i <= noEx; i++)
                                {
                                    String StrId = "";
                                    String strLoop = "";
                                    StrId = Convert.ToString(dsMt.Tables[1].Rows[c]["TariffId"]);

                                    #region For buy 1 get 1 free used strLoop 1  AND For buy 1 get 50% free used strLoop 2
                                    if (Convert.ToString(hdnIsOffer.Value) == "Yes")
                                    {
                                        if (countrycode == "IN" && hdnVisitCountry21.Value == "100715") //With Swiss Pass
                                        {
                                            switch (MtExId)
                                            {
                                                case 2://Hardum kulum buy 1 get 1 free
                                                    if (StrId == "1")
                                                        Id1++;
                                                    if (StrId == "69")
                                                        Id2++;
                                                    strLoop = "1";//For buy 1 get 1 free
                                                    break;
                                                case 35://Swiss Transport Museum
                                                    if (StrId == "1108")
                                                        Id1++;
                                                    if (StrId == "1109")
                                                        Id2++;
                                                    if (StrId == "1110")
                                                        Id3++;

                                                    strLoop = "2";
                                                    break;// For buy 1 get 50% free                                          

                                            }
                                        }
                                        else if (countrycode == "IN") //Not with swiss pass
                                        {
                                            switch (MtExId)
                                            {
                                                case 14://Swiss Miniatur buy 1 get 1 free
                                                    if (StrId == "50")
                                                        Id1++;
                                                    if (StrId == "51")
                                                        Id2++;
                                                    strLoop = "1";//For buy 1 get 1 free
                                                    break;
                                                case 40://diavolezza
                                                    if (StrId == "97")
                                                        Id1++;
                                                    if (StrId == "1133")
                                                        Id2++;
                                                    if (StrId == "1134")
                                                        Id3++;
                                                    strLoop = "1";//For buy 1 get 1 free
                                                    break;
                                                case 36://Aletsch Arena
                                                    if (StrId == "1")
                                                        Id1++;
                                                    if (StrId == "4")
                                                        Id2++;

                                                    strLoop = "1";//For buy 1 get 1 free 
                                                    break;
                                            }
                                        }
                                    }
                                    #endregion

                                    oClsEurail = new Eurail();
                                    oClsEurail.MtExId = MtExId;
                                    oClsEurail.TariffId = Convert.ToInt32(dsMt.Tables[1].Rows[c]["TariffId"]);
                                    oClsEurail.Currency = Convert.ToString(dsMt.Tables[1].Rows[c]["Currency"]);
                                    if (strLoop == "1")
                                    {
                                        if ((Id1 % 2 == 0 && Id1 != 0) || (Id2 % 2 == 0 && Id2 != 0))
                                        {
                                            oClsEurail.TariffRate = 0;
                                            oClsEurail.MarkUp = 0;
                                            oClsEurail.ROE = 0;
                                            oClsEurail.CnvtTariffRate = 0;
                                            oClsEurail.CourierCharges = 0;
                                            oClsEurail.BankCharges = 0;
                                            oClsEurail.BookingFee = 0;
                                        }
                                        else
                                        {
                                            oClsEurail.MarkUp = Convert.ToDecimal(dsMt.Tables[1].Rows[c]["MarkUp"]);
                                            oClsEurail.TariffRate = Convert.ToDecimal(dsMt.Tables[1].Rows[c]["ActualRate"]);
                                            oClsEurail.ROE = Convert.ToDecimal(dsMt.Tables[1].Rows[c]["ROE"]);
                                            oClsEurail.CnvtTariffRate = Convert.ToDecimal(dsMt.Tables[1].Rows[c]["Rate"]);
                                            oClsEurail.CourierCharges = Convert.ToDecimal(dsMt.Tables[1].Rows[c]["CourierCharges"]);
                                            oClsEurail.BankCharges = Convert.ToDecimal(dsMt.Tables[1].Rows[c]["BankCharges"]);
                                            oClsEurail.BookingFee = Convert.ToDouble(dsMt.Tables[1].Rows[c]["BookingFeeS"]);
                                            oClsEurail.ServiceTax = Convert.ToDouble(mrkup.Count > 0 ? mrkup[0].ServiceTax : 0);
                                        }
                                    }
                                    else if (strLoop == "2")
                                    {
                                        if ((Id1 % 2 == 0 && Id1 != 0) || (Id2 % 2 == 0 && Id2 != 0) || (Id3 % 2 == 0 && Id3 != 0))
                                        {
                                            oClsEurail.MarkUp = Convert.ToDecimal(dsMt.Tables[1].Rows[c]["MarkUp"]);
                                            oClsEurail.TariffRate = Convert.ToDecimal(dsMt.Tables[1].Rows[c]["ActualRate"]) / 2;
                                            oClsEurail.ROE = Convert.ToDecimal(dsMt.Tables[1].Rows[c]["ROE"]);
                                            oClsEurail.CnvtTariffRate = Convert.ToDecimal(dsMt.Tables[1].Rows[c]["Rate"]) / 2;
                                            oClsEurail.CourierCharges = Convert.ToDecimal(dsMt.Tables[1].Rows[c]["CourierCharges"]);
                                            oClsEurail.BankCharges = Convert.ToDecimal(dsMt.Tables[1].Rows[c]["BankCharges"]);
                                            oClsEurail.BookingFee = Convert.ToDouble(dsMt.Tables[1].Rows[c]["BookingFeeS"]);
                                            oClsEurail.ServiceTax = Convert.ToDouble(mrkup.Count > 0 ? mrkup[0].ServiceTax : 0);
                                        }
                                        else
                                        {
                                            oClsEurail.MarkUp = Convert.ToDecimal(dsMt.Tables[1].Rows[c]["MarkUp"]);
                                            oClsEurail.TariffRate = Convert.ToDecimal(dsMt.Tables[1].Rows[c]["ActualRate"]);
                                            oClsEurail.ROE = Convert.ToDecimal(dsMt.Tables[1].Rows[c]["ROE"]);
                                            oClsEurail.CnvtTariffRate = Convert.ToDecimal(dsMt.Tables[1].Rows[c]["Rate"]);
                                            oClsEurail.CourierCharges = Convert.ToDecimal(dsMt.Tables[1].Rows[c]["CourierCharges"]);
                                            oClsEurail.BankCharges = Convert.ToDecimal(dsMt.Tables[1].Rows[c]["BankCharges"]);
                                            oClsEurail.BookingFee = Convert.ToDouble(dsMt.Tables[1].Rows[c]["BookingFeeS"]);
                                            oClsEurail.ServiceTax = Convert.ToDouble(mrkup.Count > 0 ? mrkup[0].ServiceTax : 0);
                                        }
                                    }
                                    else if (strLoop == "3")//For Child Free
                                    {
                                        oClsEurail.TariffRate = 0;
                                        oClsEurail.MarkUp = 0;
                                        oClsEurail.ROE = 0;
                                        oClsEurail.CnvtTariffRate = 0;
                                        oClsEurail.CourierCharges = 0;
                                        oClsEurail.BankCharges = 0;
                                        oClsEurail.BookingFee = 0;
                                        oClsEurail.ServiceTax = 0;
                                    }
                                    else
                                    {
                                        oClsEurail.MarkUp = Convert.ToDecimal(dsMt.Tables[1].Rows[c]["MarkUp"]);
                                        oClsEurail.TariffRate = Convert.ToDecimal(dsMt.Tables[1].Rows[c]["ActualRate"]);
                                        oClsEurail.ROE = Convert.ToDecimal(dsMt.Tables[1].Rows[c]["ROE"]);
                                        oClsEurail.CnvtTariffRate = Convert.ToDecimal(dsMt.Tables[1].Rows[c]["Rate"]);
                                        oClsEurail.CourierCharges = Convert.ToDecimal(dsMt.Tables[1].Rows[c]["CourierCharges"]);
                                        oClsEurail.BankCharges = Convert.ToDecimal(dsMt.Tables[1].Rows[c]["BankCharges"]);
                                        oClsEurail.BookingFee = Convert.ToDouble(dsMt.Tables[1].Rows[c]["BookingFeeS"]);
                                        oClsEurail.ServiceTax = Convert.ToDouble(mrkup.Count > 0 ? mrkup[0].ServiceTax : 0);
                                    }

                                    oClsEurail.CnvtCurrency = Convert.ToString(dsMt.Tables[1].Rows[c]["CnvtCurrency"]);
                                    oClsEurail.AgencyId = Convert.ToInt32(oLoginDetail.AgencyId);
                                    oClsEurail.DeskId = Convert.ToInt32(oLoginDetail.UserMasterId);
                                    oClsEurail.BranchId = Convert.ToInt32(oLoginDetail.BranchId);
                                    oClsEurail.Years = Convert.ToDateTime(depDate.Value, dateFormatInfo).ToString("yyyy-MM-dd 00:00:00");
                                    oClsEurail.OfferValidityEndDate = Convert.ToDateTime(OfferValidityEndDate.Value, dateFormatInfo);
                                    oClsEurail.ImportantInfo = hdnImportantInfo.Value;
                                    oClsEurail.TransactionId = transId != "" ? transId : "";
                                    oClsEurail.Position = Convert.ToString(Session["Position"]) != "" ? Convert.ToInt32(Session["Position"]) : 1;
                                    Session["Position"] = Convert.ToString(oClsEurail.Position);
                                    transId = oClsEurail.Insert_Mountain_Excursions_Tariff_ShoppingCart();
                                }
                            }
                        }
                    }
                    #endregion
                    Session["TransId"] = transId;
                    Session["Position"] = Convert.ToString(Session["Position"]) != "" ? Convert.ToString(Convert.ToInt32(Session["Position"]) + 1) : "1";

                    Response.Redirect("/PassMtEx/ShoppingCart.aspx?TransId=" + Convert.ToString(Session["TransId"]) + "&cntry=" + countrycode, false);
                }
                else
                {
                    lblmsg.Text = "Opps! something went wrong. Contact your nearest branch.";
                }
            }
            else
            {
                lblmsg.Text = "Opps! something went wrong. Contact your nearest branch.";
            }
        }
        catch (Exception ex)
        {
            Utilities.ErrDetail oErrDetail = new Utilities.ErrDetail();
            oErrDetail.ModuleName = "Page_Load" + "##" + Convert.ToString(System.Web.HttpContext.Current.Request.Url.AbsolutePath);
            oErrDetail.ErrDescription = Convert.ToString(ex.Message) + "###" + Convert.ToString(ex.StackTrace);
            oErrDetail.AgencyId = Convert.ToDouble(oLoginDetail.AgencyId);
            oErrDetail.DeskId = Convert.ToDouble(oLoginDetail.UserMasterId);
            oErrDetail.SearchRefId = Convert.ToString(Session["SearchRefID"]);
            oErrDetail.TransactionId = Convert.ToString(Session["TransId"]);
            oErrDetail.Insert_ErrDetail();
            Response.Redirect("/Info/ErrorMessagepg.aspx?cntry=" + countrycode + "&Error=" + Convert.ToString(ex.Message), true);
        }

    }
    ///<Authour>Rajanikant Bhanu</Authour>
    ///<InseretedDate>3 jan 2019 11:49</InseretedDate>
    ///<AuthourRemarks>
    ///Below funcation has been created to bind excursion rates as per travel date. this button click event will fired if travel dated will be selected from calender.    
    ///</AuthourRemarks>      
    ///<ApprovedBy>Shreya Patil (3 Jan 2019 14:39)</ApprovedBy>
    protected void btnGetRates_Click(object sender, EventArgs e)
    {
        Bind_Mountain();
        depDate.Value = depDate.Value == "" ? hdnMtStartDate.Value : depDate.Value;
        oClsEurail.MtExId = MtExId;
        oClsEurail.AgencyId = Convert.ToInt32(oLoginDetail.AgencyId);
        oClsEurail.Currency = CnvtCurrency;
        oClsEurail.Days = "999";
        oClsEurail.FromDate = Convert.ToDateTime(depDate.Value, dateFormatInfo);
        dsMt = oClsEurail.Get_Mountain_Excursions_wise_Details();

        DataTable dtSummary = new DataTable();
        oClsEurail = new EurailClasses.Eurail();
        oClsEurail.TransactionId = Convert.ToString(Session["TransId"]);
        dtSummary = oClsEurail.Get_Eurail_Tariff_ShoppingCart_Summary();

        if (dsMt.Tables.Count == 4)
        {
            Session[strSessionName] = dsMt;
            if (dsMt.Tables[1].Rows.Count > 0)
            {
                //basically here we are finding said mountain is "With Swiss Pass" fare.
                Boolean flag = dsMt.Tables[1].Select("TariffCode='SWP'").Length > 0;

                string strOfferValidityEndDate = string.Empty;
                if (Convert.ToDateTime(dsMt.Tables[1].Rows[0]["OfferValidityEndDate"]).ToString("dd-MM-yyyy") == "01-01-1900")
                {
                    DataRow[] drRows = null;
                    drRows = dtSummary.Select("[OtherDetails] <> '' and ExcursionName like '%Swiss Travel Pass%'");
                    if (drRows.Length > 0)
                    {
                        string ValidityDuration = Convert.ToString(drRows[0]["OtherDetails"]).Split('#')[5].Replace("P", "");
                        if (ValidityDuration.Contains("D"))
                        {
                            ValidityDuration = ValidityDuration.Replace("D", "");
                            strOfferValidityEndDate = Convert.ToString(Convert.ToDateTime(drRows[0]["TravelDate"]).AddDays(Convert.ToInt32(ValidityDuration) - 1).ToString("dd-MM-yyyy"));
                        }
                        else
                        {
                            ValidityDuration = ValidityDuration.Replace("M", "");
                            strOfferValidityEndDate = Convert.ToString(Convert.ToDateTime(drRows[0]["TravelDate"]).AddMonths(Convert.ToInt32(ValidityDuration)).ToString("dd-MM-yyyy"));
                        }

                    }
                    else
                    {
                        if (Convert.ToString(dsMt.Tables[0].Rows[0]["MtExcursionLogo"]) == "39.png")
                        {
                            strOfferValidityEndDate = Convert.ToDateTime(depDate.Value, dateFormatInfo).ToString("dd-MM-yyyy");
                        }
                        else if (Convert.ToDateTime(depDate.Value, dateFormatInfo).AddDays(30) >= Convert.ToDateTime(dsMt.Tables[0].Rows[0]["ValidityDate"]))
                        {
                            strOfferValidityEndDate = Convert.ToDateTime(dsMt.Tables[0].Rows[0]["ValidityDate"]).ToString("dd-MM-yyyy");
                        }
                        else
                        {
                            strOfferValidityEndDate = Convert.ToDateTime(depDate.Value, dateFormatInfo).AddDays(30).ToString("dd-MM-yyyy");
                        }
                    }
                    ImportantInfo = "If you chose the discounted rate with the Swiss pass your voucher will be valid till the last date of your pass.<br/> Any other fare chosen will be valid for 30 days from your chosen date.";
                    if (!flag)
                        ImportantInfo = "Your voucher will be valid for 30 days from the chosen date.";
                    //below clouse is for all excursion whitch are "Best Of Switzerland"
                    if (Convert.ToString(dsMt.Tables[0].Rows[0]["MtExcursionLogo"]) == "39.png")
                        ImportantInfo = "Your voucher will be valid for the chosen date only.";
                    hdnImportantInfo.Value = ImportantInfoOnI = ImportantInfo.Replace("<br/>", "");
                }
                else
                {
                    strOfferValidityEndDate = Convert.ToDateTime(dsMt.Tables[1].Rows[0]["OfferValidityEndDate"]).ToString("dd-MM-yyyy");
                    ImportantInfo = "<ul><li>You have chosen a travel date of " + Convert.ToDateTime(depDate.Value, dateFormatInfo).ToString("dd-MM-yyyy") + ".</li> <li>Your voucher will be valid till " + strOfferValidityEndDate + ".</li> <li> If you wish to travel on a date later than " + Convert.ToDateTime(depDate.Value, dateFormatInfo).ToString("dd-MM-yyyy") + ".</li><li>Please select accordingly.</li></ul>";
                    hdnImportantInfo.Value = ImportantInfoOnI = ImportantInfo.Replace("<ul>", "").Replace("</ul>", "").Replace("<li>", "").Replace("</li>", "");
                }
                OfferValidityEndDate.Value = strOfferValidityEndDate;
                //hdnImportantInfo.Value = ImportantInfo = "You have chosen a travel date of " + Convert.ToDateTime(depDate.Value, dateFormatInfo).ToString("dd-MM-yyyy") + ". The last date of validity of your voucher will be "+ strOfferValidityEndDate + ". If you wish to travel on a date later than " + Convert.ToDateTime(depDate.Value, dateFormatInfo).ToString("dd-MM-yyyy") + ", please select accordingly.";

                hdnRateRow.Value = Convert.ToString(dsMt.Tables[1].Rows.Count);

                ////// jetboat strike rate commented for do the same from database
                //dsMt.Tables[1].Columns.Add("StrikeRate", typeof(System.Decimal));
                for (int i = 0; i < dsMt.Tables[1].Rows.Count; i++)
                {
                    if (dsMt.Tables[1].Rows[i]["MtExId"].ToString() == "19")
                    {
                        // DateTime startDate = Convert.ToDateTime(dsMt.Tables[1].Rows[i]["OfferValidityRateStartDate"], dateFormatInfo);
                        DateTime startDate = Convert.ToDateTime("01 Apr 2020");
                        DateTime endDate = Convert.ToDateTime(dsMt.Tables[1].Rows[i]["OfferValidityEndDate"], dateFormatInfo);

                        if (Convert.ToDateTime(depDate.Value) >= Convert.ToDateTime(startDate.ToString("dd MMM yyyy")) && Convert.ToDateTime(depDate.Value) <= Convert.ToDateTime(endDate.ToString("dd MMM yyyy")))
                        {
                            dsMt.Tables[1].Rows[i]["StrikeRate"] = dsMt.Tables[1].Rows[i]["ActualRate"];
                            switch (Convert.ToString(dsMt.Tables[1].Rows[i]["TariffId"]))
                            {
                                case "77":
                                    dsMt.Tables[1].Rows[i]["ActualRate"] = 95;
                                    break;
                                case "78":
                                    dsMt.Tables[1].Rows[i]["ActualRate"] = 65;
                                    break;
                            }
                            decimal rate = Convert.ToDecimal(dsMt.Tables[1].Rows[i]["ActualRate"]) * Convert.ToDecimal(dsMt.Tables[1].Rows[i]["ROE"]);
                            dsMt.Tables[1].Rows[i]["Rate"] = Math.Ceiling(Convert.ToDecimal(rate));

                        }
                    }

                }

                rptMountainRates.DataSource = dsMt.Tables[1];
                rptMountainRates.DataBind();
                string script = "window.onload = function() { CalPosition(); };";
                ClientScript.RegisterStartupScript(this.GetType(), "CalPosition", script, true);
                divbtn.Style.Remove("display");
            }
            else
            {
                divImageRate.InnerHtml = divImageRate.InnerHtml.Replace("Rate", "Rate noneIMP").Replace("ssPrice1 noneIMP", "ssPrice1");
                divCal.Visible = false;
            }
        }
    }

    public void Get_MountainHomeData()
    {
        try
        {
            DataSet ds = new DataSet();
            AdminClasses.OfferClass oOfferClass = new AdminClasses.OfferClass();
            oOfferClass.CountryCode = countrycode;
            oOfferClass.Currency = CnvtCurrency;
            oOfferClass.Case = "";
            oOfferClass.Site = "B2C";
            ds = oOfferClass.Get_MountainHomeData();

            if (ds.Tables.Count > 0)
            {
                string[] arrMtExIds = ds.Tables[0].AsEnumerable().Select(s => Convert.ToString(s.Field<string>("MtExIds"))).ToArray();
                string strMtExIds = string.Join(",", arrMtExIds);

                DataTable dt = new DataTable();
                dt = ds.Tables[1].Copy();
                dt = dt.Select("MtExId in(" + strMtExIds + ")").CopyToDataTable();
                dt = dt.Select("MtExId not in(" + MtExId + ")", "SequenceNo ASC").CopyToDataTable();
                #region "Home Page Packages"
                try
                {
                    divMountain.Visible = false;
                    if (dt.Rows.Count > 0)
                    {
                        //rptMountain.DataSource = ds.Tables[1].Select("MtExId not in(" + MtExId + ")", "SequenceNo ASC").CopyToDataTable();
                        rptMountain.DataSource = dt;
                        rptMountain.DataBind();
                        divMountain.Visible = true;
                    }
                }
                catch (Exception)
                {
                    divMountain.Visible = false;
                }
                #endregion
            }

        }
        catch (Exception)
        {

        }


    }
}