using System;
using System.Collections.Generic;
using System.Data;
using System.Globalization;
using System.Linq;
using System.Text.RegularExpressions;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Threading;
using System.Text;
using AdminClasses;
using System.Web.UI.HtmlControls;

public partial class PassMtEx_ShoppingCart : System.Web.UI.Page
{
    public String countrycode = string.Empty;
    public String cntryCurrency = string.Empty;
    decimal totalsummary = 0;
    decimal totalDiscount = 0;
    string totalCurrency = string.Empty;
    public String TransId = string.Empty;
    DataSet dsSession = new DataSet();
    DataSet dsMt = new DataSet();
    LoginDetail oLoginDetail = new LoginDetail();

    DateTimeFormatInfo dateFormatInfo = new DateTimeFormatInfo();
    public DateTimeFormatInfo dateFormatInf = new DateTimeFormatInfo();
    protected void Page_Load(object sender, EventArgs e)
    {
        dateFormatInfo.ShortDatePattern = "MM/dd/yyyy";
        dateFormatInf.ShortDatePattern = "dd-MM-yyyy";
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

            if (!string.IsNullOrEmpty(oLoginDetail.UrlCountry))
            {
                var regexItem = new Regex("^[A-Z]*$");
                if (regexItem.IsMatch(Convert.ToString(oLoginDetail.UrlCountry)))
                {
                    countrycode = Convert.ToString(oLoginDetail.UrlCountry);
                    cntryCurrency = Convert.ToString(oLoginDetail.UrlCurrency);
                    //cntryCurrency = Convert.ToString(oLoginDetail.UrlCurrency) != Convert.ToString(oLoginDetail.OptCurrency) ? Convert.ToString(oLoginDetail.OptCurrency) : Convert.ToString(oLoginDetail.UrlCurrency);

                }
            }

            if (Request.QueryString["TransId"] != null && Request.QueryString["TransId"].ToString() != string.Empty)
            {
                Session["TransId"] = TransId = Convert.ToString(Request.QueryString["TransId"]);
            }
            if (!IsPostBack)
            {
                bindProductSummary();
                Get_MountainHomeData();
                Session["AmountPaid"] = "No";
                Session["UsePG"] = "Yes";
            }
        }
        catch (Exception ex)
        {
            Utilities.ErrDetail oErrDetail = new Utilities.ErrDetail();
            oErrDetail.ModuleName = "Page_Load" + "##" + Convert.ToString(System.Web.HttpContext.Current.Request.Url.AbsolutePath);
            oErrDetail.ErrDescription = Convert.ToString(ex.Message) + "###" + Convert.ToString(ex.StackTrace);
            oErrDetail.AgencyId = Convert.ToDouble(Session["AgencyId"]);
            oErrDetail.DeskId = Convert.ToDouble(Session["UserMasterId"]);
            oErrDetail.SearchRefId = Convert.ToString(Session["SearchRefID"]);
            oErrDetail.TransactionId = Convert.ToString(Session["TransactionID"]);
            oErrDetail.Insert_ErrDetail();
            Response.Redirect("../info/ErrorMessagepg.aspx?Error=" + Convert.ToString(ex.Message), false);
        }

    }

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

    protected void bindProductSummary()
    {
        try
        {
            DataTable dt = new DataTable();
            EurailClasses.Eurail oClsEurail = new EurailClasses.Eurail();
            oClsEurail.TransactionId = Session["TransId"].ToString();
            dt = oClsEurail.Get_Eurail_Tariff_ShoppingCart_Summary();
            totalsummary = 0;
            rptShoppingCart.Visible = false;
            Session["CartCnt"] = "";
            lblCartCnt.Text = "";
            lnkBtnClearAll.Visible = false;

            if (dt.Rows.Count > 0)
            {

                var vMtExIds = dt.AsEnumerable().Where(r => r.Field<String>("BType").ToUpper() == "MTEX").Select(s => s.Field<Int32>("MtExId")).Distinct().OrderBy(MtExId => MtExId).ToArray();
                string strMtExIds = string.Join(",", vMtExIds);
                //if (dt.Select("ExcursionName like '%swiss travel pass%'").Length > 0)
                //    strMtExIds += "," + dt.Select("ExcursionName like '%swiss travel pass%'")[0]["MtExId"];

                if (dt.Select("ExcursionName like '%swiss travel pass%' and disAmount>0").Length > 0)
                {
                    //only these ids
                    strMtExIds = "1,2," + Convert.ToString(dt.Select("ExcursionName like '%swiss travel pass%'")[0]["MtExId"]);
                    foreach (DataRow dr in dt.Select("MtExId in(" + strMtExIds + ")"))
                    {
                        dr["TourGrade"] = "Offer";
                    }
                }

                //if (Convert.ToInt32(dt.Compute("sum(DisAmount)", "")) >= 1100)
                //{
                //    divRemarks.Visible = true;
                //}
                string strButton = "";
                if (dt.DefaultView.ToTable(true, "CnvtCurrency").Rows.Count > 1) //stoping multi currency booking here            
                    strButton = "<strong class='red_txt'>Oops! You seem to have a change in currency and we cannot proceed any further. Please contact your nearest SWISStours office.</strong>";
                else
                {
                    strButton += "<div class=\"col-sm-4\"><a class=\"cta\" href=\"PassMtPaxEntry.aspx?TransId=" + TransId + "&cntry=" + countrycode + "\" style=\"max-width: 250px;border: 2px solid #c00;display: inline-block;padding: 13px 15px;\">Proceed to checkout</a></div>";
                    strButton += "<div class=\"col-sm-4\">&nbsp;</div><div class=\"col-sm-4\"><a class=\"redBtn\" href=\"/mountain-excursion\" style=\"max-width: 250px\"><strong>Add Mountain Excursions</strong></a></div>";

                }
                divContinue.InnerHtml = strButton;
                DataView dv = new DataView(dt);
                DataTable dtCart = new DataTable();
                dtCart = dv.ToTable(true, "MtExId", "ExcursionName");
                lblCartCnt.Text = Convert.ToString(dtCart.Rows.Count) + " items";
                Session["CartCnt"] = Convert.ToString(dtCart.Rows.Count) + " items";
                lnkBtnClearAll.Visible = true;
                rptShoppingCart.DataSource = dt;
                rptShoppingCart.DataBind();
                rptShoppingCart.Visible = true;
            }

        }
        catch (Exception ex)
        {
            Utilities.ErrDetail oErrDetail = new Utilities.ErrDetail();
            oErrDetail.ModuleName = "bindProductSummary" + "##" + Convert.ToString(System.Web.HttpContext.Current.Request.Url.AbsolutePath);
            oErrDetail.ErrDescription = Convert.ToString(ex.Message) + "###" + Convert.ToString(ex.StackTrace);
            oErrDetail.AgencyId = Convert.ToDouble(Session["AgencyId"]);
            oErrDetail.DeskId = Convert.ToDouble(Session["UserMasterId"]);
            oErrDetail.SearchRefId = Convert.ToString(Session["SearchRefID"]);
            oErrDetail.TransactionId = Convert.ToString(Session["TransactionID"]);
            oErrDetail.Insert_ErrDetail();
            Response.Redirect("../info/ErrorMessagepg.aspx?Error=" + Convert.ToString(ex.Message), false);
        }
    }

    protected void rptShoppingCart_ItemDataBound(object sender, RepeaterItemEventArgs e)
    {
        DataTable xxpolicydt = new DataTable();
        EurailClasses.Eurail oClsEurail = new EurailClasses.Eurail();
        oClsEurail.TransactionId = Session["TransId"].ToString();
        Label lblProductTotalPrice = null;
        Label lblbType = null;
        Label lblproductCode = null;
        Label lblTourGrade = null;
        Label lblCartId = null;
        Label xxpolicy = null;
        Label lblProductCurrency = null;
        Label lblTotalPrice = null;
        Label lblDiscount = null;
        Label lblPriceChange = null;
        try
        {
            if (e.Item.ItemType == ListItemType.Item || e.Item.ItemType == ListItemType.AlternatingItem)
            {
                lblCartId = e.Item.FindControl("lblCartId") as Label;
                lblbType = e.Item.FindControl("lblbType") as Label;
                lblproductCode = e.Item.FindControl("lblproductCode") as Label;
                lblTourGrade = e.Item.FindControl("lblTourGrade") as Label;
                lblProductTotalPrice = e.Item.FindControl("lblProductTotalPrice") as Label;
                lblProductCurrency = e.Item.FindControl("lblProductCurrency") as Label;

                lblProductTotalPrice = e.Item.FindControl("lblProductTotalPrice") as Label;
                lblProductCurrency = e.Item.FindControl("lblProductCurrency") as Label;
                totalCurrency = lblProductCurrency.Text;
                totalsummary = totalsummary + Convert.ToDecimal(lblProductTotalPrice.Text);
                totalDiscount += Convert.ToDecimal(((System.Data.DataRowView)e.Item.DataItem).Row["disamount"]);
                if (Convert.ToString(lblbType.Text) == "VIAT")
                {
                    oClsEurail.TourGradeCode = Convert.ToString(lblTourGrade.Text);
                    oClsEurail.CartId = Convert.ToInt32(lblCartId.Text);
                    oClsEurail.productCode = Convert.ToString(lblproductCode.Text);
                    xxpolicydt = oClsEurail.Get_Viator_XXpolicy_Details();

                    xxpolicy = e.Item.FindControl("xxpolicy") as Label;
                    if (Convert.ToString(xxpolicydt.Rows[0]["Name"]).Contains("Your Booking "))
                    {
                        string[] xxpolicylst = Convert.ToString(xxpolicydt.Rows[0]["Name"]).Split('.');
                        StringBuilder xxhtml = new StringBuilder();
                        xxhtml.Append("<ul class='gallery_list'>");
                        foreach (var xxxpolicy in xxpolicylst)
                        {
                            xxhtml.Append("<li>" + xxxpolicy + "</li>");
                        }
                        xxhtml.Append("</ul>");
                        xxpolicy.Text = "Cancellation Policy: " + "<b><span>" + xxhtml.ToString() + "</span></b>";
                    }
                    else
                    {
                        string[] xxpolicylst = Convert.ToString(xxpolicydt.Rows[0]["Name"]).Split('|');
                        StringBuilder xxhtml = new StringBuilder();
                        xxhtml.Append("<ul class='gallery_list'>");
                        foreach (var xxxpolicy in xxpolicylst)
                        {
                            xxhtml.Append("<li>" + xxxpolicy + "</li>");
                        }
                        xxhtml.Append("</ul>");
                        xxpolicy.Text = "Cancellation Policy: " + "<b><span>" + xxhtml.ToString() + "</span></b>";
                    }
                    if (Convert.ToBoolean(xxpolicydt.Rows[0]["IsPriceChanged"]) == true)
                    {
                        StringBuilder priceChnagedhtml = new StringBuilder();
                        priceChnagedhtml.Append("<ul class='gallery_list'>");
                        priceChnagedhtml.Append("<li>Your Product Price has been updated as per the new booking date selected.</li>");
                        priceChnagedhtml.Append("</ul>");
                        lblPriceChange = e.Item.FindControl("lblPriceChange") as Label;
                        lblPriceChange.Text = "Note: " + "<b><span>" + priceChnagedhtml.ToString() + "</span></b>";
                    }
                }
            }
            if (e.Item.ItemType == ListItemType.Footer)
            {
                if (totalDiscount > 0)
                {
                    HtmlGenericControl divDiscount = new HtmlGenericControl();
                    divDiscount = e.Item.FindControl("divDiscount") as HtmlGenericControl;
                    divDiscount.Visible = true;
                    lblDiscount = e.Item.FindControl("lblDiscount") as Label;
                    lblDiscount.Text = totalCurrency + " " + Convert.ToString(Convert.ToDouble(totalDiscount));
                }

                lblTotalPrice = e.Item.FindControl("lblTotalPrice") as Label;
                lblTotalPrice.Text = totalCurrency + " " + Convert.ToString(Convert.ToDouble(totalsummary - totalDiscount));
            }
        }
        catch (Exception ex)
        {
            Utilities.ErrDetail oErrDetail = new Utilities.ErrDetail();
            oErrDetail.ModuleName = "rptShoppingCart_ItemDataBound" + "##" + Convert.ToString(System.Web.HttpContext.Current.Request.Url.AbsolutePath);
            oErrDetail.ErrDescription = Convert.ToString(ex.Message) + "###" + Convert.ToString(ex.StackTrace);
            oErrDetail.AgencyId = Convert.ToDouble(Session["AgencyId"]);
            oErrDetail.DeskId = Convert.ToDouble(Session["UserMasterId"]);
            oErrDetail.SearchRefId = Convert.ToString(Session["SearchRefID"]);
            oErrDetail.TransactionId = Convert.ToString(Session["TransactionID"]);
            oErrDetail.Insert_ErrDetail();
            Response.Redirect("../info/ErrorMessagepg.aspx?Error=" + Convert.ToString(ex.Message), false);
        }
    }

    protected void Delete_Shopping_Items(object sender, CommandEventArgs e)
    {
        string strArgs = Convert.ToString(e.CommandArgument)==""? Convert.ToString(hdnLnkBtnValue.Value) : Convert.ToString(e.CommandArgument);
        try
        {
            string strCartId = string.Empty, strBType = string.Empty;
            if (strArgs != string.Empty)
            {
                strCartId = strArgs.Split('~')[0];
                strBType = strArgs.Split('~')[1];
            }

            EurailClasses.Eurail oClsEurail = new EurailClasses.Eurail();
            for (int i = 0; i < strCartId.Split('|').Length; i++)
            {
                oClsEurail.CartId = Convert.ToInt32(strCartId.Split('|')[i]);
                oClsEurail.BType = strBType;
                oClsEurail.DeleteRecord_Eurail_MtEx_Tariff_ShoppingCart();
                oClsEurail.Delete_Viator_PaxAGeBand(); //add by payal for viator 
            }
            Response.Redirect("/PassMtEx/ShoppingCart.aspx?TransId=" + TransId + "&cntry=" + countrycode, true);
        }
        catch (ThreadAbortException ex1)
        {
            //Request.UrlReferrer = null;
        }
        catch (Exception ex)
        {
            Utilities.ErrDetail oErrDetail = new Utilities.ErrDetail();
            oErrDetail.ModuleName = "Delete_Shopping_Items" + "##" + Convert.ToString(System.Web.HttpContext.Current.Request.Url.AbsolutePath);
            oErrDetail.ErrDescription = Convert.ToString(ex.Message) + "###" + Convert.ToString(ex.StackTrace);
            oErrDetail.AgencyId = Convert.ToDouble(Session["AgencyId"]);
            oErrDetail.DeskId = Convert.ToDouble(Session["UserMasterId"]);
            oErrDetail.SearchRefId = Convert.ToString(Session["SearchRefID"]);
            oErrDetail.TransactionId = Convert.ToString(Session["TransactionID"]);
            oErrDetail.Insert_ErrDetail();
            Response.Redirect("../info/ErrorMessagepg.aspx?Error=" + Convert.ToString(ex.Message), false);
        }
    }

    protected void lnkBtnClearAll_Click(object sender, EventArgs e)
    {
        try
        {
            Session["TransId"] = "";
            Session["CartCnt"] = "";
            TransId = "";
            Response.Redirect("/PassMtEx/ShoppingCart.aspx?TransId=" + TransId + "&cntry=" + countrycode, true);
        }
        catch (ThreadAbortException ex1) { }
        catch (Exception ex) { }
    }
}