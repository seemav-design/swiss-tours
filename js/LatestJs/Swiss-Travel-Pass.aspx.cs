using AdminClasses;
using EurailClasses;
using RailEuropeClasses;
using System;
using System.Collections.Generic;
using System.Data;
using System.Globalization;
using System.Linq;
using System.Text.RegularExpressions;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Xml;
using System.Diagnostics;
using Newtonsoft.Json;
using System.Text;
using HotelClasses;
using System.Threading;

public partial class PassMtEx_Swiss_Travel_Pass : System.Web.UI.Page
{
    public String countrycode = "IN";
    public String cntryCurrency = "INR";
    Eurail oClsEurail = new Eurail();

    public String transId = "";
    LoginDetail oLoginDetail = new LoginDetail();
    GetFamilyList oGetFamilyList = new GetFamilyList();
    DateTimeFormatInfo dateFormatInfo = new DateTimeFormatInfo();
    List<MarkupDO> mrkup = new List<MarkupDO>();
    protected void Page_Load(object sender, EventArgs e)
    {
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
        dateFormatInfo.ShortDatePattern = "dd MMM yyyy"; //date format don't delete        

        if (!string.IsNullOrEmpty(oLoginDetail.UrlCountry))
        {
            var regexItem = new Regex("^[A-Z]*$");
            if (regexItem.IsMatch(Convert.ToString(oLoginDetail.UrlCountry)))
            {
                countrycode = Convert.ToString(oLoginDetail.UrlCountry);
                cntryCurrency = Convert.ToString(oLoginDetail.UrlCurrency);
                mrkup = new CommonFunction().Get_MarkUp_Comission_AgencyAndSupplierwise(Convert.ToInt32(oLoginDetail.AgencyId), 5);
                mrkup[0].ServiceTax = oLoginDetail.UrlCurrency == "INR" ? mrkup[0].ServiceTax : 0;

            }
        }
        //here createing Cookies for SWISSPASS if landing here from google search and our campaian.
        if (!string.IsNullOrEmpty(Request.QueryString["utm_source"]))// && !string.IsNullOrEmpty(Request.QueryString["utm_medium"]) && !string.IsNullOrEmpty(Request.QueryString["utm_campaign"]))
        {
            String strUtm = Convert.ToString(Request.QueryString["utm_source"]) + "|" + Convert.ToString(Request.QueryString["utm_medium"]) + "|" + Convert.ToString(Request.QueryString["utm_campaign"]) + "|" + Convert.ToDateTime(DateTime.Now).ToString("yyyyMMddhhmmtt");
            if (Request.Cookies["utmSwissPass"] != null)
                Response.Cookies["utmSwissPass"].Expires = DateTime.Now.AddDays(-1);

            HttpCookie utmSwissPass = new HttpCookie("utmSwissPass");
            utmSwissPass.Value = strUtm;
            utmSwissPass.Expires = DateTime.Now.AddDays(30.0);
            Response.Cookies.Add(utmSwissPass);
        }
        Session["PassCurrency"] = countrycode;

        transId = Convert.ToString(Session["TransId"]);


        if (!IsPostBack)
        {
            // here we are storing refer source
            if (!string.IsNullOrEmpty(Request.QueryString["utm_source"]))
            {
                string strSource = Convert.ToString(Request.QueryString["utm_source"]);
                string strLPage = Convert.ToString(Request.Path).Replace("/", "");
                ThreadStart tsPageSource = delegate { try { LoginSession.Insert_Page_Source_Master(strLPage, strSource, oLoginDetail.UrlCountry, oLoginDetail.UrlCountryName, oLoginDetail.IPAddress); } catch (Exception ex2) { } };
                Thread thPageSource = new Thread(tsPageSource);
                thPageSource.Start();
            }
            if (Request.Path.IndexOf("aspx") > 0)
            {
                Response.Status = "301 Moved Permanently";
                Response.AddHeader("Location", "/swiss-travel-pass");
            }
            LoadFamily();
            divExcursionPoints.InnerHtml = Convert.ToString(BindAboutInfo(100715));
            //ddlPassFamily.Items[2].Selected = true;//Brit Rail
            //ddlPassFamily.Items[39].Selected = true;//swiss tarvel Pass
            ddlPassFamily.SelectedIndex = ddlPassFamily.Items.IndexOf(ddlPassFamily.Items.FindByText("Swiss Travel Pass"));
            ddlPassFamily_SelectedIndexChanged(sender, e);
        }
    }
    public void LoadFamily()
    {
        if (!string.IsNullOrEmpty(Convert.ToString(oLoginDetail.BranchId)))
        {
            try
            {
                DataTable dt = new DataTable();

                RailEuropeRea oOfferClass = new RailEuropeRea();
                dt = oOfferClass.GetFamily(Convert.ToInt32(oLoginDetail.BranchId), countrycode);

                if (dt.Rows.Count > 0)
                {

                    //If familyname contain eurail then it is replace by empty space and the pass string replace by "Eurail Pass" string(eg. "Eurail Global Pass" is replace with "Global Eurail Pass")
                    var result = (from d in dt.AsEnumerable()
                                  let value = d.Field<string>("FamilyName").ToUpper().Contains("EURAIL").ToString()
                                  select new
                                  {
                                      FamilyName = value == "True" ? Convert.ToString(d.Field<string>("FamilyName")).Replace("Eurail ", "").Replace(" Pass", " Eurail Pass") : Convert.ToString(d.Field<string>("FamilyName")),
                                      //FamilyId = d.Field<int>("FamilyId") + ";" + (d.Field<int?>("PromoFamilyId") == null ? 0 : d.Field<int?>("PromoFamilyId")) + ";" + (d.Field<string>("PromoFamilyText") == null ? "" : d.Field<string>("PromoFamilyText")) + ";" + (d.Field<string>("WithoutPromoFamilyText") == null ? "" : d.Field<string>("WithoutPromoFamilyText")) + ";" + (d.Field<string>("CoveredCountryCode")) + ";" + (d.Field<string>("CoveredCountryName")),
                                      FamilyId = d.Field<int>("FamilyId") + ";" + (d.Field<int?>("PromoFamilyId") == null ? 0 : d.Field<int?>("PromoFamilyId")) + ";" + (d.Field<string>("PromoFamilyText") == null ? "" : d.Field<string>("PromoFamilyText")) + ";" + (d.Field<string>("WithoutPromoFamilyText") == null ? "" : d.Field<string>("WithoutPromoFamilyText")),
                                  }).ToList();

                    Session["PassFamilyList"] = dt;

                    ddlPassFamily.DataSource = result;
                    ddlPassFamily.DataBind();
                    ddlPassFamily.Items.Insert(0, new ListItem("Explore Other Passes", "-1"));

                    //System.Web.HttpContext.Current.Session["REMemberKey"] = hdnREAKey.Value = Convert.ToString(dt.Rows[0]["REAKey"]);
                    System.Web.HttpContext.Current.Session["REMemberKey"] = Convert.ToString(dt.Rows[0]["REAKey"]);

                    Get_MountainHomeData();
                    string htmlMountainExcursion = string.Empty;
                    //Eurail oClsEurail = new Eurail();
                    //oClsEurail.MtExId = 0;
                    //oClsEurail.AgencyId = Convert.ToInt32(oLoginDetail.AgencyId);
                    //oClsEurail.Currency = cntryCurrency;
                    //oClsEurail.Days = "123456";
                    ////oClsEurail.FromDate = Convert.ToDateTime(depDate.Value, dateFormatInfo);
                    //DataSet dsMt = oClsEurail.Get_Mountain_Excursions_wise_Details();
                    //if (dsMt.Tables[3].Rows.Count > 0)
                    //{
                    //    rptMtExRest.DataSource = dsMt.Tables[3];
                    //    rptMtExRest.DataBind();
                    //}

                    /*string htmlBlogs = string.Empty;
                    DataTable dtBlog = new DataTable();
                    dtBlog = new blog().Get_BlogLsit_for_Condition();

                    if (dtBlog.Rows.Count > 0)
                    {
                        for (int i = 0; i < dtBlog.Rows.Count; i++)
                        {
                            htmlBlogs += "<div>";
                            htmlBlogs += "<div class='blogBox fade_anim'>";
                            htmlBlogs += "<div class='blogImg'>";
                            htmlBlogs += "<img src = \"/images/blog/" + Convert.ToString(dtBlog.Rows[i]["BoxImage"]) + "\" />";
                            htmlBlogs += "</div>";
                            htmlBlogs += "<div class='blogIntro'>";
                            htmlBlogs += "<div class='blogDate text-uppercase'>" + Convert.ToString(dtBlog.Rows[i]["PostDate"]) + "</div>";
                            htmlBlogs += "<h2 class='red_txt text-uppercase'>" + Convert.ToString(dtBlog.Rows[i]["Title"]) + "</h2>";
                            htmlBlogs += "<p>" + Convert.ToString(dtBlog.Rows[i]["ShortDescription"]) + "</p>";
                            htmlBlogs += "<a href = \"blog/" + Convert.ToString(dtBlog.Rows[i]["SubTitle"]) + "\" class='cta btn'>Read More</a>";
                            htmlBlogs += "</div>";
                            htmlBlogs += "</div>";
                            htmlBlogs += "</div>";
                        }

                        divBlogs.InnerHtml = htmlBlogs;
                    }*/
                }
            }
            catch { Response.Redirect("~/Default.aspx", true); }
        }
        else { Response.Redirect("~/Default.aspx", true); }
    }

    //public void Get_MountainHomeData()
    //{
    //    try
    //    {
    //        DataSet ds = new DataSet();
    //        AdminClasses.OfferClass oOfferClass = new AdminClasses.OfferClass();
    //        oOfferClass.CountryCode = countrycode;
    //        oOfferClass.Currency = cntryCurrency;
    //        oOfferClass.Case = "";
    //        oOfferClass.Site = "B2C";
    //        ds = oOfferClass.Get_MountainHomeData();

    //        if (ds.Tables.Count > 0)
    //        {

    //            #region "Home Page Packages"
    //            try
    //            {
    //                divMountain.Visible = false;
    //                if (ds.Tables[1].Rows.Count > 0)
    //                {
    //                    rptMountain.DataSource = ds.Tables[1];
    //                    rptMountain.DataBind();
    //                    divMountain.Visible = true;
    //                }
    //            }
    //            catch (Exception)
    //            {
    //                divMountain.Visible = false;
    //            }
    //            #endregion
    //        }

    //    }
    //    catch (Exception)
    //    {

    //    }


