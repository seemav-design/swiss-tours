using AdminClasses;
using RailEuropeClasses;
using System;
using System.Collections.Generic;
using System.Data;
using System.Globalization;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Xml;
using Newtonsoft.Json;
using System.Text.RegularExpressions;
using System.Text;
using EurailClasses;

public partial class PassMtEx_Rail_Pass : System.Web.UI.Page
{
    public String countrycode = "IN";
    public String cntryCurrency = "INR";
    public String transId = "";
    public string strFamilyId = "100029";
    static Eurail oClsEurail = new Eurail();
    static LoginDetail oLoginDetail = new LoginDetail();
    GetFamilyList oGetFamilyList = new GetFamilyList();
    protected void Page_Load(object sender, EventArgs e)
    {
        if (!string.IsNullOrEmpty(Request.QueryString["FamilyId"]))
            strFamilyId = Convert.ToString(Request.QueryString["FamilyId"]);
        //oGetFamilyList.InsertREAFamily();//to retrive family list
        oLoginDetail.BranchId = "1"; //defualt value for branchid
        Session["PassCurrency"] = countrycode;//defualt value 
        if (strFamilyId == "100715")
        {
            Page.Title = "Swiss Travel Pass: Buy Online, Discount, Benefit, Inclusions";
            Page.MetaDescription = "Buy Swiss Travel Pass online to explore Switzerland by rail, boat, & bus. Enjoy 2019 discount on cost price, promotional offers, know benefits, & more.";
            Page.MetaKeywords = "";
        }
        AboutContent.InnerHtml= Convert.ToString(BindAboutInfo(Convert.ToInt32(strFamilyId)));
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
        if (!string.IsNullOrEmpty(oLoginDetail.UrlCountry))
        {
            var regexItem = new Regex("^[A-Z]*$");
            if (regexItem.IsMatch(Convert.ToString(oLoginDetail.UrlCountry)))
            {
                Session["PassCurrency"] = countrycode = Convert.ToString(oLoginDetail.UrlCountry);
                cntryCurrency = Convert.ToString(oLoginDetail.UrlCurrency);
            }
        }

        //here createing Cookies for SWISSPASS if landing here from google search and our campaian.
        if (Request.QueryString["utm_source"] != null && Request.QueryString["utm_source"].ToString() != string.Empty)
        {
            String strUtm = Convert.ToString(Request.QueryString["utm_source"]) + "|" + Convert.ToString(Request.QueryString["utm_medium"]) + "|" + Convert.ToString(Request.QueryString["utm_campaign"]) + "|" + Convert.ToDateTime(DateTime.Now).ToString("yyyyMMddhhmmtt");
            if (Convert.ToString(Request.QueryString["utm_campaign"]) == "SwissTravelPass")
            {
                if (Request.Cookies["utmSwissPass"] != null)
                    Response.Cookies["utmSwissPass"].Expires = DateTime.Now.AddDays(-1);

                HttpCookie utmSwissPass = new HttpCookie("utmSwissPass");
                utmSwissPass.Value = strUtm;
                utmSwissPass.Expires = DateTime.Now.AddDays(30.0);
                Response.Cookies.Add(utmSwissPass);
            }

            if (Request.Cookies["utm" + strFamilyId] != null)//if cookie already available then delete the same and create
                Response.Cookies["utm" + strFamilyId].Expires = DateTime.Now.AddDays(-1);

            HttpCookie cookieUTM = new HttpCookie("utm" + strFamilyId);
            cookieUTM.Value = strUtm;
            cookieUTM.Expires = DateTime.Now.AddDays(30.0);
            Response.Cookies.Add(cookieUTM);

        }

        Page.Title = countrycode != "IN" ? "Buy Swiss Travel Pass | SWISStours" : Page.Title;
        hdnCountryCode.Value = countrycode;
        if (!string.IsNullOrEmpty(Convert.ToString(Session["TransId"])))
            transId = Convert.ToString(Session["TransId"]);

        if (!IsPostBack)
        {
            //lblCartCnt.Text = Convert.ToString(Session["CartCnt"]);
            if (!string.IsNullOrEmpty(strFamilyId))
            {
                LoadFamily();
                if (ddlPassFamily.Items.Count > 0)
                {
                    DataTable dt = (DataTable)Session["PassFamilyList"];


                    if (strFamilyId == "100715" && Convert.ToString(countrycode) != "IN")
                    {
                        ddlPassFamily.SelectedValue = "101120" + ";0;;";
                        if (Convert.ToString(countrycode) == "LK")
                        {
                            DataRow[] result = dt.Select("FamilyId=" + 101120);
                            ddlPassFamily.SelectedValue = "101120" + ";" + result[0]["PromoFamilyId"] + ";" + result[0]["PromoFamilyText"] + ";" + result[0]["WithoutPromoFamilyText"];
                        }
                    }
                    else
                    {
                        DataRow[] result = dt.Select("FamilyId=" + Convert.ToInt32(strFamilyId));
                        ddlPassFamily.SelectedValue = strFamilyId + ";" + result[0]["PromoFamilyId"] + ";" + result[0]["PromoFamilyText"] + ";" + result[0]["WithoutPromoFamilyText"];
                    }
                    Page.ClientScript.RegisterStartupScript(this.GetType(), "myScript", "ChangePassDetails('" + ddlPassFamily.SelectedValue + "');", true);
                    //if (strFamilyId == "100715")//Swiss travel pass tab coding
                    //{
                    //    //tblMinRate.Style.Add("display", "none");
                    //    MRFAQ.Style.Add("display", "none");
                    //    divSaverLeft.Style.Add("display", "none");
                    //}
                    //else
                    //{
                    //    CU16Free.Style.Add("display", "none");
                    //    OBonuses.Style.Add("display", "none");
                    //    FAQ.Style.Add("display", "none");
                    //    dvswisspassfaq.Style.Add("display", "none");
                    //    if (Convert.ToString(countrycode) == "IN")
                    //    {
                    //        //divQuizWFESP.Visible = true;
                    //    }
                    //}
                    //if (Convert.ToString(countrycode) != "IN")
                    //{
                    //    divOffer.Visible = false;
                    //}
                }

            }
            else { Response.Redirect("~/Default.aspx", true); }
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

                if (dt.Select("FamilyId=100715").Length > 0)// removeing here swiss travel pass which comes from REA because ERA STP already
                    dt.Rows.Remove(dt.Select("FamilyId in(100715)")[0]);

                if (dt.Rows.Count > 0)
                {

                    //If familyname contain eurail then it is replace by empty space and the pass string replace by "Eurail Pass" string(eg. "Eurail Global Pass" is replace with "Global Eurail Pass")
                    var result = (from d in dt.AsEnumerable()
                                  let value = d.Field<string>("FamilyName").ToUpper().Contains("EURAIL").ToString()
                                  select new
                                  {
                                      FamilyName = value == "True" ? Convert.ToString(d.Field<string>("FamilyName")).Replace("Eurail ", "").Replace(" Pass", " Eurail Pass") : Convert.ToString(d.Field<string>("FamilyName")),
                                      FamilyId = d.Field<int>("FamilyId") + ";" + (d.Field<int?>("PromoFamilyId") == null ? 0 : d.Field<int?>("PromoFamilyId")) + ";" + (d.Field<string>("PromoFamilyText") == null ? "" : d.Field<string>("PromoFamilyText")) + ";" + (d.Field<string>("WithoutPromoFamilyText") == null ? "" : d.Field<string>("WithoutPromoFamilyText")),
                                  }).ToList();

                    Session["PassFamilyList"] = dt;

                    ddlPassFamily.DataSource = result;
                    ddlPassFamily.DataBind();
                    ddlPassFamily.Items.Insert(0, new ListItem("Select Pass", "-1"));

                    System.Web.HttpContext.Current.Session["REMemberKey"] = hdnREAKey.Value = Convert.ToString(dt.Rows[0]["REAKey"]);
                }
            }
            catch { Response.Redirect("~/Default.aspx", true); }
        }
        else { Response.Redirect("~/Default.aspx", true); }
    }

    [System.Web.Services.WebMethod(EnableSession = true)]
    public static List<ProductFamilyListDO> GetPassResult(int Id, string CountryName, string REAKey)
    {
        List<ProductFamilyListDO> List = new List<ProductFamilyListDO>();

        if (!string.IsNullOrEmpty(Convert.ToString(HttpContext.Current.Session["PassCurrency"])))
        {
            try
            {
                string ToCurrency = CountryToCurrency.GetCountryToCurrency(Convert.ToString(HttpContext.Current.Session["PassCurrency"]));
                RailEuropeRea RailPass = new RailEuropeRea();

                string XML = RailPass.SearchFamilyInfo(Id, REAKey);
                XmlDocument xmldoc = new XmlDocument();
                xmldoc.LoadXml(XML);

                //BindAboutInfo(Convert.ToInt32(Id));



                List<ProductDO> productList = new List<ProductDO>();

                List<XmlNode> passProduct = new List<XmlNode>(xmldoc.SelectNodes("response/content/timestampedData/passProductContent/passProducts/passProduct").OfType<XmlNode>());

                DataTable dt = new DataTable();
                string CountriesSelected = string.Empty;
                if (!string.IsNullOrEmpty(CountryName))
                {
                    dt = RailPass.GetPassCountries(Id, CountryName, "");
                    if (dt.Rows.Count > 0)
                    {
                        string RateLevel = Convert.ToString(dt.Rows[0]["RateLevel"]);
                        CountriesSelected = Convert.ToString(dt.Rows[0]["CountryCode"]);
                        RateLevel = RateLevel == "L" ? "LOW" : (RateLevel == "M" ? "MEDIUM" : "HIGH");

                        //Filter those passes from xml which are ratelevel is (Low/Medium/High). RateLevel is getting from database based on countries which are selected by user.
                        passProduct = (from XmlNode d in passProduct
                                       where (d.SelectSingleNode("productName").InnerText).Contains(RateLevel)
                                       select d).ToList();
                    }
                    else { passProduct = null; }
                }
                //xmldoc.Load("D:\\Shreya\\RailEurope\\REAProductInformation.xml");   
                try
                {
                    if (passProduct != null)
                    {
                        //All Swiss passes are in "CHF" currency. i.e hardcoded.
                        string FromCurrency = passProduct[0].SelectSingleNode("productName").InnerText.Contains("STS") ? "CHF" : Convert.ToString(passProduct[0].SelectSingleNode("price/sellingPrice/currencyCode").InnerText);
                        string Info = "<b>Conditions:</b><br>" + Convert.ToString(passProduct[0].SelectSingleNode("termsAndConditions").InnerText);//.Replace("Range is in CHF.\n", "").Replace("\nRange is in CHF. Please make sure your exchange rate is properly set if you sell in an currency. Coupon is printed in CHF.", "");

                        ////////////here replaceing some data/string/value from condition whatever REA giving us////////////
                        Info = InfoDictionary.Get_Replaced_Conditions(Info);

                        /*if (Id == 100942 || Id == 101161)
                        {
                            Info = Info.Substring(0, Info.IndexOf("\nPACKAGING INSTRUCTIONS"));
                        }
                        else
                        {
                            Info = Info.Substring(0, Info.IndexOf("\nREFUND POLICY"));
                        }*/
                        switch (Id)
                        {
                            case 100942:
                            case 101161:
                            case 100992:
                            case 100991:
                            case 101014:
                            case 101212:
                            case 100926:
                            case 101185:
                            case 101146:
                            case 101147:
                            case 101155:
                            case 101156:
                            case 101154:
                            case 101162:
                            case 101150:
                            case 101042:
                            case 100927:
                            case 101157:
                            case 101165:
                            case 101164:
                            case 101148:
                            case 101149:
                            case 101159:
                            case 101172:
                            case 101173:
                            case 101171:
                            case 101141:
                            case 101163:
                            case 101170:
                            case 101158:
                            case 101160:
                            case 101114:
                            case 101655:
                            //case 101167:
                            //	if (Info.IndexOf("A 15% cancellation penalty applies to completely unused and unvalidated passes returned within 1 year of issue date.") >= 0)
                            //		Info = Info.Replace("A 15% cancellation penalty applies to completely unused and unvalidated passes returned within 1 year of issue date.", "non-refundable.");								
                            //	break;
                            case 101103:
                                if (Info.IndexOf("\n<b>PACKAGING INSTRUCTIONS") >= 0)
                                    Info = Info.Substring(0, Info.IndexOf("\n<b>PACKAGING INSTRUCTIONS"));
                                else if (Info.IndexOf("\nPACKAGING INSTRUCTIONS") >= 0)
                                    Info = Info.Substring(0, Info.IndexOf("\nPACKAGING INSTRUCTIONS"));
                                break;
                            default:
                                if (Info.IndexOf("\n<b>REFUND POLICY") >= 0)
                                    Info = Info.Substring(0, Info.IndexOf("\n<b>REFUND POLICY"));
                                else if (Info.IndexOf("\nREFUND POLICY") >= 0)
                                    Info = Info.Substring(0, Info.IndexOf("\nREFUND POLICY"));
                                break;

                        }
                        Info = Info.Replace("\r", "&nbsp;").Replace("\n", "<br/>").Replace("Please make sure your exchange rate is properly set if you sell in another currency. ", "");

                        float ROE = 1; int YouthAge = 0; int ChildAge = 0; int SeniorAge = 0;
                        string Offers = string.Empty;
                        string strBenefits = string.Empty;
                        string strHowItWorks = string.Empty;
                        DataSet ds = RailPass.Get_REA_OffersAndROE(FromCurrency, ToCurrency, Id);
                        if (ds.Tables.Count > 0)
                        {
                            if (ds.Tables[0].Rows.Count > 0)
                            {
                                ROE = Convert.ToSingle(ds.Tables[0].Rows[0]["ExchangeRate"]);
                                if (Id == 100715)
                                    ROE = ROE - (float)1.75;//this is for swiss pass only and for India market 
                            }
                            if (ds.Tables[1].Rows.Count > 0)
                            {
                                Offers = Convert.ToString(ds.Tables[1].Rows[0]["OfferDescription"]);
                            }
                            if (ds.Tables[2].Rows.Count > 0)
                            {
                                strBenefits = Convert.ToString(ds.Tables[2].Rows[0]["Benefits"]);
                                strHowItWorks = Convert.ToString(ds.Tables[2].Rows[0]["HowItWorks"]);//in b2C use HowItWorks
                            }
                        }
                        DataTable dtOfferDaysWise = new DataTable();
                        DataSet dsOfferDaysWise = RailPass.Get_REA_Pass_Offers_Days_Wise(Id, 0, "", Convert.ToString(HttpContext.Current.Session["PassCurrency"]));
                        if (dsOfferDaysWise != null)
                            if (dsOfferDaysWise.Tables.Count > 0)
                                if (dsOfferDaysWise.Tables[0].Rows.Count > 0)
                                    dtOfferDaysWise = dsOfferDaysWise.Tables[0];
                        try
                        {
                            YouthAge = (from d in passProduct
                                        where Convert.ToString(d.SelectSingleNode("defaultPassengerType").InnerText) == "youth"
                                        select Convert.ToInt32(d.SelectSingleNode("passengerTypeDetails/passengerTypeDetail/ageRange/high").InnerText)).FirstOrDefault();
                        }
                        catch { }

                        try
                        {
                            SeniorAge = (from d in passProduct
                                         where Convert.ToString(d.SelectSingleNode("defaultPassengerType").InnerText) == "senior"
                                         select Convert.ToInt32(d.SelectSingleNode("passengerTypeDetails/passengerTypeDetail/ageRange/high").InnerText)).FirstOrDefault();
                        }
                        catch { }

                        try
                        {
                            ChildAge = (from d in passProduct
                                        where Convert.ToString(d.SelectSingleNode("passengerTypeDetails/passengerTypeDetail/passengerType").InnerText) == "child"
                                        select Convert.ToInt32(d.SelectSingleNode("passengerTypeDetails/passengerTypeDetail/ageRange/high").InnerText)).FirstOrDefault();
                        }
                        catch { }
                        foreach (XmlNode x in passProduct)
                        {
                            float price = Convert.ToSingle(Math.Ceiling(Convert.ToSingle(x.SelectSingleNode("price/sellingPrice/amount").InnerText)));

                            ProductDO list = new ProductDO();
                            string ProductName = Convert.ToString(x.SelectSingleNode("productName").InnerText);
                            string DefaultPassengerType = Convert.ToString(x.SelectSingleNode("defaultPassengerType").InnerText);
                            XmlNode NodePassengerType = x.SelectSingleNode("passengerTypeDetails/passengerTypeDetail");
                            string PassengerType = NodePassengerType != null ? Convert.ToString(NodePassengerType.SelectSingleNode("passengerType").InnerText) : "child";

                            list.FamilyName = Convert.ToString(x.SelectSingleNode("familyName").InnerText);
                            string validityPeriod = string.Empty;
                            validityPeriod = Convert.ToString(x.SelectSingleNode("duration/travelPeriod").InnerText) == Convert.ToString(x.SelectSingleNode("duration/validityPeriod").InnerText) ? "Continuous" : "Flexi";
                            list.ProductName = ProductName.Replace(list.FamilyName, "") + " " + validityPeriod;
                            list.DefaultPassengerType = DefaultPassengerType;
                            list.NetAdultPrice = PassengerType != "child" ? price : 0;
                            list.NetChildPrice = PassengerType == "child" ? price : 0;
                            list.FamilyId = Id;
                            list.ProductId = Convert.ToString(x.SelectSingleNode("productId").InnerText);
                            list.PassType = Convert.ToString(x.SelectSingleNode("passType").InnerText);
                            list.PassengerType = PassengerType;
                            list.PassClass = Convert.ToString(x.SelectSingleNode("physicalClassOfService").InnerText);
                            list.NetCurrency = FromCurrency;
                            //list.Type = (Id == 100965 || Id == 101120) ? "Consecutive" : ProductName.ToUpper().Contains("IN") == true ? "Flexi" : "Consecutive";                            
                            list.Type = validityPeriod;
                            list.SellCurrency = ToCurrency;
                            list.SellAdultPrice = PassengerType != "child" ? Convert.ToSingle(Math.Ceiling(price * ROE)) : 0;
                            list.SellChildPrice = PassengerType == "child" ? Convert.ToSingle(Math.Ceiling(price * ROE)) : 0;
                            list.Info = Info;
                            list.PassengerCount = Convert.ToInt32(x.SelectSingleNode("nAdults").InnerText) == 0 ? 1 : Convert.ToInt32(x.SelectSingleNode("nAdults").InnerText);
                            list.ChildFree = x.SelectSingleNode("nFreeChildren").InnerText == "1" ? true : false;
                            list.AgeLimit = NodePassengerType != null ? Convert.ToString(NodePassengerType.SelectSingleNode("ageRange/low").InnerText) + "-" + Convert.ToString(NodePassengerType.SelectSingleNode("ageRange/high").InnerText) : "";
                            if (PassengerType == "adult")
                            {
                                // list.AgeLimit = YouthAge > 0 ? ((YouthAge + 1) + "-59") : (Convert.ToInt32(NodePassengerType.SelectSingleNode("ageRange/low").InnerText) == 1 || Convert.ToInt32(NodePassengerType.SelectSingleNode("ageRange/low").InnerText) == 0) ? (ChildAge + 1 + "-59") : Convert.ToString(NodePassengerType.SelectSingleNode("ageRange/low").InnerText) + "-59";
                                list.AgeLimit = YouthAge > 0 && SeniorAge > 0 ? ((YouthAge + 1) + "-59") : (YouthAge > 0 ? ((YouthAge + 1) + "-99") : (Convert.ToInt32(NodePassengerType.SelectSingleNode("ageRange/low").InnerText) == 1 || Convert.ToInt32(NodePassengerType.SelectSingleNode("ageRange/low").InnerText) == 0) ? (ChildAge + 1 + "-99") : Convert.ToString(NodePassengerType.SelectSingleNode("ageRange/low").InnerText) + "-99");
                            }
                            list.AgeLimit = list.AgeLimit.Replace("999", "99");
                            //list.AgeLimit = list.AgeLimit.Replace("120", "99");
                            list.ExchangeRate = ROE;
                            productList.Add(list);
                        }

                        List = (from d in productList
                                group d by d.PassType into grp
                                select new ProductFamilyListDO
                                {
                                    PassType = CultureInfo.CurrentCulture.TextInfo.ToTitleCase(grp.First().PassType),
                                    LblFamily = grp.First().PassType == "saver" ? grp.First().PassengerCount + " to 5 Person" : "",
                                    Benefits = strBenefits,
                                    HowItWorks = strHowItWorks,
                                    FamilyPassList = (from r in grp
                                                      group r by r.DefaultPassengerType into familypass
                                                      select new FamilyPassDO
                                                      {
                                                          PassengerType = CultureInfo.CurrentCulture.TextInfo.ToTitleCase(familypass.First().DefaultPassengerType),
                                                          AgeLimit = familypass.Where(o => o.PassengerType != "child").Select(o => o.AgeLimit).FirstOrDefault(),
                                                          PassengerList = (from r in familypass
                                                                           group r by r.Type into grpr
                                                                           select new PassengerDO
                                                                           {
                                                                               Type = grpr.First().Type,
                                                                               Info = grpr.First().Info,
                                                                               PassList = (from qr in grpr
                                                                                           group qr by qr.ProductName into pass
                                                                                           select new PassDO
                                                                                           {
                                                                                               ProductName = pass.First().ProductName,
                                                                                               MinPrice = Convert.ToSingle(Math.Ceiling(pass.Where(p => p.PassengerType != "child").Min(p => p.SellAdultPrice / p.PassengerCount))),
                                                                                               OfferDescription = Offers,
                                                                                               ProductList = (from passlist in pass
                                                                                                              group passlist by passlist.PassClass into li
                                                                                                              let price = (li.First().PassType == "saver" || li.First().PassType == "party") ? li.First().NetAdultPrice / li.First().PassengerCount : li.Where(p => p.PassengerType != "child").Sum(o => o.NetAdultPrice)
                                                                                                              let ConvertedAdultPrice = (li.First().PassType == "saver" || li.First().PassType == "party") ? li.First().SellAdultPrice / li.First().PassengerCount : li.Where(p => p.PassengerType != "child").Sum(o => o.SellAdultPrice)
                                                                                                              let ConvertedChildPrice = (li.First().PassType == "saver" || li.First().PassType == "party") ? li.First().SellChildPrice / li.First().PassengerCount : li.Where(p => p.PassengerType == "child").Sum(o => o.SellChildPrice)
                                                                                                              select new ProductDO
                                                                                                              {
                                                                                                                  PassClass = li.First().PassClass,
                                                                                                                  ProductName = li.First().ProductName,
                                                                                                                  //ProductId = li.Where(j => j.PassengerType != "child").Select(r => r.ProductId).FirstOrDefault(),
                                                                                                                  ProductId = string.Join("*", li.Where(j => j.PassengerType != "child").Select(r => r.PassengerCount)) + "/" + string.Join("~", li.Where(j => j.PassengerType != "child").Select(r => r.ProductId)),
                                                                                                                  ChildProductId = li.Where(j => j.PassengerType == "child").Select(r => r.ProductId).FirstOrDefault(),
                                                                                                                  PassType = li.First().PassType,
                                                                                                                  Price = price,
                                                                                                                  OfferDescription = Convert.ToString(dtOfferDaysWise != null ? (dtOfferDaysWise.Rows.Count > 0 ? (dtOfferDaysWise.Select("PassClass=" + li.First().PassClass + " and PassengerType ='" + li.First().DefaultPassengerType + "' and ProductName='" + Convert.ToString(li.First().ProductName).Trim() + "'").Length > 0 ? (dtOfferDaysWise.Select("PassClass=" + li.First().PassClass + " and PassengerType ='" + li.First().DefaultPassengerType + "' and ProductName='" + Convert.ToString(li.First().ProductName).Trim() + "'")[0]["OfferDescription"]) : "") : "") : ""),
                                                                                                                  NetCurrency = li.First().NetCurrency,
                                                                                                                  SellCurrency = li.First().SellCurrency,
                                                                                                                  NetAdultPrice = li.Where(j => j.PassengerType != "child").Select(r => Convert.ToSingle(r.NetAdultPrice)).FirstOrDefault(),
                                                                                                                  NetChildPrice = li.Where(j => j.PassengerType == "child").Select(r => Convert.ToSingle(r.NetChildPrice)).FirstOrDefault(),
                                                                                                                  SellAdultPrice = Convert.ToSingle(Math.Ceiling(ConvertedAdultPrice)),
                                                                                                                  SellChildPrice = Convert.ToSingle(Math.Ceiling(ConvertedChildPrice)),
                                                                                                                  FamilyName = li.First().FamilyName,
                                                                                                                  FamilyId = li.First().FamilyId,
                                                                                                                  PassengerType = li.First().PassengerType,
                                                                                                                  DefaultPassengerType = li.First().DefaultPassengerType,
                                                                                                                  ChildFree = li.First().ChildFree,
                                                                                                                  ExchangeRate = li.First().ExchangeRate,
                                                                                                                  CountriesSelected = CountriesSelected,
                                                                                                                  AgeLimit = familypass.Where(o => o.PassengerType != "child").Select(o => o.AgeLimit).FirstOrDefault(),
                                                                                                                  ChildAgelbl = familypass.Where(o => o.PassengerType == "child").Select(o => o.AgeLimit).FirstOrDefault(),
                                                                                                              }).Where(ti => ti.Price != 9999).OrderBy(o => o.PassClass).ToList(),

                                                                                           }
                                                                               ).OrderBy(o => o.MinPrice).ToList(),

                                                                           }).OrderBy(r => r.Type).ToList(),
                                                      }).OrderBy(r => r.PassengerType).ToList(),
                                }).ToList();
                    }
                }
                catch { }
            }
            catch { }
        }

        return List;
    }

    [System.Web.Services.WebMethod(EnableSession = true)]
    public static string PopulateCountries(int FamilyId, string CountryId, string AllCountiesName)
    {
        DataTable dt = new DataTable();
        RailEuropeRea oOfferClass = new RailEuropeRea();
        dt = oOfferClass.GetPassCountries(FamilyId, CountryId, AllCountiesName);
        DataView dvSelectCountry = new DataView(dt);
        dvSelectCountry.RowFilter = "Country<>''";
        dvSelectCountry.Sort = "Country";
        dt = dvSelectCountry.ToTable(true, "Country");
        string JSONString = string.Empty;
        JSONString = JsonConvert.SerializeObject(dt);
        return JSONString;
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
                    //htmlInfo.Append("");
                }
                else if (HeadingType.ToUpper() == "IMAGE")
                {
                    for (int d = 0; d < dtData.Rows.Count; d++)
                    {
                        htmlInfo.Append("<img src='" + Convert.ToString(dtData.Rows[d]["ImagePath"]) + "' class='fullimg'>");
                    }
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
                if (i == 0)
                {
                    //aboutInfo.InnerHtml = htmlInfo.ToString();
                    htmlInfo = new StringBuilder();
                }

            }
        }
        return htmlInfo;
    }
}