    //}
    public void Get_MountainHomeData()
    {
        try
        {
            DataSet ds = new DataSet();
            AdminClasses.OfferClass oOfferClass = new AdminClasses.OfferClass();
            oOfferClass.CountryCode = countrycode;
            oOfferClass.Currency = cntryCurrency;
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

                #region "Home Page Packages"
                try
                {
                    divMountain.Visible = false;
                    if (dt.Rows.Count > 0)
                    {
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

    public List<ProductFamilyListDO> GetPassResult(int Type, string ToCurrency, SearchRailParam searchParam)
    {
        List<ProductFamilyListDO> List = new List<ProductFamilyListDO>();

        if (!string.IsNullOrEmpty(Convert.ToString(HttpContext.Current.Session["PassCurrency"])))
        {
            try
            {
                RailEuropeRea RailPass = new RailEuropeRea();

                DataTable dtSummary = new DataTable();
                EurailClasses.Eurail oClsEurail = new EurailClasses.Eurail();
                oClsEurail.TransactionId = Convert.ToString(Session["TransId"]);
                Stopwatch timer = new Stopwatch();
                timer.Start();
                dtSummary = oClsEurail.Get_Eurail_Tariff_ShoppingCart_Summary();
                var x = timer.Elapsed;
                timer.Stop();

                DataRow[] drBranchRows = null;
                drBranchRows = dtSummary.Select("[OtherDetails] <> ''");
                int RespBranchId = 0;
                searchParam.Type = Type;
                if (Type == 1)
                {
                    searchParam.SearchRefId = "";
                    searchParam.CountryCode = "CH";
                    searchParam.SearchCountryCode = "BB";
                    searchParam.CountryName = "Switzerland";
                    searchParam.TravelDate = DateTime.Now.AddDays(1);
                    searchParam.AgencyId = Convert.ToInt32(oLoginDetail.AgencyId);
                    searchParam.BranchId = Convert.ToInt32(oLoginDetail.BranchId);
                    searchParam.CorrelationID = Convert.ToString(Session["CorrelationID"]);
                    searchParam.BranchSelect = "false";
                    if (countrycode == "IN")
                    {
                        if (drBranchRows.Length > 0)
                        {
                            RespBranchId = Convert.ToInt32(drBranchRows[0]["RespBranchId"]);
                            hdnBranchValue.Value = Convert.ToString(RespBranchId);
                            searchParam.BranchSelect = "true";
                        }
                        else { RespBranchId = Convert.ToInt32(oLoginDetail.BranchId); }
                    }
                    else
                    {
                        RespBranchId = 14;
                        hdnBranchValue.Value = Convert.ToString("14");
                        searchParam.BranchSelect = "true";
                    }
                    searchParam.RespBranchId = RespBranchId;
                    searchParam.SellCurrency = ToCurrency;
                    searchParam.NoOfAdult = 1;
                    searchParam.NoOfYouth = 1;
                    //searchParam.NoOfSenior = 1;
                    searchParam.NoOfChild = 1;
                    searchParam.ChildAges = "12";
                    //hdnFamilyCardCount.Value = "1";

                    hdnNoOfAdult.Value = "1";
                    hdnNoOfYouth.Value = "0";
                    //hdnNoOfSenior.Value = "1";
                    hdnNoOfChild.Value = "0";
                    hdnChildAge.Value = "12";
                    //hdnChildSelected.Value = "0";
                }
                Session["SearchRailParam"] = searchParam;
                List<ProductDO> productList = new List<ProductDO>();
                XmlDocument xmldoc = new XmlDocument();
                string strResp = new SearchRailBLL().SearchPass(searchParam);
                xmldoc.LoadXml(strResp);

                XmlNodeList nodelist = xmldoc.SelectNodes("//ArrayOfRailSearchResponse/RailSearchResponse");

                foreach (XmlNode htnode in nodelist)
                {
                    ProductDO ls = new ProductDO();
                    ls.FamilyName = htnode.SelectSingleNode("FamilyName").InnerText;
                    ls.ProductName = htnode.SelectSingleNode("ProductName").InnerText;
                    ls.DefaultPassengerType = htnode.SelectSingleNode("DefaultPassengerType").InnerText;
                    ls.PassengerType = htnode.SelectSingleNode("PassengerType").InnerText;
                    ls.NetAdultPrice = Convert.ToSingle(htnode.SelectSingleNode("NetAmount").InnerText);
                    ls.BaseAdultPrice = Convert.ToSingle(htnode.SelectSingleNode("NetPrice").InnerText);
                    ls.FamilyId = Convert.ToInt32(htnode.SelectSingleNode("FamilyId").InnerText);
                    ls.ProductId = htnode.SelectSingleNode("ProductId").InnerText;
                    ls.PassType = htnode.SelectSingleNode("PassType").InnerText;
                    ls.PassClass = htnode.SelectSingleNode("PassClass").InnerText;
                    ls.NetCurrency = htnode.SelectSingleNode("NetCurrency").InnerText;
                    ls.Type = htnode.SelectSingleNode("Type").InnerText;
                    ls.SellCurrency = htnode.SelectSingleNode("SellCurrency").InnerText;
                    ls.SellAdultPrice = Convert.ToSingle(htnode.SelectSingleNode("SellAmount").InnerText);
                    ls.Info = htnode.SelectSingleNode("Info").InnerText;
                    ls.PassengerCount = Convert.ToInt32(htnode.SelectSingleNode("PassengerCount").InnerText);
                    ls.AgeLimit = htnode.SelectSingleNode("AgeLimit").InnerText;
                    ls.ExchangeRate = Convert.ToSingle(htnode.SelectSingleNode("ExchangeRate").InnerText);
                    ls.OtherDetails = htnode.SelectSingleNode("OtherDetails").InnerText;
                    ls.SearchId = htnode.SelectSingleNode("SearchId").InnerText;
                    ls.TravellerId = htnode.SelectSingleNode("TravellerId").InnerText;
                    ls.Duration = htnode.SelectSingleNode("Duration").InnerText;
                    ls.ValidityDuration = htnode.SelectSingleNode("ValidityDuration").InnerText;
                    ls.EraKey = htnode.SelectSingleNode("EraKey").InnerText;
                    ls.Tags = htnode.SelectSingleNode("Tags").InnerText;
                    productList.Add(ls);
                }

                if (Convert.ToInt32(Convert.ToDateTime(oLoginDetail.ServerCurrentDate).ToString("yyyyMMdd")) > 20210630 && Convert.ToInt32(Convert.ToDateTime(oLoginDetail.ServerCurrentDate).ToString("yyyyMMdd")) < 20210801)
                {
                    var prodt = (from d in productList
                                 where d.FamilyName.IndexOf("PROMO") >= 0
                                 select d).ToList();
                    ///start of adding non promo price in promo price to show in strike way
                    var prodt2 = (from d in productList
                                  where d.FamilyName.IndexOf("PROMO") < 0
                                  select d).ToList();
                    if (prodt.Count > 0 && prodt2.Count > 0)
                    {
                        foreach (var item in prodt)
                        {
                            item.StrikePrice = prodt2.Where(r =>
                            r.DefaultPassengerType == item.DefaultPassengerType
                            && r.Duration == item.Duration
                            && r.ValidityDuration == item.ValidityDuration
                            && r.Type == item.Type
                            && r.PassClass == item.PassClass
                            && r.PassType == item.PassType
                            //&& r.ProductName == item.ProductName
                            && r.PassengerType == item.PassengerType
                            ).Select(r => r.NetAdultPrice).FirstOrDefault();
                        }
                        productList = prodt;
                    }
                    else { productList = prodt; }
                    //prodt.AddRange(prodt2);
                    ///end of adding non promo price in promo price to show in strike way

                }
                else if (Convert.ToInt32(Convert.ToDateTime(oLoginDetail.ServerCurrentDate).ToString("yyyyMMdd")) > 20210731)
                {
                    var prodt = (from d in productList
                                 where d.FamilyName.IndexOf("PROMO") < 0
                                 select d).ToList();
                    productList = prodt;
                }


                List = (from d in productList
                        group d by d.PassType into grp
                        select new ProductFamilyListDO
                        {
                            PassType = CultureInfo.CurrentCulture.TextInfo.ToTitleCase(grp.First().PassType),
                            LblFamily = grp.First().PassType == "saver" ? grp.First().PassengerCount + " to 5 Person" : "",
                            Benefits = "",
                            HowItWorks = "",
                            Info = grp.First().Info,

                            PassengerList = (from r in grp
                                             group r by r.Type into grpr
                                             select new PassengerDO
                                             {
                                                 Type = grpr.First().Type,
                                                 PassClass = (from grpClass in grpr
                                                              group grpClass by grpClass.PassClass into grpCls
                                                              select new PassClassDO
                                                              {
                                                                  PassClass = grpCls.First().PassClass,
                                                                  ProductNameList = (from productNameClass in grpCls
                                                                                     group productNameClass by new { productNameClass.FamilyName, productNameClass.ProductName } into productNameCls
                                                                                     select new ProductNameDO
                                                                                     {
                                                                                         ProductName = productNameCls.First().ProductName,
                                                                                         SequenceByDuration = productNameCls.First().Duration.Replace("P", "").Contains("M") ? Convert.ToInt32(productNameCls.First().Duration.Replace("P", "").Replace("M", "")) * 30 : Convert.ToInt32(productNameCls.First().Duration.Replace("P", "").Replace("D", "")),
                                                                                         SequenceByAdultPrice = productNameCls.Where(r => r.DefaultPassengerType == "ADULT").Select(r => r.SellAdultPrice).FirstOrDefault(),
                                                                                         ProductList = (from passlist in productNameCls
                                                                                                        group passlist by passlist.TravellerId into li
                                                                                                        select new ProductDO
                                                                                                        {
                                                                                                            Info = li.First().Info,
                                                                                                            PassClass = li.First().PassClass,
                                                                                                            ProductName = li.First().ProductName,
                                                                                                            ProductId = li.First().ProductId,
                                                                                                            Tags = li.Where(j => !j.Tags.Contains("family-card")).Select(r => Convert.ToString(r.ProductId)).FirstOrDefault(),//contain price
                                                                                                            ChildProductId = li.Where(j => j.Tags.Contains("family-card")).Select(r => Convert.ToString(r.ProductId)).FirstOrDefault(),//contain free
                                                                                                            PassType = li.First().PassType,
                                                                                                            Price = li.First().NetAdultPrice,
                                                                                                            StrikePrice = li.First().StrikePrice,
                                                                                                            OfferDescription = "",
                                                                                                            NetCurrency = li.First().NetCurrency,
                                                                                                            SellCurrency = li.First().SellCurrency,
                                                                                                            BaseAdultPrice = li.First().BaseAdultPrice,
                                                                                                            NetAdultPrice = li.First().NetAdultPrice,
                                                                                                            SellAdultPrice = li.First().SellAdultPrice,
                                                                                                            BaseChildPrice = li.Where(j => !j.Tags.Contains("family-card")).Where(j => j.PassengerType == "CHILD").Where(j => j.BaseAdultPrice != 0).Select(r => r.BaseAdultPrice).FirstOrDefault(),//contain price
                                                                                                            NetChildPrice = li.Where(j => !j.Tags.Contains("family-card")).Where(j => j.PassengerType == "CHILD").Where(j => j.NetAdultPrice != 0).Select(r => r.NetAdultPrice).FirstOrDefault(),//contain price
                                                                                                            SellChildPrice = li.Where(j => !j.Tags.Contains("family-card")).Where(j => j.PassengerType == "CHILD").Where(j => j.SellAdultPrice != 0).Select(r => r.SellAdultPrice).FirstOrDefault(),//contain price
                                                                                                            FamilyName = li.First().FamilyName,
                                                                                                            FamilyId = li.First().FamilyId,
                                                                                                            PassengerType = li.First().PassengerType,
                                                                                                            DefaultPassengerType = li.First().DefaultPassengerType,
                                                                                                            ChildFree = li.First().ChildFree,
                                                                                                            ExchangeRate = li.First().ExchangeRate,
                                                                                                            CountriesSelected = "",
                                                                                                            AgeLimit = li.First().AgeLimit,
                                                                                                            ChildAgelbl = "",
                                                                                                            OtherDetails = li.First().OtherDetails,
                                                                                                            SearchId = li.First().SearchId,
                                                                                                            TravellerId = li.First().TravellerId,
                                                                                                            Duration = li.First().Duration,
                                                                                                            ValidityDuration = li.First().ValidityDuration,
                                                                                                            Type = li.First().Type,
                                                                                                            EraKey = li.First().EraKey,
                                                                                                        }).Where(ti => ti.Price != 9999).Distinct().ToList(),
                                                                                     }
                                                                  ).OrderBy(r => r.SequenceByAdultPrice).OrderBy(r => r.SequenceByDuration).ToList(),

                                                              }).OrderBy(r => r.PassClass).ToList(),
                                             }).OrderBy(r => r.Type).ToList(),
                        }).ToList();

            }
            catch { }
        }
        try
        {
            float YouthLowestPrice = List.Select(t => t.PassengerList.Select(u => u.PassClass.OrderByDescending(h => h.PassClass).Select(i => i.ProductNameList.Select(r => r.ProductList.Where(e => e.PassengerType.ToLower() == "adult").Select(e => e.SellAdultPrice).Min()).FirstOrDefault()).FirstOrDefault()).FirstOrDefault()).FirstOrDefault();
            liStartPrice.InnerHtml = "<i class='fa fa-money red_txt' style='font-size: 13px'></i>Starting from " + ToCurrency + " " + YouthLowestPrice;
        }
        catch { }
        return List;
    }
    protected void ddlPassFamily_SelectedIndexChanged(object sender, EventArgs e)
    {
        //txtPassName.InnerHtml = ddlPassFamily.SelectedItem.Text;
        string paramTypeOfFare = "", paramTypeOfPass = "";
        if (ddlPassFamily.SelectedIndex > 0)
        {
            string[] strFamilyId = Convert.ToString(ddlPassFamily.SelectedValue).Split(';');

            if (strFamilyId.Length > 0)
            {
                if (strFamilyId[0] != "")
                {
                    List<ProductFamilyListDO> ListPass = new List<ProductFamilyListDO>();
                    string SellCurrency = CountryToCurrency.GetCountryToCurrency(Convert.ToString(HttpContext.Current.Session["PassCurrency"]));
                    ListPass = GetPassResult(1, SellCurrency, new SearchRailParam());
                    Session["ListPass"] = ListPass;

                    var TypeOfFare = (from d in ListPass select new { d.PassType, d.LblFamily }).Distinct().ToList();
                    string htmlTypeOfFare = "";
                    int cntTypeOfFare = 0;
                    foreach (var iTypeOfFare in TypeOfFare)
                    {
                        if (cntTypeOfFare == 0)
                            hdnTypeOfFare.Value = paramTypeOfFare = iTypeOfFare.PassType;

                        htmlTypeOfFare += "<li class=\"col-xs-4\">";
                        htmlTypeOfFare += "<input type=\"radio\" name=\"passfaretype\" id=\"" + iTypeOfFare.PassType + "\" " + (cntTypeOfFare == 0 ? "checked" : "") + " onclick='javascript:PassFare();' />";
                        htmlTypeOfFare += "<label for=\"" + iTypeOfFare.PassType + "\" data-toggle=\"tooltip\" data-title=\"" + iTypeOfFare.LblFamily + "\">" + iTypeOfFare.PassType + "</label>";
                        htmlTypeOfFare += "</li>";

                        cntTypeOfFare++;
                    }
                    typeOfFare.InnerHtml = "Type of Fare <ul class=\"row radioselectType\">" + htmlTypeOfFare + "</ul>";
                    if (TypeOfFare.Count == 1) // if type of fare in only one e.g. regular then it will be hide.                    
                        typeOfFare.Attributes["class"] += " hide";


                    string[] arrTypeOfPass = (from d in ListPass from d1 in d.PassengerList select d1.Type).Distinct().ToArray();
                    string htmlTypeOfPass = "";
                    int cntTypeOfPass = 0;
                    foreach (var iTypeOfPass in arrTypeOfPass)
                    {
                        if (cntTypeOfPass == 0)
                            hdnTypeOfPass.Value = paramTypeOfPass = iTypeOfPass;

                        htmlTypeOfPass += "<li class=\"col-xs-6\">";
                        htmlTypeOfPass += "<input type=\"radio\" name=\"passtype\" id=\"" + iTypeOfPass + "\" " + (cntTypeOfPass == 0 ? "checked" : "") + " onclick='javascript:PassFare();'>";
                        htmlTypeOfPass += "<label for=\"" + iTypeOfPass + "\">" + iTypeOfPass + "</label>";
                        htmlTypeOfPass += "<span class=\"moreinfoRadio\"><i class=\"fa fa-question-circle-o\" aria-hidden=\"true\" type=\"button\" data-toggle=\"popover\" data-container=\"body\" data-placement=\"bottom\" data-html=\"true\" data-trigger=\"hover focus\" tabindex=\"0\" id=\"" + iTypeOfPass + "MoreInfo\"></i></span>";
                        htmlTypeOfPass += "<div id=\"popover-content-" + iTypeOfPass + "MoreInfo\" class=\"hide\">";
                        htmlTypeOfPass += "<div class=\"generalpopup\" style=\"width: auto; min-height: auto; border: 0;\">";
                        if (iTypeOfPass == "Continuous")
                        {
                            htmlTypeOfPass += "<ul>";
                            htmlTypeOfPass += "<li>Unlimited travel within the set selected days<br/>";
                            htmlTypeOfPass += "<strong>For example: </strong>";
                            htmlTypeOfPass += "If you choose Consecutive 8 Days Swiss Travel Pass, you can travel unlimited times on Swiss Public Transport for 8 days.";
                            htmlTypeOfPass += "</li>";
                            htmlTypeOfPass += "<li>Pass is valid from the selected start date<br />";
                            htmlTypeOfPass += "<strong>For example: </strong>";
                            htmlTypeOfPass += "If you select start date as 1<sup>st</sup> Jan 2020, then your pass is valid till 8<sup>th</sup> Jan 2020 midnight.";
                            htmlTypeOfPass += "</li>";
                            htmlTypeOfPass += "</ul>";
                        }
                        else
                        {
                            htmlTypeOfPass += "<ul>";
                            htmlTypeOfPass += "<li>Unlimited travel within 1 month from the selected start date<br/>";
                            htmlTypeOfPass += "<strong>For example: </strong>";
                            htmlTypeOfPass += "If you choose Flexi 8 Days Swiss Travel Pass, you can travel unlimited times for 8 days in one month";
                            htmlTypeOfPass += "</li>";
                            htmlTypeOfPass += "<li>Pass is valid from the selected start date<br />";
                            htmlTypeOfPass += "<strong>For example: </strong>";
                            htmlTypeOfPass += "If you select start date as 1<sup>st</sup> Jan 2020, then your pass is valid till 30<sup>th</sup> Jan 2020 and you can travel unlimited any 8 days within these 30 days.";
                            htmlTypeOfPass += "</li>";
                            htmlTypeOfPass += "</ul>";
                        }
                        htmlTypeOfPass += "</div>";
                        htmlTypeOfPass += "</div>";
                        htmlTypeOfPass += "</li>";
                        cntTypeOfPass++;
                    }
                    typeOfPass.InnerHtml = "Type of Pass<ul class=\"row radioselectType\">" + htmlTypeOfPass + "</ul>";


                    string[] arrTypeOfPassClass = (from d in ListPass from d1 in d.PassengerList from d2 in d1.PassClass select d2.PassClass).Distinct().ToArray();
                    string htmlTypeOfPassClass = "";
                    int cntTypeOfPassClass = 0;
                    foreach (var iTypeOfPassClass in arrTypeOfPassClass)
                    {
                        string strClass = iTypeOfPassClass == "1" ? "First" : "Second";
                        if (cntTypeOfPassClass == 0)
                            hdnTypeOfPassClass.Value = iTypeOfPassClass;

                        htmlTypeOfPassClass += "<li class=\"col-xs-6\">";
                        htmlTypeOfPassClass += "<input type=\"radio\" name=\"classtype\" id=\"Tclass" + iTypeOfPassClass + "\" " + (iTypeOfPassClass == "2" ? "checked" : "") + " />";
                        htmlTypeOfPassClass += "<label for=\"Tclass" + iTypeOfPassClass + "\" rel=\"class" + iTypeOfPassClass + "\">" + strClass + " Class</label>";
                        htmlTypeOfPassClass += "<span class=\"moreinfoRadio\"><i class=\"fa fa-question-circle-o\" aria-hidden=\"true\" type=\"button\" data-toggle=\"popover\" data-container=\"body\" data-placement=\"bottom\" data-html=\"true\" data-trigger=\"hover focus\" tabindex=\"0\" id=\"" + strClass + "scInfo\"></i></span>";
                        htmlTypeOfPassClass += "<div id=\"popover-content-" + strClass + "scInfo\" class=\"hide\">";
                        htmlTypeOfPassClass += "<div class=\"generalpopup\" style=\"width: auto; min-height: auto; border: 0;\">";
                        if (strClass == "First")
                        {
                            htmlTypeOfPassClass += "<ul>";
                            htmlTypeOfPassClass += "<li>The " + strClass + " Class pass means a passenger can access the first-class sections of public transport like Train and Boat.</li>";
                            htmlTypeOfPassClass += "<li>In a train, the first-class seating is more spacious and have a separate section</li>";
                            htmlTypeOfPassClass += "<li>In a boat, the first -class section is the upper deck of the boat</li>";
                            htmlTypeOfPassClass += "</ul>";
                        }
                        else
                        {
                            htmlTypeOfPassClass += "<ul>";
                            htmlTypeOfPassClass += "<li>The " + strClass + " Class pass means a passenger can access only the second-class sections of public transport.</li>";
                            htmlTypeOfPassClass += "</ul>";
                        }
                        htmlTypeOfPassClass += "</div>";
                        htmlTypeOfPassClass += "</div>";
                        htmlTypeOfPassClass += "</li>";
                        cntTypeOfPassClass++;
                    }
                    typeOfPassClass.InnerHtml = "Class<ul class=\"row radioselectType classTabs\">" + htmlTypeOfPassClass + "</ul>";
                    ScriptManager.RegisterStartupScript(this.Page, Page.GetType(), "PassFare", "PassFare()", true);

                }

            }
        }
    }
    [System.Web.Services.WebMethod(EnableSession = true)]
    public static string PassFare(string TypeOfFare, string TypeOfPass, string TypeOfPassClass, string Offer)
    {
        string strResult = "No. of Days from function";
        CultureInfo cultureInfo = System.Threading.Thread.CurrentThread.CurrentCulture;
        TextInfo textInfo = cultureInfo.TextInfo;
        ProductNameDO clsFirstRadioData = new ProductNameDO();
        if (TypeOfFare != "" && TypeOfPass != "" && TypeOfPassClass != "")
        {
            List<ProductFamilyListDO> ListPass = new List<ProductFamilyListDO>();
            try { ListPass = (List<ProductFamilyListDO>)HttpContext.Current.Session["ListPass"]; } catch (Exception ex) { }

            if (ListPass != null)
            {
                if (ListPass.Count > 0)
                {
                    var arrTypeOfPasses = (
                    from d in ListPass
                    where d.PassType == TypeOfFare
                    from d1 in d.PassengerList
                    where d1.Type == TypeOfPass
                    from d2 in d1.PassClass
                    select new { d2.ProductNameList, d2.PassClass }
                    ).ToList();
                    if (arrTypeOfPasses != null)
                    {

                        string strHtmlPassClass = "";
                        string strChecked = "checked";

                        foreach (var iTypeOfPasses in arrTypeOfPasses)
                        {

                            strHtmlPassClass += "<div class=\"classTabBox\" id=\"class" + iTypeOfPasses.PassClass + "\">";

                            /////////////////Start Here Binding Pass Days
                            strHtmlPassClass += "<ul class=\"passTimeFareList\">";
                            int cCount = 1;
                            strChecked = iTypeOfPasses.PassClass == TypeOfPassClass.Replace("Tclass", "") ? "checked" : "";
                            //var liProductNameList = Offer != "" ? iTypeOfPasses.ProductNameList.Where(w => (w.ProductName.Contains("8") || w.ProductName.Contains("15"))).ToList() : iTypeOfPasses.ProductNameList;
                            var liProductNameList = iTypeOfPasses.ProductNameList;
                            foreach (var iProductName in liProductNameList.OrderBy(r => Convert.ToInt16(r.ProductName.Remove(2, r.ProductName.Length - 2))))
                            {
                                string strParamPass = Newtonsoft.Json.JsonConvert.SerializeObject(iProductName);

                                strHtmlPassClass += "<li class=\"fade_anim\">";
                                strHtmlPassClass += "<input type=\"radio\" name=\"passDuration\" id=\"c" + iTypeOfPasses.PassClass + "_" + Convert.ToString(cCount) + "\" " + strChecked + " onclick='javascript:PassFareCal(this);'/>";
                                strHtmlPassClass += "<label for=\"c" + iTypeOfPasses.PassClass + "_" + Convert.ToString(cCount) + "\" class=\"ptfItem\">";
                                strHtmlPassClass += "<div class=\"passvalidity\">";
                                string strTag = "";
                                if (iProductName.ProductList.First().FamilyName.ToLower().Contains("promo"))
                                {
                                    //strTag = "<div class=\"bsTag\">Promo</div>";
                                    // makeing here tooltip for promo
                                    strHtmlPassClass += "<style>.tooltip .tooltip-inner .toolTipTxt { min-width: 250px;}</style><script>$('.bsTag').tooltip();</script>";
                                    strTag += "<div class=\"bsTag\" data-placement='auto left' data-toggle='tooltip' data-html='true' title=''";
                                    strTag += " data-original-title='<div class=\"toolTipTxt\" style=\"text-align:left;\">";
                                    strTag += " <ul><li> 25% discount on all Swiss Travel Passes.</li>";
                                    strTag += " <li> Offer valid from 1st to 31st July.</li>";
                                    strTag += " <li> Valid for travel within 11 months from the date of purchase.</li>";
                                    strTag += " <li> Free cancellation possible until 1 day prior to the pass validity.</li></ul>";
                                    strTag += " </div>'>Promo</div>";
                                }
                                else if (iTypeOfPasses.PassClass == "2" && iProductName.ProductName.ToLower().Contains("8 days continuous"))
                                    strTag = "<div class=\"bsTag\">Best Seller</div>";

                                strHtmlPassClass += strTag;
                                //strHtmlPassClass += (iTypeOfPasses.PassClass == "2" && iProductName.ProductName.ToLower().Contains("8 days continuous") ? "<div class=\"bsTag\">Best Seller</div>" : "");
                                //strHtmlPassClass += iProductName.ProductList.First().FamilyName.ToLower().Contains("promo") ? "<div class=\"bsTag\">Promo</div>" : "";
                                strChecked = "";//blank here;
                                strHtmlPassClass += "<span class=\"fade_anim\">" + textInfo.ToTitleCase(iProductName.ProductName).Replace("Within 1 Month Flexi", "").Replace("Within 2 Months Flexi", "").Replace("Within 3 Months Flexi", "").Replace("Continuous", "") + "</span>";
                                strHtmlPassClass += "</div>";
                                strHtmlPassClass += "<div class=\"passfares\">";
                                /////////////////Start Here Binding Pass Rate Pax wise
                                strHtmlPassClass += "<table>";
                                iProductName.ProductList = iProductName.ProductList.OrderByDescending(r => r.SellAdultPrice).ToList();
                                foreach (var iProduct in iProductName.ProductList)
                                {
                                    if (iProduct.PassengerType.ToLower() == "adult")
                                    {
                                        strHtmlPassClass += "<tr>";
                                        strHtmlPassClass += "<td>" + textInfo.ToTitleCase(iProduct.PassengerType.ToLower()) + "</td>";
                                        string strStrikePrice = " ";
                                        if (iProduct.StrikePrice > 0)
                                            strStrikePrice = "&nbsp;&nbsp;<span style='text-decoration: line-through;text-decoration-color: #c00;text-decoration-thickness: 2px;-webkit-text-decoration: line-through;-webkit-text-decoration-color: #c00;-webkit-text-decoration-thickness: 2px;'>" + iProduct.StrikePrice + "</span>&nbsp;&nbsp;";
                                        strHtmlPassClass += "<td>" + iProduct.NetCurrency + strStrikePrice + iProduct.Price + "</td>";
                                        //strHtmlPassClass += "<td>" + iProduct.NetCurrency + iProduct.BaseAdultPrice + "</td>";
                                        string strClass = iProduct.NetCurrency == iProduct.SellCurrency ? "class='noneIMP'" : "";
                                        strHtmlPassClass += "<td " + strClass + ">" + iProduct.SellCurrency + " " + iProduct.SellAdultPrice + "</td>";
                                        strHtmlPassClass += "</tr>"; ;
                                    }
                                }
                                strHtmlPassClass += "</table>";
                                /////////////////End Here Binding Pass Rate Pax wise
                                strHtmlPassClass += "<input type=\"hidden\" id=\"hdnc" + iTypeOfPasses.PassClass + "_" + Convert.ToString(cCount) + "\" value='" + strParamPass + "' />";
                                strHtmlPassClass += "</div>";
                                strHtmlPassClass += "</label>";
                                strHtmlPassClass += "</li>";

                                cCount++;
                            }

                            strHtmlPassClass += "</ul>";
                            /////////////////End Here Binding Pass Days
                            ///
                            strHtmlPassClass += "</div>";
                        }
                        strHtmlPassClass += "<div class='clearfix text-right'>";
                        strHtmlPassClass += "<a data-fancybox data-options='{\"touch\":false}' data-src=\"#event_pop_Condition\" href=\"javascript:;\"  style='font-size:12px;color:#4b4b4b'><i class='fa fa-info-circle'></i> Conditions Apply</a>";
                        strHtmlPassClass += "</div>";

                        //Pop up For Condition                    
                        strHtmlPassClass += "<div style='display: none' class='fancy_inline_display' id='event_pop_Condition'>";
                        strHtmlPassClass += "<div class='contestpopup'>";
                        strHtmlPassClass += "<div style=\"padding:10px\" id='divInfo'>";
                        strHtmlPassClass += ListPass[0].Info;
                        strHtmlPassClass += "</div>";
                        strHtmlPassClass += "</div>";
                        strHtmlPassClass += "</div>";
                        //Pop up For Condition

                        strResult = "No. of Days " + strHtmlPassClass;
                    }
                    else
                    {
                        strResult = "No. of Days Opps! System is unable to proceed. Please contact to admin.";
                    }
                }
            }
            else
            {
                strResult = "No. of Days Opps! Lost connection with supplier. Please search again.";
            }
        }
        else
        {
            strResult = "No. of Days Opps! Parameters are missng. Please contact to admin.";
        }
        return strResult;
    }

    [System.Web.Services.WebMethod(EnableSession = true)]
    public static string PassFareCal(ProductNameDO Data)
    {
        string offeredExcursionNames = "";
        CultureInfo cultureInfo = System.Threading.Thread.CurrentThread.CurrentCulture;
        TextInfo textInfo = cultureInfo.TextInfo;
        String strHtmlResult = "";
        SearchRailParam searchParam = (SearchRailParam)HttpContext.Current.Session["SearchRailParam"];
        if (Data.ProductList.Count > 0)
        {
            DataTable dtMt = new DataTable();
            DateTimeFormatInfo dateFormatInfo = new DateTimeFormatInfo();
            dateFormatInfo.ShortDatePattern = "dd MMM yyyy"; //date format don't delete
            if (Convert.ToString(Data.Offer) != "")
            {
                if (Convert.ToString(Data.Offer).Split('|').Length > 1)
                {
                    if (Data.TravelDate == "")
                        Data.TravelDate = DateTime.Now.ToString("dd MMM yyyy");
                    string strMtExIds = Convert.ToString(Data.Offer).Split('|')[0];
                    strMtExIds = string.Join(",", strMtExIds.Split(',').Select(Int32.Parse).OrderBy(x => x).ToList());
                    Eurail oEurail = new Eurail();
                    oEurail.MtExIds = strMtExIds;
                    oEurail.Currency = Data.ProductList[0].SellCurrency;
                    oEurail.FromDate = Convert.ToDateTime(Data.TravelDate, dateFormatInfo);
                    oEurail.MtOffer = Convert.ToString(Data.Offer).Split('|')[1];
                    dtMt = oEurail.Mountain_Offer_with_Swiss_Pass();
                    if (dtMt.Rows.Count > 0)
                    {
                        var vExcursionName = dtMt.AsEnumerable().Select(s => s.Field<String>("ExcursionName")).Distinct().ToArray();
                        offeredExcursionNames = " + " + string.Join(" + ", vExcursionName);

                        String strHtmlOffer = "";
                        var vMtExIds = dtMt.AsEnumerable().Select(s => s.Field<Int32>("MtExId")).Distinct().OrderBy(MtExId => MtExId).ToArray();
                        string dupMtExIds = string.Join(",", vMtExIds);
                        if (dupMtExIds != strMtExIds)
                        {
                            Data.Offer = "";//put it blank so ofer will not work\                            
                        }
                        else
                        {
                            string JSONString = string.Empty;
                            JSONString = JsonConvert.SerializeObject(dtMt);
                            strHtmlOffer += "<script>";
                            strHtmlOffer += "localStorage.setItem('MtNames',null);";
                            strHtmlOffer += "localStorage.setItem('MtNames', '" + string.Join(",", vExcursionName) + "');";
                            strHtmlOffer += "localStorage.setItem('MtOfferData',null);";
                            strHtmlOffer += "localStorage.setItem('MtOfferData', JSON.stringify(" + JSONString + "));";
                            strHtmlOffer += "</script>";
                        }
                        strHtmlResult += strHtmlOffer;
                    }
                }
            }

            strHtmlResult += "<input type='hidden' runat='server' name='hdnInfo' id='hdnInfo' value=\"" + HttpUtility.UrlEncode(Data.ProductList[0].Info) + "\"/>";
            strHtmlResult += "<input type='hidden' runat='server' name='hdnFamilyName' id='hdnFamilyName' value=\"" + Data.ProductList[0].FamilyName + "\"/>";
            strHtmlResult += "<input type='hidden' runat='server' name='hdnPassType' id='hdnPassType' value=\"" + Data.ProductList[0].PassType + "\"/>";
            strHtmlResult += "<input type='hidden' runat='server' name='hdnType' id='hdnType' value=\"" + Data.ProductList[0].Type + "\"/>";
            strHtmlResult += "<input type='hidden' runat='server' name='hdnProductName' id='hdnProductName' value=\"" + Data.ProductList[0].ProductName + "\"/>";
            strHtmlResult += "<input type='hidden' runat='server' name='hdnClassType' id='hdnClassType' value=\"" + Data.ProductList[0].PassClass + "\"/>";

            /////////Start Calc heading 
            strHtmlResult += "<div class=\"selectionDetails\">";
            String strProductName = Data.Offer != "" ? Data.ProductList[0].FamilyName + offeredExcursionNames : Data.ProductList[0].FamilyName;
            strHtmlResult += "<h2>" + strProductName + "</h2>";
            string strMaxTravellers = "&nbsp;<span style='font-size:11px;font-style:italic;'>&nbsp;(Max. 9 travellers)</span>";
            string strNoteTravellers = "";
            if (Data.Offer != "")
                if (Data.Offer.Split('|').Length > 1)
                    if (Convert.ToString(Data.Offer.Split('|')[1]).Trim() == "35")
                    {
                        strMaxTravellers = strMaxTravellers.Replace("9", "8");
                        strNoteTravellers = "<p style='font-size:11px;font-style:italic;'><u>Note: 1-31 May only and travellers (each category) must be even in number (2, 4 etc)</u></ p>";
                    }
            strHtmlResult += "<p>" + Data.ProductName + "&nbsp;|&nbsp;" + (Data.ProductList[0].PassClass == "1" ? "1<sup>st</sup>" : "2<sup>nd</sup>") + " Class" + strMaxTravellers + "</p>";
            strHtmlResult += strNoteTravellers;
            strHtmlResult += "</div>";
            /////////End Calc heading 

            ///////////Start Pax Dropdown Binding
            strHtmlResult += "<div class=\"row\">";

            List<ProductDO> liProductList = new List<ProductDO>();
            liProductList = Data.ProductList.OrderByDescending(r => r.SellAdultPrice).ToList();

            String strChildPrice = "";
            string paxAge = "";
            float SellAmount = liProductList.Where(r => r.PassengerType.ToLower() == "adult").Sum(r => r.SellAdultPrice);
            string SellCurrency = liProductList[0].SellCurrency;
            strHtmlResult += "<input type='hidden' runat='server' name='hdnSellCurrency' id='hdnSellCurrency' value=\"" + SellCurrency + "\"/>";
            decimal TFROE = 1;
            TFROE = new CommonFunction().Get_RateOfExchange("EUR", SellCurrency);//amended by rajani. here fetch TF roe EUR to sellCurrency
            strHtmlResult += "<input type='hidden' runat='server' name='hdnTFROE' id='hdnTFROE' value=\"" + TFROE + "\"/>";

            ///////////Start type of Pax Dropdown Binding
            foreach (var paxList in liProductList)
            {
                string strPaxType = textInfo.ToTitleCase(paxList.PassengerType.ToLower());

                strHtmlResult += "<input type='hidden' id='hdn" + strPaxType + "NetAmount' value=\"" + paxList.NetAdultPrice + "\"/>";
                strHtmlResult += "<input type='hidden' id='hdn" + strPaxType + "SellAmount' value=\"" + paxList.SellAdultPrice + "\"/>";

                strChildPrice = paxList.PassengerType.ToLower() == "child" ? paxList.SellCurrency + " " + paxList.SellAdultPrice : "";
                switch (strPaxType)
                {
                    case "Adult":
                        paxAge = "Age 26 yrs and above";
                        break;
                    case "Youth":
                        paxAge = "Age 16-25 yrs";
                        break;
                    case "Child":
                        paxAge = "Below 16 yrs";
                        break;
                }
                strHtmlResult += "<div class=\"col-xs-6 col-sm-3 col-md-6\">";
                strHtmlResult += "<div class=\"form-group\" data-placement=\"auto\" data-toggle=\"tooltip\" data-trigger=\"hover focus\" data-title=\"" + paxAge + "\">";
                strHtmlResult += "<select class=\"form-control selectpicker\" title=\"" + strPaxType + "\" name=\"ddl_" + strPaxType + "\" id=\"ddl_" + strPaxType + "\" onchange='javascript:CalcAmount();'>";
                for (int i = 0, l = 0; i < 10; i++, l++)
                {
                    strHtmlResult += "<option value=\"" + i.ToString() + "\" " + ((l == 1 && paxList.PassengerType.ToLower() == "adult") || (l == 0 && paxList.PassengerType.ToLower() != "adult") ? "selected" : "") + ">" + i.ToString() + " " + ((i == 0 || i == 1) ? strPaxType : (strPaxType == "Child" ? "Children" : strPaxType + "s")) + "</option>";
                    if (Data.Offer != "")
                        if (Data.Offer.Split('|').Length > 1)
                            if (Convert.ToString(Data.Offer.Split('|')[1]).Trim() == "35")
                                i++;
                }
                strHtmlResult += "</select>";
                strHtmlResult += "</div>";
                strHtmlResult += "</div>";
            }
            strHtmlResult += "<script>";
            strHtmlResult += "$('.selectpicker').selectpicker('refresh');";
            strHtmlResult += "$('.form-group, i').tooltip();";
            strHtmlResult += "</script>";
            ///////////End type of Pax Dropdown Binding

            ///////////Start Children Details Binding
            strHtmlResult += "<div class=\"col-xs-12\" id=\"ChildrenDetails\" style=\"display:none;\" runat=\"server\">";
            String strClass = Data.Offer != "" ? " noneIMP" : "";
            strHtmlResult += "<div class='ez_checkbox nstpNote" + strClass + "'>";
            strHtmlResult += "<input type=\"checkbox\" name=\"chk_Child\" id=\"chk_Child\" onclick='javascript:CalcAmount();' checked/>";
            strHtmlResult += "<p class=\"red_txt\" style=\"font-size: 13px; line-height: 1.3; color: #ff0000;\">";
            if (strChildPrice != "")
                strHtmlResult += "<strong id=\"lblChildText\" runat=\"server\">Tick the box for your children to travel FREE, only if the child is below 16 years and travelling with a parent.</strong>";
            strHtmlResult += "</p>";
            strHtmlResult += "</div>";
            strHtmlResult += "<p>Children Age :</p>";
            strHtmlResult += "<div class=\"row ez_checkbox childageBoxes\">";
            ///////////Start Children Age and with parent Details Binding

            for (int c = 1; c < 11; c++)
            {
                strHtmlResult += "<div class=\"col-md-4 col-sm-3 col-xs-6 ageboxholder\" id=\"child_" + c.ToString() + "\" style='display:" + (c == 1 ? "block" : "none") + "'>";
                strHtmlResult += "<div class=\"form-group\">";
                strHtmlResult += "<select class=\"form-control selectpicker\" value='0' title=\"Child " + c.ToString() + "\" id=\"ddl_Child_" + c.ToString() + "\" name=\"ddl_Child_" + c.ToString() + "\" onchange='javascript:CalcChild();'>";
                for (int i = 1; i < 16; i++)
                    strHtmlResult += "<option value=\"" + i.ToString() + "\" " + ((c == 1 && searchParam.ChildAges == i.ToString()) ? "selected" : "") + ">" + i.ToString() + " " + (i == 1 ? "yr" : "yrs") + "</option>";
                strHtmlResult += "</select>";
                strHtmlResult += "</div>";
                strHtmlResult += "</div>";
            }
            ///////////End Children Age and with parent Details Binding
            strHtmlResult += "</div>";
            strHtmlResult += "</div>";
            strHtmlResult += "<script>";
            strHtmlResult += "childrenData();";
            strHtmlResult += "$('input[type=\"checkbox\"]').ezMark({ checkboxCls: 'ez-checkbox', checkedCls: 'ez-checked-select' });";
            strHtmlResult += "</script>";
            ///////////End Children  Details Binding
            strHtmlResult += "</div>";
            ///////////End Pax Dropdown Binding


            strHtmlResult += "<hr />";
            ///////////Start Binding Here Calender and discount box 
            strHtmlResult += "<div class=\"row\">";

            strHtmlResult += "<div class=\"col-xs-6 col-sm-6 date_code\">";
            strHtmlResult += "<div class=\"form-group\">";
            strHtmlResult += "<div class=\"input-group nstpDate\" data-date=\"\" data-date-format=\"dd MM yyyy\" data-link-field=\"dtp_input1\">";
            strHtmlResult += "<div class=\"input-group-addon ic_date\"></div>";
            strHtmlResult += "<input type=\"text\" placeholder=\"Start date of travel\" class=\"form-control date\" readonly  name=\"depDate\"  id=\"depDate\" />";
            strHtmlResult += "</div>";
            strHtmlResult += "<input type=\"hidden\" id=\"dtp_input1\" value=\"\" />";
            strHtmlResult += "</div>";
            strHtmlResult += "</div>";


            string countrycode = Convert.ToString(HttpContext.Current.Session["PassCurrency"]);
            RailEuropeRea RailPass = new RailEuropeRea();
            DataTable dt = new DataTable();
            dt = RailPass.Get_Nearest_Branch_Master(countrycode);
            if (dt.Rows.Count > 0)
                if (countrycode == "IN")
                    dt.Rows.Remove(dt.Select("BranchName='GCC'")[0]);

            strHtmlResult += "<div class=\"col-xs-6 col-sm-3 col-md-6\" id='divBranch'>";
            strHtmlResult += "<i class=\"fa fa-info-circle\" data-toggle=\"tooltip\" data-placement=\"top\" title=\"Selecting the nearest city helps us to assist you in case you face any problem.\" style=\"font-size:14px;position:absolute;right:0px;top:10px\"></i>";
            strHtmlResult += "<div class=\"form-group\" data-toggle=\"tooltip\" title=\"Select City\">";
            string ddlbranchDisabled = "";
            if (searchParam.BranchSelect == "true")
                ddlbranchDisabled = "disabled='disabled'";
            strHtmlResult += "<select class=\"form-control selectpicker\" id=\"ddlBranch\" name=\"ddlBranch\" onchange='GetBranchValue();' " + ddlbranchDisabled + ">";
            strHtmlResult += "<option value='0'>Select City</option>";
            for (var i = 0; i < dt.Rows.Count; i++)
            {
                string ddlbranchselected = "";

                if (searchParam.RespBranchId == Convert.ToInt32(dt.Rows[i]["BranchID"]))
                {
                    if (searchParam.BranchSelect == "true")
                    {
                        ddlbranchselected = "selected";
                    }
                }
                if (countrycode != "IN")
                    ddlbranchselected = "selected";
                strHtmlResult += "<option value=" + dt.Rows[i]["BranchID"] + " " + ddlbranchselected + ">" + dt.Rows[i]["BranchName"] + "</option>";
            }
            strHtmlResult += "</select>";
            strHtmlResult += "</div>";
            strHtmlResult += "</div>";

            strHtmlResult += "<div class=\"col-xs-6 col-sm-6 date_code noneIMP\">";
            strHtmlResult += "<div class=\"form-group promocode\">";
            strHtmlResult += "<div class=\"input-group\">";
            strHtmlResult += "<input type=\"text\" placeholder=\"Promo Code\" class=\"form-control\" />";
            strHtmlResult += "<div class=\"input-group-addon\">";
            strHtmlResult += "<button>Apply</button>";
            strHtmlResult += "</div>";
            strHtmlResult += "</div>";
            strHtmlResult += "</div>";
            strHtmlResult += "<a href=\"javascript:;\" id=\"ContentPlaceHolder_aPromoCodeLink\" data-fancybox=\"\" data-type=\"ajax\" data-options=\"{&quot;touch&quot;:false}\" data-src=\"/PassMtEx/promo-chf-100-off-on-STP.html?V=20190420R\" style=\"font-size: 12px; margin-top: -5px; display: block;\"><i class=\"fa fa-info-circle\" style=\"font-size: 14px;\"></i>View Promo code</a>";
            strHtmlResult += "</div>";
            strHtmlResult += "<script>";
            strHtmlResult += "var days = +0;var fromDate = new Date();var toDate= new Date();";
            string strHtmlFromDate = "fromDate.setDate(fromDate.getDate() + days); toDate.setDate(toDate.getDate() + 180);"; ;
            if (Data.Offer != "")
                if (Data.Offer.Split('|').Length > 1)
                    strHtmlFromDate = "toDate = new Date('2021','09','27');";

            strHtmlResult += strHtmlFromDate;
            strHtmlResult += "$(\"#depDate\").datetimepicker({startDate: fromDate,initialDate: fromDate,endDate: toDate,minView: 2,format: 'dd M yyyy',autoclose: 1}).on('changeDate', function(event) {";
            strHtmlResult += "var Date = event.date;";
            strHtmlResult += "var monthNames = [\"Jan\", \"Feb\", \"Mar\", \"Apr\", \"May\", \"Jun\", \"Jul\", \"Aug\", \"Sep\", \"Oct\", \"Nov\", \"Dec\"];";
            strHtmlResult += "fromDate = Date.getDate() + ' ' + monthNames[Date.getMonth()] + ' ' + Date.getFullYear();";
            strHtmlResult += "document.getElementById('ContentPlaceHolder_hdndate').value = fromDate;";
            strHtmlResult += (Data.Offer != "" ? "DivDateChangeForOffer();" : "");
            strHtmlResult += "});";
            //if (Data.Offer != "")
            //    if (Data.Offer.Split('|').Length > 1)
            //        strHtmlResult = " if($.trim($('#ContentPlaceHolder_hdndate').val())!=''){$(\"#depDate\").text($.trim($('#ContentPlaceHolder_hdndate').val()));}";
            if (countrycode != "IN")
            {
                strHtmlResult += "document.getElementById('divBranch').style.display = 'none'";
            }
            strHtmlResult += "</script>";

            strHtmlResult += "</div>";
            ///////////End Binding Here Calender and discount box 
            strHtmlResult += "<hr style=\"margin: 15px 0 0\"/>";

            ///////////Start Binding Price
            strHtmlResult += "<div class=\"nstpTotalBreakup hide\">";
            strHtmlResult += "<div class=\"tb_Box\">";
            strHtmlResult += "<small>Total Amount</small> " + SellCurrency + " <span id='lblAmount'>" + SellAmount + "</span>";
            strHtmlResult += "</div>";
            strHtmlResult += "<div class=\"tb_Box noneIMP\">";
            strHtmlResult += "<i class=\"fa fa-minus\"></i>";
            strHtmlResult += "<small>Promo Discount</small> INR 0";
            strHtmlResult += "</div>";
            strHtmlResult += "<div class=\"tb_Box noneIMP\">";
            strHtmlResult += "<i class=\"fa fa-plus\"></i>";
            strHtmlResult += "<small>Handling Fee</small> INR 100";
            strHtmlResult += "</div>";
            strHtmlResult += "</div>";


            strHtmlResult += "<div class=\"nstpSummaryBox\">";
            if (Data.Offer != "")
            {
                strHtmlResult += "<div class=\"summaryBtn rotate\"> View Summary &nbsp;<i class=\"fa fa-chevron-down\"></i></div>";
                strHtmlResult += "<div class=\"summaryTable\" style=\"display:block;\" id=\"divSummary\">";
            }
            else
            {
                strHtmlResult += "<div class=\"summaryBtn\"> View Summary &nbsp;<i class=\"fa fa-chevron-down\"></i></div>";
                strHtmlResult += "<div class=\"summaryTable\" style=\"display:none;\" id=\"divSummary\">";
            }

            strHtmlResult += "</div>";
            strHtmlResult += "</div>";

            strHtmlResult += "<div class=\"nstpGrand\"><strong>Grand Total</strong> " + SellCurrency + " <span id='lblGrandTotal'>" + SellAmount + "</span></div>";

            strHtmlResult += "<script>";
            strHtmlResult += "$('.summaryBtn').click(function() {";
            strHtmlResult += "$('.summaryTable').slideToggle();";
            strHtmlResult += "$(this).toggleClass('rotate');";
            strHtmlResult += "});";
            strHtmlResult += "</script>";
            ///////////End Binding Price
        }

        return strHtmlResult;
    }

    protected void btnSubmit_Click(object sender, EventArgs e)
    {
        string CorrelationID = string.Empty;
        if (!string.IsNullOrEmpty(Convert.ToString(Session["CorrelationID"])))
            CorrelationID = Convert.ToString(Session["CorrelationID"]);
        else
        {
            Guid obj = Guid.NewGuid();
            CorrelationID = Convert.ToString(obj);
            Session["CorrelationID"] = CorrelationID;
        }
        RailEuropeRea RailPassDAL = new RailEuropeRea();
        SearchPassParam param = new SearchPassParam();

        string SellCurrency = CountryToCurrency.GetCountryToCurrency(Convert.ToString(HttpContext.Current.Session["PassCurrency"]));

        param.FamilyId = 0;
        param.NoAdult = Convert.ToInt32(hdnNoOfAdult.Value);
        param.NoYouth = Convert.ToInt32(hdnNoOfYouth.Value);
        param.NoSenior = Convert.ToInt32(hdnNoOfSenior.Value);
        param.NoChild = Convert.ToInt32(hdnNoOfChild.Value);
        int Child = 0;
        for (var i = 0; i < param.NoChild; i++)
        {
            param.ChildAge += hdnChildAge.Value.Split(",".ToCharArray())[i] + ",";//All child ages which are selected from dropdown
            if (hdnChkChild.Value != "true")
            {
                param.FamilyCard += "0,";
                if (Convert.ToInt32(hdnChildAge.Value.Split(",".ToCharArray())[i]) >= 6)
                {
                    Child++;//it means not family card getting price
                }
            }
            else param.FamilyCard += "1,";
        }

        param.ChildAge = !string.IsNullOrEmpty(param.ChildAge) ? param.ChildAge.Remove(param.ChildAge.Length - 1) : "";
        param.EstmDateOfTravel = Convert.ToDateTime(Request.Form["ctl00$ContentPlaceHolder$hdndate"], dateFormatInfo);
        param.PassName = Request.Form["hdnFamilyName"]; //swiss travel pass
        param.PassType = Request.Form["hdnPassType"]; //regular
        string Passenger = string.Empty;
        if (param.NoAdult > 0)
            Passenger = "Adult: " + param.NoAdult + ";";
        if (param.NoYouth > 0)
            Passenger += "Youth: " + param.NoYouth + ";";
        if (param.NoChild > 0)
            Passenger += "Child: " + param.NoChild + ";";

        param.PassengerType = Passenger.Remove(Passenger.Length - 1);
        param.Validity = Request.Form["hdnProductName"]; //3 Days Continueous
        string Class = Convert.ToString(Request.Form["hdnClassType"]);
        string Type = Request.Form["hdnType"]; //Continueous
        param.VisitCountry = "";
        param.VisitCountryName = "";

        SearchRailParam searchParam = new SearchRailParam();
        searchParam.SearchRefId = "";
        searchParam.CountryCode = "CH";
        searchParam.SearchCountryCode = "BB";
        searchParam.CountryName = "Switzerland";
        searchParam.TravelDate = param.EstmDateOfTravel;
        searchParam.AgencyId = Convert.ToInt32(oLoginDetail.AgencyId);
        searchParam.BranchId = Convert.ToInt32(oLoginDetail.BranchId);
        searchParam.CorrelationID = Convert.ToString(Session["CorrelationID"]);
        searchParam.RespBranchId = Convert.ToInt32(hdnBranchValue.Value);
        searchParam.SellCurrency = SellCurrency;
        searchParam.NoOfAdult = param.NoAdult;
        searchParam.NoOfYouth = param.NoYouth;
        searchParam.NoOfSenior = param.NoSenior;
        searchParam.NoOfChild = param.NoChild;
        searchParam.ChildAges = param.ChildAge;
        string AdultAge = string.Empty;
        string YouthAge = string.Empty;
        string ChildsAge = string.Empty;
        string SeniorAge = string.Empty;
        List<ProductFamilyListDO> ListPass = new List<ProductFamilyListDO>();

        ListPass = GetPassResult(2, SellCurrency, searchParam);

        var arrTypeOfPasses = (
                      from d in ListPass
                      where d.PassType == param.PassType
                      from d1 in d.PassengerList
                      where d1.Type == Type
                      from d2 in d1.PassClass
                      where d2.PassClass == Class
                      from d3 in d2.ProductNameList
                      where d3.ProductName == param.Validity
                      select new { d3.ProductList }
                      ).ToList();

        double AdultNetAmount = 0, YouthNetAmount = 0, SeniorNetAmount = 0, ChildNetAmount = 0, AdultSellAmount = 0, YouthSellAmount = 0, SeniorSellAmount = 0, ChildSellAmount = 0;
        double AdultBaseAmount = 0, YouthBaseAmount = 0, SeniorBaseAmount = 0, ChildBaseAmount = 0;
        var paxcount = 1;
        string PaxDetails = string.Empty;
        string PassOfferId = string.Empty;

        PassOfferId = arrTypeOfPasses[0].ProductList[0].Tags;
        if (param.NoAdult > 0)
        {
            AdultBaseAmount = Convert.ToDouble(arrTypeOfPasses[0].ProductList.Where(r => r.PassengerType == "ADULT").Select(r => r.BaseAdultPrice).First()) * param.NoAdult;
            AdultNetAmount = Convert.ToDouble(arrTypeOfPasses[0].ProductList.Where(r => r.PassengerType == "ADULT").Select(r => r.NetAdultPrice).First()) * param.NoAdult;
            AdultAge = "26-99";
            for (var i = 0; i < param.NoAdult; i++)
            {
                PaxDetails += "30;ADULT;ADULT;traveler-" + paxcount + "#";
                paxcount++;
            }
        }

        if (param.NoChild > 0)
        {
            ChildsAge = "0-15";

            if (Child > 0)
            {
                ChildBaseAmount = arrTypeOfPasses[0].ProductList.Where(r => r.PassengerType == "CHILD").Select(r => r.BaseChildPrice).First();
                ChildNetAmount = arrTypeOfPasses[0].ProductList.Where(r => r.PassengerType == "CHILD").Select(r => r.NetChildPrice).First();
                ChildSellAmount = arrTypeOfPasses[0].ProductList.Where(r => r.PassengerType == "CHILD").Select(r => r.SellChildPrice).First();
            }
            else
            {
                PassOfferId = arrTypeOfPasses[0].ProductList.Where(r => r.PassengerType == "CHILD").Select(r => r.ChildProductId).First();
            }

            ChildBaseAmount = ChildBaseAmount * Child;
            ChildNetAmount = ChildNetAmount * Child;
            string[] ChildAge = param.ChildAge.Split(",".ToCharArray());
            for (var i = 0; i < param.NoChild; i++)
            {
                PaxDetails += ChildAge[i] + ";CHILD;YOUTH;traveler-" + paxcount + "#";
                paxcount++;
            }
        }

        if (param.NoYouth > 0)
        {
            YouthBaseAmount = Convert.ToDouble(arrTypeOfPasses[0].ProductList.Where(r => r.PassengerType == "YOUTH").Select(r => r.BaseAdultPrice).First()) * param.NoYouth;
            YouthNetAmount = Convert.ToDouble(arrTypeOfPasses[0].ProductList.Where(r => r.PassengerType == "YOUTH").Select(r => r.NetAdultPrice).First()) * param.NoYouth;
            YouthAge = "16-26";
            for (var i = 0; i < param.NoYouth; i++)
            {
                PaxDetails += "25;YOUTH;YOUTH;traveler-" + paxcount + "#";
                paxcount++;
            }
        }

        if (param.NoSenior > 0)
        {
            SeniorBaseAmount = Convert.ToDouble(arrTypeOfPasses[0].ProductList.Where(r => r.PassengerType == "SENIOR").Select(r => r.BaseAdultPrice).First()) * param.NoSenior;
            SeniorNetAmount = Convert.ToDouble(arrTypeOfPasses[0].ProductList.Where(r => r.PassengerType == "SENIOR").Select(r => r.NetAdultPrice).First()) * param.NoSenior;
            SeniorAge = "60-99";
            for (var i = 0; i < param.NoSenior; i++)
            {
                PaxDetails += "65;SENIOR;SENIOR;traveler-" + paxcount + "#";
                paxcount++;
            }
        }
        if (param.NoAdult > 0)
            AdultSellAmount = Convert.ToDouble(arrTypeOfPasses[0].ProductList.Where(r => r.PassengerType == "ADULT").Select(r => r.SellAdultPrice).First()) * param.NoAdult;

        if (param.NoChild > 0)
            ChildSellAmount = ChildSellAmount * Child;

        if (param.NoYouth > 0)
            YouthSellAmount = Convert.ToDouble(arrTypeOfPasses[0].ProductList.Where(r => r.PassengerType == "YOUTH").Select(r => r.SellAdultPrice).First()) * param.NoYouth;

        if (param.NoSenior > 0)
            SeniorSellAmount = Convert.ToDouble(arrTypeOfPasses[0].ProductList.Where(r => r.PassengerType == "SENIOR").Select(r => r.SellAdultPrice).First()) * param.NoSenior;


        //param.NoChild = Child; //Here replace child
        param.PassType = "";//Here replace PassType
        param.NetAmount = AdultNetAmount + YouthNetAmount + SeniorNetAmount + ChildNetAmount;
        param.ExchangeRate = Convert.ToDouble(arrTypeOfPasses[0].ProductList[0].ExchangeRate);
        param.SellAmount = AdultSellAmount + YouthSellAmount + SeniorSellAmount + ChildSellAmount;
        param.Discount = Convert.ToDouble(hdnOfferDiscount.Value);
        //param.BookingFee = 0;
        decimal BookingFee = 5; // 2 EUR;
        decimal bROE = Convert.ToDecimal(Request.Form["hdnTFROE"]);// Convert.ToDecimal(param.ExchangeRate);
        int TotalPassengers = param.NoAdult + Child + param.NoYouth + param.NoSenior;
        if (TotalPassengers < 5)
        {
            if (TotalPassengers == 1)
                BookingFee = 5;
            else if (TotalPassengers == 2)
                BookingFee = 2.5M;
            else if (TotalPassengers > 2 && TotalPassengers < 5)
                BookingFee = 2;
            BookingFee = (BookingFee * TotalPassengers);
        }
        else
        {
            BookingFee = 8;

        }
        param.BookingFee = Convert.ToDouble(Math.Round((BookingFee * bROE), 0));
        param.CourierCharge = 0;
        param.BankCharge = 0;
        param.PayabletoSupplier = AdultBaseAmount + YouthBaseAmount + SeniorBaseAmount + ChildBaseAmount;//Era net price. payable to supplier
        param.BookingFeeCurrency = "EUR";
        param.PayabletoSupplierBookingFee = 4.95;
        param.BaseBookingFee = Convert.ToDouble(BookingFee);//here Base bookingfee sending
        param.BookingFeeROE = Convert.ToDouble(bROE);//here booking fee roe EUR to respective billing currency sending

        param.ServiceTax = Convert.ToDouble(mrkup.Count > 0 ? mrkup[0].ServiceTax : 0);
        param.Class = Convert.ToString(Request.Form["hdnClassType"]) == "1" ? "1st Class" : "2nd Class"; //1st class

        param.AgencyId = Convert.ToInt32(oLoginDetail.AgencyId);
        param.DeskId = Convert.ToInt32(oLoginDetail.UserMasterId);
        param.BranchId = Convert.ToInt32(oLoginDetail.BranchId);
        param.RespBranchId = searchParam.RespBranchId;

        param.NetCurrency = Convert.ToString(arrTypeOfPasses[0].ProductList[0].NetCurrency);
        param.SellCurrency = Convert.ToString(arrTypeOfPasses[0].ProductList[0].SellCurrency);
        param.BookedThru = "B2C";
        param.TotalAmount = (Convert.ToDouble(param.SellAmount) + param.BookingFee);// - Convert.ToDouble(hdnOfferDiscount.Value);
        param.TransactionId = Convert.ToString(Session["TransId"]);
        //here fetching Cookies of google UTM_SOURCE if stored for SWISSPASS
        String strUtm = "";
        if (Request.Cookies["utmSwissPass"] != null)
            strUtm = Convert.ToString(Request.Cookies["utmSwissPass"].Value);

        param.IPAddress = strUtm == "" ? Convert.ToString(oLoginDetail.IPAddress) : strUtm;//this column use for google ads tracking;                
        param.EraKey = Convert.ToString(arrTypeOfPasses[0].ProductList[0].EraKey);
        param.PassengerAge = AdultAge;
        param.YouthAge = YouthAge;
        param.SeniorAge = SeniorAge;
        param.ChildAge = ChildsAge;
        param.ProductId = "";

        param.TicketOption = "PAH";
        string[] splitOtherDetails = arrTypeOfPasses[0].ProductList[0].OtherDetails.Split("#".ToCharArray());
        splitOtherDetails[3] = string.IsNullOrEmpty(PassOfferId) ? splitOtherDetails[3] : PassOfferId;

        param.OtherDetails = string.Join("#", splitOtherDetails);
        param.PaxDetails = PaxDetails.Remove(PaxDetails.Length - 1);
        string strEurailTransId = string.Empty;
        string SearchRefNo = RailPassDAL.Create_RailPassSearchRefNo();
        System.Web.HttpContext.Current.Session["RESearchRefID"] = SearchRefNo;
        //string SearchRefNo = Convert.ToString(Session["RESearchRefID"]);
        if (string.IsNullOrEmpty(strEurailTransId))
        {
            Session["TransId"] = transId = strEurailTransId = RailPassDAL.Update_EurailBookingDetail(param, param.TransactionId, SearchRefNo);
            if (strEurailTransId != "")
            {
                Boolean flag = true;
                flag = MtOfferData();
                if (flag)
                    Response.Redirect("/PassMtEx/ShoppingCart.aspx?TransId=" + strEurailTransId + "&cntry=" + countrycode, false);
                else
                    Session["TransId"] = "";
            }
        }
    }
    public Boolean MtOfferData()
    {
        Boolean flag = true;
        DataTable dtMt = new DataTable();
        Int32 NoAdult = Convert.ToInt32(hdnNoOfAdult.Value);
        Int32 NoYouth = Convert.ToInt32(hdnNoOfYouth.Value);
        Int32 NoChild = Convert.ToInt32(hdnNoOfChild.Value);
        String NoOfPax = "ADT" + Convert.ToString((NoAdult + NoYouth)) + ",CHD" + Convert.ToString(NoChild);
        try
        {

            if (Convert.ToString(hdnOffer.Value) != "")
            {
                string strMtExIds = Convert.ToString(hdnOffer.Value).Split('|')[0];
                Eurail oEurail = new Eurail();
                oEurail.MtExIds = strMtExIds;
                oEurail.Currency = cntryCurrency;
                oEurail.FromDate = Convert.ToDateTime(Request.Form["ctl00$ContentPlaceHolder$hdndate"], dateFormatInfo);
                oEurail.MtOffer = Convert.ToString(hdnOffer.Value).Split('|')[1];
                dtMt = oEurail.Mountain_Offer_with_Swiss_Pass();
                if (dtMt.Rows.Count > 0)
                {

                    for (int m = 0; m < strMtExIds.Split(',').Length; m++)
                    {
                        DataTable dtTempMtExId = new DataTable();
                        dtTempMtExId = dtMt.Select("MtExId=" + Convert.ToString(strMtExIds.Split(',')[m])).CopyToDataTable();//filtered Each mounatin here
                        string OfferValidityEndDate = ValidityData(dtTempMtExId);
                        for (int p = 0; p < NoOfPax.Split(',').Length; p++)
                        {
                            int loopTime = 0;
                            DataTable dtTemp = new DataTable();
                            if (Convert.ToString(NoOfPax.Split(',')[p]).IndexOf("ADT") >= 0)
                            {
                                dtTemp = dtTempMtExId.Select("TariffType not like'%chd%'").CopyToDataTable();
                                loopTime = Convert.ToInt32(Convert.ToString(NoOfPax.Split(',')[p]).Replace("ADT", ""));
                                for (var h = 0; h < loopTime; h++)
                                {
                                    oEurail = new Eurail();
                                    oEurail.MtExId = Convert.ToInt32(dtTemp.Rows[0]["MtExId"]);
                                    oEurail.TariffId = Convert.ToInt32(dtTemp.Rows[0]["TariffId"]);
                                    oEurail.Currency = Convert.ToString(dtTemp.Rows[0]["Currency"]);
                                    oEurail.MarkUp = 0;
                                    oEurail.TariffRate = Convert.ToDecimal(dtTemp.Rows[0]["ActualRate"]);
                                    oEurail.ROE = Convert.ToDecimal(dtTemp.Rows[0]["ROE"]);
                                    oEurail.CnvtTariffRate = Convert.ToDecimal(dtTemp.Rows[0]["Rate"]);
                                    oEurail.CourierCharges = 0;
                                    oEurail.BankCharges = 0;
                                    oEurail.BookingFee = 0;
                                    oEurail.ServiceTax = Convert.ToDouble(mrkup.Count > 0 ? mrkup[0].ServiceTax : 0);
                                    oEurail.CnvtCurrency = Convert.ToString(dtTemp.Rows[0]["CnvtCurrency"]);
                                    oEurail.AgencyId = Convert.ToInt32(oLoginDetail.AgencyId);
                                    oEurail.DeskId = Convert.ToInt32(oLoginDetail.UserMasterId);
                                    oEurail.BranchId = Convert.ToInt32(oLoginDetail.BranchId);
                                    oEurail.Years = Convert.ToDateTime(Request.Form["ctl00$ContentPlaceHolder$hdndate"], dateFormatInfo).ToString("yyyy-MM-dd 00:00:00");
                                    oEurail.TransactionId = transId != "" ? transId : "";
                                    oEurail.Position = Convert.ToString(Session["Position"]) != "" ? Convert.ToInt32(Session["Position"]) : 1;
                                    oEurail.OfferValidityEndDate = Convert.ToDateTime(OfferValidityEndDate, dateFormatInfo);
                                    Session["Position"] = Convert.ToString(oEurail.Position);
                                    Session["TransId"] = transId = oEurail.Insert_Mountain_Excursions_Tariff_ShoppingCart();
                                }
                            }
                            else if (Convert.ToString(NoOfPax.Split(',')[p]).IndexOf("CHD") >= 0)
                            {
                                dtTemp = dtTempMtExId.Select("TariffType like'%chd%'").CopyToDataTable();
                                //no need of below one
                                loopTime = Convert.ToInt32(Convert.ToString(NoOfPax.Split(',')[p]).Replace("CHD", ""));
                                String strChildAge = Convert.ToString(hdnChildAge.Value);
                                for (var c = 0; c < loopTime; c++)
                                {
                                    string selectedChildAge = "0";
                                    selectedChildAge = Convert.ToString(strChildAge.Split(',')[c]);
                                    if (Convert.ToInt32(selectedChildAge) > 0)
                                    {
                                        for (int t = 0; t < dtTemp.Rows.Count; t++)
                                        {
                                            String[] chdAge = Convert.ToString(dtTemp.Rows[t]["TariffType"]).ToLower().Replace("chd", "").Trim().IndexOf('/') >= 0 ? Convert.ToString(dtTemp.Rows[t]["TariffType"]).ToLower().Replace("chd", "").Trim().Split('/') : Convert.ToString(dtTemp.Rows[t]["TariffType"]).ToLower().Replace("chd", "").Trim().Split('-');
                                            chdAge[0] = chdAge[0].ToLower() == "u" ? "0" : chdAge[0];
                                            if (Convert.ToInt32(chdAge[0]) <= Convert.ToInt32(selectedChildAge) && Convert.ToInt32(chdAge[1]) >= Convert.ToInt32(selectedChildAge))
                                            {
                                                oEurail = new Eurail();
                                                oEurail.MtExId = Convert.ToInt32(dtTemp.Rows[t]["MtExId"]);
                                                oEurail.TariffId = Convert.ToInt32(dtTemp.Rows[t]["TariffId"]);
                                                oEurail.Currency = Convert.ToString(dtTemp.Rows[t]["Currency"]);
                                                oEurail.MarkUp = 0;
                                                oEurail.TariffRate = Convert.ToDecimal(dtTemp.Rows[t]["ActualRate"]);
                                                oEurail.ROE = Convert.ToDecimal(dtTemp.Rows[t]["ROE"]);
                                                oEurail.CnvtTariffRate = Convert.ToDecimal(dtTemp.Rows[t]["Rate"]);
                                                oEurail.CourierCharges = 0;
                                                oEurail.BankCharges = 0;
                                                oEurail.BookingFee = 0;
                                                oEurail.ServiceTax = Convert.ToDouble(mrkup.Count > 0 ? mrkup[0].ServiceTax : 0);
                                                oEurail.CnvtCurrency = Convert.ToString(dtTemp.Rows[t]["CnvtCurrency"]);
                                                oEurail.AgencyId = Convert.ToInt32(oLoginDetail.AgencyId);
                                                oEurail.DeskId = Convert.ToInt32(oLoginDetail.UserMasterId);
                                                oEurail.BranchId = Convert.ToInt32(oLoginDetail.BranchId);
                                                oEurail.Years = Convert.ToDateTime(Request.Form["ctl00$ContentPlaceHolder$hdndate"], dateFormatInfo).ToString("yyyy-MM-dd 00:00:00");
                                                oEurail.TransactionId = transId != "" ? transId : "";
                                                oEurail.Position = Convert.ToString(Session["Position"]) != "" ? Convert.ToInt32(Session["Position"]) : 1;
                                                oEurail.OfferValidityEndDate = Convert.ToDateTime(OfferValidityEndDate, dateFormatInfo);
                                                Session["Position"] = Convert.ToString(oEurail.Position);
                                                Session["TransId"] = transId = oEurail.Insert_Mountain_Excursions_Tariff_ShoppingCart();
                                            }
                                        }
                                    }

                                }
                            }

                        }
                    }
                }
            }
        }
        catch (Exception ex)
        {

            flag = false;
        }
        return flag;
    }
    public string ValidityData(DataTable dtMt)
    {
        string strOfferValidityEndDate = string.Empty;
        try
        {
            DataTable dtSummary = new DataTable();
            Eurail oEurail = new Eurail();
            oEurail.TransactionId = Convert.ToString(Session["TransId"]);
            dtSummary = oEurail.Get_Eurail_Tariff_ShoppingCart_Summary();


            if (Convert.ToDateTime(dtMt.Rows[0]["OfferValidityEndDate"]).ToString("dd-MM-yyyy") == "01-01-1900")
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
                    if (Convert.ToDateTime(Request.Form["ctl00$ContentPlaceHolder$hdndate"], dateFormatInfo).AddDays(30) >= Convert.ToDateTime(dtMt.Rows[0]["ValidityDate"]))
                    {
                        strOfferValidityEndDate = Convert.ToDateTime(dtMt.Rows[0]["ValidityDate"]).ToString("dd-MM-yyyy");
                    }
                    else
                    {
                        strOfferValidityEndDate = Convert.ToDateTime(Request.Form["ctl00$ContentPlaceHolder$hdndate"], dateFormatInfo).AddDays(30).ToString("dd-MM-yyyy");
                    }
                }
            }
            else
            {
                strOfferValidityEndDate = Convert.ToDateTime(dtMt.Rows[0]["OfferValidityEndDate"]).ToString("dd-MM-yyyy");
            }
        }
        catch (Exception)
        {

            strOfferValidityEndDate = "";
        }
        return strOfferValidityEndDate;
    }
    public class ProductFamilyListDO
    {
        public string PassType { get; set; }
        public string LblFamily { get; set; }
        public string Benefits { get; set; }
        public string HowItWorks { get; set; }

        public string Info { get; set; }
        public List<PassengerDO> PassengerList;
        //public List<FamilyPassDO> FamilyPassList;
    }
    public class FamilyPassDO
    {
        public string PassengerType { get; set; }
        public string AgeLimit { get; set; }


    }
    public class PassengerDO
    {
        public string Type { get; set; }

        public List<PassClassDO> PassClass;

        //public List<PassDO> PassList;
    }
    public class PassDO
    {
        public string ProductName { get; set; }
        public float MinPrice { get; set; }
        public string OfferDescription { get; set; }
        public List<ProductDO> ProductList;
    }
    public class PassClassDO
    {
        public string PassClass { get; set; }

        public List<ProductNameDO> ProductNameList;
    }
    public class ProductNameDO
    {
        public string ProductName { get; set; }
        public int SequenceByDuration { get; set; }
        public float SequenceByAdultPrice { get; set; }

        public List<ProductDO> ProductList;
        public string Offer { get; set; }
        public string TravelDate { get; set; }
    }
    public class ProductDO
    {
        public string FamilyName { get; set; }
        public int FamilyId { get; set; }
        public string ProductName { get; set; }
        public string ProductId { get; set; }
        public string ChildProductId { get; set; }
        public string PassType { get; set; }
        public string PassClass { get; set; }
        public string PassengerType { get; set; }
        public string DefaultPassengerType { get; set; }
        public float Price { get; set; }
        public float StrikePrice { get; set; }
        public float BaseAdultPrice { get; set; }
        public float BaseChildPrice { get; set; }
        public float NetAdultPrice { get; set; }
        public float NetChildPrice { get; set; }
        public string NetCurrency { get; set; }
        public string Type { get; set; }
        public Double ExchangeRate { get; set; }
        public float SellAdultPrice { get; set; }
        public float SellChildPrice { get; set; }
        public string SellCurrency { get; set; }
        public string Info { get; set; }
        public int PassengerCount { get; set; }
        public bool ChildFree { get; set; }
        public string AgeLimit { get; set; }
        public string CountriesSelected { get; set; }
        public string ChildAgelbl { get; set; }
        public string OfferDescription { get; set; }
        public string OtherDetails { get; set; }
        public string SearchId { get; set; }
        public string TravellerId { get; set; }
        public string Duration { get; set; }
        public string ValidityDuration { get; set; }
        public string EraKey { get; set; }
        //public string AllNetPrice { get; set; }
        //public string AllSellPrice { get; set; }
        public string Tags { get; set; }
    }

    private StringBuilder BindAboutInfo(int id)
    {
        DataTable dtEurailInfo = new DataTable();
        StringBuilder htmlInfo = new StringBuilder();
        oClsEurail.EurailId = id;
        oClsEurail.AgencyId = Convert.ToInt32(oLoginDetail.AgencyId);
        dtEurailInfo = oClsEurail.GetEurailInfo_Seo();
        if (dtEurailInfo.Rows.Count > 0)
        {
            DataTable dtHeading = new DataTable();
            dtHeading = dtEurailInfo.DefaultView.ToTable(true, "HSequence", "Heading", "HeadingType");

            for (int i = 0; i < dtHeading.Rows.Count; i++)
            {
                string HSequence = "", Heading = "", HeadingType = ""; int SHSequence = 0;
                HSequence = Convert.ToString(dtHeading.Rows[i]["HSequence"]);
                Heading = Convert.ToString(dtHeading.Rows[i]["Heading"]);
                HeadingType = Convert.ToString(dtHeading.Rows[i]["HeadingType"]);
                DataTable dtData = new DataTable();
                dtData = dtEurailInfo.Select("HSequence=" + HSequence + " and Heading='" + Heading + "' and HeadingType='" + HeadingType + "'").CopyToDataTable();
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
                }
                else if (HeadingType.ToUpper() == "IMAGE")
                {
                    htmlInfo.Append("<div>");
                    for (int d = 0; d < dtData.Rows.Count; d++)
                    {
                        if (Convert.ToString(dtData.Rows[d]["DataType"]) == "Paragraph")
                        {
                            htmlInfo.Append("<strong style='margin-bottom: 4px'>" + Convert.ToString(dtData.Rows[d]["TextData"]) + "</strong >");
                        }
                        else
                        {
                            htmlInfo.Append("<br>");
                            htmlInfo.Append("<img alt='" + Convert.ToString(dtData.Rows[d]["ImageAlt"]) + "' src='" + Convert.ToString(dtData.Rows[d]["ImagePath"]) + "' style='border: 1px solid #aaa; width: 100%; max-width: 500px; margin-bottom: 10px; box-shadow: 0 3px 7px rgba(0,0,0,.15)'>");
                        }
                    }
                    htmlInfo.Append("</div>");
                }
                else if (HeadingType.ToUpper() == "UL")
                {
                    htmlInfo.Append("<ul>");
                    for (int d = 0; d < dtData.Rows.Count; d++)
                    {//
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
                    //dtTD = dtData.Select("DataType='td'").CopyToDataTable();
                    //for (int td = 0; td < dtTD.Rows.Count; td++)
                    //{
                    //    htmlInfo.Append("<tr>");
                    //    string strTd = Convert.ToString(dtTD.Rows[td]["TextData"]);
                    //    for (int s = 0; s < strTd.Split(';').Length; s++)
                    //    {
                    //        htmlInfo.Append("<td>" + Convert.ToString(strTd.Split(';')[s]) + "</td>");
                    //    }
                    //    htmlInfo.Append("</tr>");
                    //    //htmlInfo.Append("<" + Convert.ToString(dtData.Rows[d]["DataType"]).Replace("List", "li") + ">" + Convert.ToString(dtData.Rows[d]["TextData"]) + "</" + Convert.ToString(dtData.Rows[d]["DataType"]).Replace("List", "li") + ">");
                    //}
                    htmlInfo.Append("</Table>");
                }
                if (i == 1)
                {
                    aboutInfo.InnerHtml = htmlInfo.ToString();
                    htmlInfo = new StringBuilder();
                }

            }
            //  divExcursionPoints.InnerHtml = htmlInfo.ToString();
        }
        return htmlInfo;
    }

    private StringBuilder BindFaq()
    {
        StringBuilder htmlInfo = new StringBuilder();
        htmlInfo.Append("<div class='title'>");
        htmlInfo.Append("<div class='container-fluid fixanchor' id='faqs'></div>");
        htmlInfo.Append("<h2 class='text-center'>FAQs on Swiss Travel Pass</h2>");
        htmlInfo.Append("</div>");

        htmlInfo.Append("<div style='max-width:1000px; margin: 0 auto 30px; float: none;'>");
        htmlInfo.Append("<ul class='faq_set'>");

        htmlInfo.Append("<li>");
        htmlInfo.Append("<div class='expandhead question'> What is a Swiss Travel Pass ?</div>");
        htmlInfo.Append("<div class='expandbox answer'>");
        htmlInfo.Append("<p>A Swiss Travel Pass is a pass that allows you to access unlimited travel on a train, bus, boat, and tram across Switzerland’s public transport and provides up to 50% discounts on excursions.</p>");
        htmlInfo.Append("</div>");
        htmlInfo.Append("</li>");

        htmlInfo.Append("</ul>");

        htmlInfo.Append("<div class='clearfix'></div>");
        htmlInfo.Append("</div>");
        return htmlInfo;
    }
}