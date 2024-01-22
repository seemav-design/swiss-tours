using AdminClasses;
using RailEuropeClasses;
using System;
using System.Data;
using System.Text.RegularExpressions;
using System.Web.UI.WebControls;
using System.Globalization;
using SightSeeingClasses;
using System.Xml;

public partial class PassMtEx_PassMtPaxEntry : System.Web.UI.Page
{
    public String countrycode = string.Empty;
    public String cntryCurrency = string.Empty;
    public String transId = string.Empty;
    DateTimeFormatInfo info = DateTimeFormatInfo.GetInstance(null);
    DateTimeFormatInfo dateFormatInfo = new DateTimeFormatInfo();
    DateTimeFormatInfo dateFormatInf = new DateTimeFormatInfo();
    LoginDetail oLoginDetail = new LoginDetail();
    RailEuropeRea oRailEurope = new RailEuropeRea();
    SightSeeingClasses.SightSeeingxml osightseeing = new SightSeeingClasses.SightSeeingxml();
    protected void Page_Load(object sender, EventArgs e)
    {
        //////////login detail extracting here for through out on page use
        oLoginDetail = (LoginDetail)Session["LoginDetailList"];
        dateFormatInf.ShortDatePattern = "dd-MM-yyyy";
        if (Request.QueryString["cntry"] != null && Request.QueryString["cntry"].ToString() != string.Empty)
        {
            var regexItem = new Regex("^[A-Z]*$");
            if (regexItem.IsMatch(Convert.ToString(Request.QueryString["cntry"])))
            {
                countrycode = Request.QueryString["cntry"].ToString();
            }
            else
            {
                throw new Exception("cntry is Not Valid");
            }
        }
        else
        {
            throw new Exception("cntry is Not Valid");
        }

        if (Request.QueryString["TransId"] != null && Request.QueryString["TransId"].ToString() != string.Empty)
            transId = Convert.ToString(Request.QueryString["TransId"]);


        if (!IsPostBack)
        {
            DataTable dtData = new DataTable();
            EurailClasses.Eurail oClsEurail = new EurailClasses.Eurail();
            oClsEurail.TransactionId = Convert.ToString(transId);
            dtData = oClsEurail.Get_Eurail_Tariff_ShoppingCart_For_Pax_Entry();

            DataTable dtSummary = new DataTable();
            dtSummary = oClsEurail.Get_Eurail_Tariff_ShoppingCart_Summary();
            DataTable dt = new DataTable();
            dt = dtSummary.DefaultView.ToTable(true, "Btype");
            if (dt.Rows.Count > 0)
            {
                for (int i = 0; i < dt.Rows.Count; i++)
                {
                    string Btype = Convert.ToString(dt.Rows[i]["BType"]).ToUpper();
                    switch (Btype)
                    {
                        case "PTP":
                            divPTP.Visible = true;
                            divRail.Visible = true;
                            divCxn.Visible = true;
                            break;
                        case "PASS":
                            divRail.Visible = true;
                            divCxn.Visible = true;
                            divPass.Visible = true;
                            break;
                        case "MTEX":
                            divMtexVIA.Visible = true;
                            divCxn.Visible = true;
                            break;
                        case "PKG":
                            divPKG.Visible = true;
                            divCxn.Visible = true;
                            break;
                        case "VIA":
                            divMtexVIA.Visible = true;
                            divCxn.Visible = true;
                            break;

                    }
                }

            }

            LoginSession oLoginSession = new LoginSession();
            DataTable dtCountry = new DataTable();
            dtCountry = oLoginSession.Get_Country_Master();
            if (dtCountry.Rows.Count > 0)
            {
                bindGridView(dtData, dtSummary, dtCountry);
                Get_Country_Master(dtCountry);
                GetBranchMaster(dtSummary);
                FillContent();
            }
        }
    }
    public void Get_Country_Master(DataTable dtCountry)
    {

        if (dtCountry.Rows.Count > 0)
        {
            txtCountry.DataSource = dtCountry;
            txtCountry.DataTextField = "CountryName";
            txtCountry.DataValueField = "CountryName";
            txtCountry.DataBind();
            txtCountry.Items.Insert(0, new ListItem("Country", ""));
            txtCountry.Value = oLoginDetail.UrlCountryName;
        }
    }
    public void GetBranchMaster(DataTable dtSummary)
    {
        RailEuropeRea RailPass = new RailEuropeRea();
        DataTable dt = new DataTable();
        dt = RailPass.Get_Nearest_Branch_Master(countrycode);
        ddlBranch.DataSource = dt;
        ddlBranch.DataBind();

        DataRow[] drBranchRows = null;
        //drBranchRows = dtSummary.Select("[OtherDetails] is not null");
        drBranchRows = dtSummary.Select("OtherDetails <>''");
        int BranchId = 0;
        if (drBranchRows.Length > 0)
        {
            BranchId = Convert.ToInt32(drBranchRows[0]["RespBranchId"]);
        }

        if (countrycode != "IN")
        {
            divBranch.Style.Add("display", "none");
            ddlBranch.SelectedValue = Convert.ToString(dt.Rows[0]["REAKey"]);
        }
        else
        {
            if (BranchId == 0)
            {
                ddlBranch.Items.Insert(0, new ListItem("Select Nearest Branch", "0"));
            }
            else
            {
                DataRow[] drNameRows = null;
                drNameRows = dt.Select("BranchID=" + BranchId);
                ddlBranch.SelectedValue = Convert.ToString(drNameRows[0]["REAKey"]);
                divddlBranch.Style.Add("display", "none");
                //ddlBranch.Attributes.Add("disabled", "disabled");
            }
        }
    }

    protected void bindGridView(DataTable dt, DataTable dtSummary, DataTable dtCountry)
    {
        try
        {
            Session["TotalAmount"] = "0";
            Double totalsummary = 0;
            Double totalDiscount = 0;
            Double totalSTax = 0;
            string strCurrency = "";
            if (dt.Rows.Count > 0)
            {
                String strHTML = "";
                if (dtSummary.Rows.Count > 0)
                {
                    for (int h = 0; h < dtSummary.Rows.Count; h++)
                    {
                        strHTML += " <div class='col-xs-12 product_section lightgray_texture fade_anim'>";
                        strHTML += " <div class='row ps_details'>";
                        strHTML += " <div class='col-xs-12 col-sm-9 prod_detail'>";
                        strHTML += " <p class='prod_name'><strong class='red_txt'>" + Convert.ToString(dtSummary.Rows[h]["ExcursionName"]) + "</strong> </p>";
                        strHTML += " <p><span>Travel Date </span>: <strong>" + Convert.ToDateTime(dtSummary.Rows[h]["TravelDate"]).ToString("MMM dd, yyyy") + "</strong></p>";
                        if (Convert.ToString(dtSummary.Rows[h]["TotalTraveller"]) != "")
                            strHTML += "<p><span>No. of Travellers </span>: <strong>" + Convert.ToString(dtSummary.Rows[h]["TotalTraveller"]) + "</strong></p>";
                        if (Convert.ToString(dtSummary.Rows[h]["TariffName"]) != "")
                            strHTML += "<p><span>" + (Convert.ToString(dtSummary.Rows[h]["BType"]) == "PTP" ? "Train Name" : "Tour Type") + " </span>: <strong>" + Convert.ToString(dtSummary.Rows[h]["TariffName"]) + "</strong></p>";
                        if (Convert.ToString(dtSummary.Rows[h]["BType"]) == "PTP")
                        {
                            strHTML += " <p><span>Departure </span>: <strong>" + Convert.ToDateTime(dtSummary.Rows[h]["DepartureDate"], dateFormatInf).ToString("MMM dd, yyyy") + " | " + Convert.ToString(dtSummary.Rows[h]["DepartureTime"]) + "</strong></p>";
                            strHTML += " <p><span>Arrival </span>: <strong>" + Convert.ToDateTime(dtSummary.Rows[h]["DepartureDate"], dateFormatInf).ToString("MMM dd, yyyy") + " | " + Convert.ToString(dtSummary.Rows[h]["ArrivalTime"]) + "</strong></p>";
                            //strHTML += " <p><span>Ticket Delivery </span>: <strong>" + Convert.ToString(dtSummary.Rows[h]["TicketOption"]) + "</strong></p>";
                        }
                        if (!string.IsNullOrEmpty(Convert.ToString(dtSummary.Rows[h]["TicketOption"])))
                        {
                            strHTML += " <p><span>Ticket Delivery </span>: <strong>" + Convert.ToString(dtSummary.Rows[h]["TicketOption"]) + "</strong></p>";
                        }
                        strHTML += " </div>";
                        strHTML += " <div class='col-xs-12 col-sm-3 sc_price red_txt'>";
                        strHTML += Convert.ToString(dtSummary.Rows[h]["CnvtCurrency"]) + " " + Convert.ToString(Convert.ToInt32(dtSummary.Rows[h]["CnvtTariffRate"]));
                        totalsummary += Convert.ToDouble(dtSummary.Rows[h]["CnvtTariffRate"]);
                        totalDiscount += Convert.ToDouble(dtSummary.Rows[h]["disamount"]);
                        strCurrency = Convert.ToString(dtSummary.Rows[h]["CnvtCurrency"]);
                        strHTML += " </div>";
                        strHTML += " </div>";
                        DataRow[] drNameRows = null;
                        string excursionname = string.Empty;
                        if (Convert.ToString(dtSummary.Rows[h]["ExcursionName"]).Contains("'"))
                        {
                            excursionname = Convert.ToString(dtSummary.Rows[h]["ExcursionName"]).Replace("'", "");
                            for (int i = 0; i <= dt.Rows.Count - 1; i++)
                            {
                                dt.Rows[i][4] = dt.Rows[i][4].ToString().Replace("'", "");
                            }
                        }
                        else
                        {
                            excursionname = Convert.ToString(dtSummary.Rows[h]["ExcursionName"]);
                        }
                        //if (dt.Select("MtExId=" + Convert.ToString(dtSummary.Rows[h]["MtExId"]) + " and ExcursionName='" + Convert.ToString(dtSummary.Rows[h]["ExcursionName"]) + "'").Length > 0)
                        if (dt.Select("MtExId=" + Convert.ToString(dtSummary.Rows[h]["MtExId"]) + " and ExcursionName='" + excursionname + "'").Length > 0)
                        {
                            drNameRows = dt.Select("MtExId=" + Convert.ToString(dtSummary.Rows[h]["MtExId"]) + " and ExcursionName='" + excursionname + "'");
                            if (Convert.ToString(dtSummary.Rows[h]["BType"]) == "MTEX")// this specially changed for BType=MTEX only-Rajani
                                drNameRows = dt.Select("CartId in(" + Convert.ToString(dtSummary.Rows[h]["Position"]).Replace("|", ",") + ")");

                            if (drNameRows.Length > 0)
                            {
                                for (int r = 0; r < drNameRows.Length; r++)
                                {
                                    string ids = "_" + Convert.ToString(h) + "_" + Convert.ToString(r);

                                    String strOnBlur = "";
                                    Boolean IsAllProductRowsEqual = false;
                                    IsAllProductRowsEqual = (dtSummary.Rows.Count * drNameRows.Length) == dt.Rows.Count ? true : false;
                                    if (h == 0 && IsAllProductRowsEqual == true)
                                    {
                                        hdnNoRowPerProduct.Value = Convert.ToString(drNameRows.Length);
                                        hdnTotalProduct.Value = Convert.ToString(dtSummary.Rows.Count);
                                        strOnBlur = "onchange='javascript:return repeatOnBlur(this);'";
                                    }
                                    string strEnabled = "";
                                    strEnabled = (Convert.ToString(drNameRows[r]["BookingRefNo"]) == "" ? "true" : "false");
                                    strHTML += " <div class='row ps_form'>";
                                    strHTML += " <div class='col-xs-12' style='margin-bottom:3px;'><strong>" + Convert.ToString(drNameRows[r]["PaxType"]) + " " + Convert.ToString(r + 1) + "</strong></div>";
                                    strHTML += " <input type='text' class='none' ID='txtId" + ids + "' runat='Server' value='" + Convert.ToString(drNameRows[r]["CartId"]) + "'>";
                                    strHTML += " <div class='col-md-1 col-sm-4 form-group'>";
                                    strHTML += " <label>Title</label>";
                                    strHTML += " <select class='form-control selectpicker' title='Select' ID='txtTitlegvw" + ids + "' runat='Server' Enabled='" + strEnabled + "' " + strOnBlur + ">";
                                    strHTML += " <option Value='0'>Select</option>";
                                    strHTML += " <option Value='1' " + (Convert.ToString(drNameRows[r]["Title"]) == "Mr" ? "selected='true'" : "") + ">Mr</option>";
                                    strHTML += " <option Value='2' " + (Convert.ToString(drNameRows[r]["Title"]) == "Ms" ? "selected='true'" : "") + ">Ms</option>";
                                    strHTML += " </select>";
                                    strHTML += " </div>";

                                    strHTML += " <div class='col-md-3 col-sm-4 form-group'>";
                                    strHTML += " <label>First Name</label>";
                                    strHTML += " <input type='text' class='form-control' ID='txtFNameGvw" + ids + "' runat='Server' Enabled='" + strEnabled + "' " + strOnBlur + " value='" + Convert.ToString(drNameRows[r]["FName"]) + "' onkeypress='javascript:return AllowAlphannSpace();' ondrop='return false;' maxlength='15'>";
                                    strHTML += " </div>";

                                    strHTML += " <div class='col-md-3 col-sm-4 form-group'>";
                                    strHTML += " <label>Last Name</label>";
                                    strHTML += " <input type='text' class='form-control' ID='txtLNameGvw" + ids + "' runat='Server' Enabled='" + strEnabled + "' " + strOnBlur + " value='" + Convert.ToString(drNameRows[r]["LName"]) + "' onkeypress='javascript:return AllowAlphannSpace();' ondrop='return false;' maxlength='15'>";
                                    strHTML += " </div>";

                                    strHTML += " <div class='col-md-2 col-sm-4 form-group'>";
                                    strHTML += " <input type='text' class='none' ID='txtBType" + ids + "' runat='Server' value='" + Convert.ToString(drNameRows[r]["BType"]) + "'>";
                                    strHTML += " <label>Residence Country</label>";
                                    strHTML += " <select class='form-control' id='txtCountryOfResidence" + ids + "' " + strOnBlur + ">";
                                    strHTML += " <option value=''>Select</option>";
                                    for (int d = 0; d < dtCountry.Rows.Count; d++)
                                    {
                                        string strSelected = "";
                                        if (Convert.ToString(drNameRows[r]["ResidenceCountry"]).Replace("---", "").ToUpper() == Convert.ToString(dtCountry.Rows[d]["CountryName"]).ToUpper())
                                            strSelected = "selected='selected'";
                                        else if (Convert.ToString(oLoginDetail.UrlCountry).ToUpper() == Convert.ToString(dtCountry.Rows[d]["CountryCode"]).ToUpper())
                                            strSelected = "selected='selected'";
                                        strHTML += " <option " + strSelected + " value='" + Convert.ToString(dtCountry.Rows[d]["CountryName"]) + "'>" + Convert.ToString(dtCountry.Rows[d]["CountryName"]) + "</option>";
                                    }
                                    strHTML += " </select>";
                                    //strHTML += " <input type='text' name='CountryOfResidence' class='form-control' ID='txtCountryOfResidence" + ids + "' runat='Server' Enabled='" + strEnabled + "' " + strOnBlur + " value='" + Convert.ToString(drNameRows[r]["ResidenceCountry"]).Replace("---", "") + "' onkeypress='javascript:return AllowAlphannSpace();' ondrop='return false;' autocomplete='off'>";
                                    strHTML += " <input type='hidden' ID='hdnCountryOfResidence" + ids + "' runat='Server'>";
                                    strHTML += " </div>";

                                    string strAgeLimit = Convert.ToString(drNameRows[r]["AgeLimit"]);//==""? Convert.ToString(drNameRows[r]["TariffName"]): Convert.ToString(drNameRows[r]["AgeLimit"]);

                                    //Specially for Viator having keep currenct code
                                    if (strAgeLimit == "" && Convert.ToString(drNameRows[r]["BType"]) == "VIAT")
                                    {
                                        switch (Convert.ToString(drNameRows[r]["PaxType"]))
                                        {
                                            case "Adult":
                                                strAgeLimit = "16-80";
                                                break;
                                            case "Child":
                                                strAgeLimit = "4-12";
                                                break;
                                            case "Youth":
                                                strAgeLimit = "4-26";
                                                break;
                                            case "Senior":
                                                strAgeLimit = "59-105";
                                                break;
                                        }

                                    }

                                    if (strAgeLimit.Split('-').Length > 1)
                                    {
                                        if (Convert.ToInt32(strAgeLimit.Split('-')[0]) == Convert.ToInt32(strAgeLimit.Split('-')[1]))
                                            strAgeLimit = " only " + Convert.ToString(strAgeLimit.Split('-')[0]) + " years";
                                        else
                                            strAgeLimit = " between " + strAgeLimit.Replace("-", " to ") + " years";

                                    }
                                    strHTML += " <div class='col-md-3 col-sm-4 form-group'>";
                                    strHTML += " <label>Date of Birth" + strAgeLimit + "</label>";
                                    strHTML += " <input type='text' class='form-control' ID='txtDOB" + ids + "' runat='Server' placeholder='DD-MM-YYYY' title='DD-MM-YYYY' Enabled='" + strEnabled + "' " + strOnBlur + " onkeypress='javascript: return AllowDOB(this);'  ondrop='return false;' maxlength='10'>";
                                    strHTML += " <input type='hidden' ID='hdnDOB" + ids + "' value='" + Convert.ToString(drNameRows[r]["AgeLimit"]) + "#" + Convert.ToDateTime(dtSummary.Rows[h]["TravelDate"]).ToString("dd~MM~yyyy") + "' >";
                                    //strHTML += " <div class='input-group dob_box'>";
                                    //strHTML += " <select class='form-control selectpicker' title='DD' ID='ddlDD" + ids + "' runat='Server' Enabled='" + strEnabled + "' " + strOnBlur + ">";
                                    //strHTML += Fill_Day_Month_Content("DD", Convert.ToString(drNameRows[r]["DD"]));
                                    //strHTML += " </select>";
                                    //strHTML += " <select class='form-control selectpicker' title='MM' ID='ddlMM" + ids + "' runat='Server' Enabled='" + strEnabled + "' " + strOnBlur + ">";
                                    //strHTML += Fill_Day_Month_Content("MM", Convert.ToString(drNameRows[r]["MM"]));
                                    //strHTML += " </select>";
                                    //strHTML += " <select class='form-control selectpicker' title='YYYY' ID='ddlYYYY" + ids + "' runat='Server' Enabled='" + strEnabled + "' " + strOnBlur + ">";
                                    //strHTML += Fill_Year_Content(Convert.ToString(drNameRows[r]["AgeLimit"]), Convert.ToString(drNameRows[r]["PaxType"]), Convert.ToString(drNameRows[r]["BType"]), Convert.ToString(drNameRows[r]["VisitCountry"]), Convert.ToString(drNameRows[r]["TariffName"]), Convert.ToString(drNameRows[r]["YYYY"]));
                                    //strHTML += " </select>";
                                    //strHTML += " </div>";
                                    strHTML += " </div>";

                                    if (Convert.ToString(dtSummary.Rows[h]["BType"]) == "PTP" && Convert.ToString(dtSummary.Rows[h]["otherdetails"]).Contains("PASSPORT"))
                                    {
                                        strHTML += " <div class='col-md-3 col-sm-4 form-group'>";
                                        strHTML += " <label>Passport No.</label>";
                                        strHTML += " <input type='text' class='form-control' ID='txtPassNo" + ids + "' runat='Server' Enabled='" + strEnabled + "' " + strOnBlur + " value='" + Convert.ToString(drNameRows[r]["PassportNumber"]) + "' ondrop='return false;'>";
                                        strHTML += " </div>";

                                        strHTML += " <div class='col-md-3 col-sm-4 form-group'>";
                                        strHTML += " <label>Passport Expiration Date</label>";
                                        strHTML += " <div class='input-group dob_box'>";
                                        strHTML += " <select class='form-control selectpicker' title='DD' ID='ddlPassportDD" + ids + "' runat='Server' Enabled='" + strEnabled + "' " + strOnBlur + ">";
                                        strHTML += Fill_Day_Month_Content("DD", Convert.ToString(drNameRows[r]["PassportExpiryDD"]));
                                        strHTML += " </select>";
                                        strHTML += " <select class='form-control selectpicker' title='MM' ID='ddlPassportMM" + ids + "' runat='Server' Enabled='" + strEnabled + "' " + strOnBlur + ">";
                                        strHTML += Fill_Day_Month_Content("MM", Convert.ToString(drNameRows[r]["PassportExpiryMM"]));
                                        strHTML += " </select>";
                                        strHTML += " <select class='form-control selectpicker' title='YYYY' ID='ddlPassportYYYY" + ids + "' runat='Server' Enabled='" + strEnabled + "' " + strOnBlur + ">";
                                        strHTML += Fill_Year_Content("", "Passport", Convert.ToString(drNameRows[r]["BType"]), "", "", Convert.ToString(drNameRows[r]["PassportExpiryYYYY"]));
                                        strHTML += " </select>";
                                        strHTML += " </div>";
                                        strHTML += " </div>";
                                    }
                                    strHTML += " </div>";
                                }
                            }
                        }
                        strHTML += " </div>";
                    }
                }
                if (totalDiscount > 0)
                {
                    totalsummary -= totalDiscount;
                    strHTML += " <div class='clearfix'></div>";
                    strHTML += " <div class='col-xs-12 gray_texture1 cart_total1 text-right'>";
                    strHTML += " Discount : <strong class='red_txt'>" + strCurrency + " " + Convert.ToString(Convert.ToDecimal(totalDiscount)) + "</strong>";
                    strHTML += " </div>";

                    strHTML += " <div class='clearfix'></div>";
                    strHTML += " <div class='col-xs-12 gray_texture1 cart_total1 text-right'>";
                    strHTML += " Total : <strong class='red_txt'>" + strCurrency + " " + Convert.ToString(Convert.ToDecimal(totalsummary)) + "</strong>";
                    strHTML += " </div>";
                }

                if (strCurrency == "INR")
                {
                    if (Convert.ToDouble(dtSummary.Compute("Max(ServiceTax)", "")) > 0)
                    {
                        totalSTax = Math.Round((totalsummary * Convert.ToDouble(dtSummary.Compute("Max(ServiceTax)", "")) / 100), 0);
                        totalsummary += totalSTax;
                        strHTML += " <div class='clearfix'></div>";
                        strHTML += " <div class='col-xs-12 gray_texture1 cart_total1 text-right'>";
                        strHTML += " TCS Tax <i class='fa fa-info-circle red_txt' style='cursor: pointer; font-size: 16px; margin-left: 5px;' data-toggle='tooltip' data-html='true' data-placement='auto' title='' data-original-title='The TCS amount will be credited to the given PAN number.'></i> : <strong class='red_txt'>" + strCurrency + " " + Convert.ToString(totalSTax) + "</strong>";
                        strHTML += " </div>";
                    }
                }
                strHTML += " <div class='clearfix'></div>";
                strHTML += " <div class='col-xs-12 gray_texture cart_total text-right'>";
                strHTML += " Grand Total : <strong class='red_txt'>" + strCurrency + " " + Convert.ToString(totalsummary) + "</strong>";
                strHTML += " </div>";
                DivForm.InnerHtml = strHTML;
            }
        }
        catch (Exception ex)
        {

        }
    }
    public string Fill_Year_Content(String strAgeLimit, String strPaxType, String strBType, String strVisitCountry, String strTariffName, String ControlVal)
    {
        String strHtml = "";
        strHtml += " <option Value='0'>YYYY</option>";
        int AdultYrs = (DateTime.Now.Year);
        int ChildYrs = (DateTime.Now.Year);
        int Yrs = 0, YrsEnd = 0;
        String strDescription = "";

        if (!string.IsNullOrEmpty(strAgeLimit))
        {
            strHtml = "";
            string[] AgeLimit = strAgeLimit.Split("-".ToCharArray());
            Yrs = Convert.ToInt32(AgeLimit[0]); YrsEnd = Convert.ToInt32(AgeLimit[1]);
            for (; Yrs <= YrsEnd; Yrs++)
                strHtml += " <option Value='" + Convert.ToString(AdultYrs - Yrs) + "' " + (Convert.ToString(AdultYrs - Yrs) == ControlVal ? "selected='true'" : "") + ">" + Convert.ToString(AdultYrs - Yrs) + "</option>";
        }
        else
        {
            if (strPaxType == "Adult" && strBType != "PTP")
            {
                strHtml = "";
                Yrs = 16; YrsEnd = 80;
                for (; Yrs <= YrsEnd; Yrs++)
                    strHtml += " <option Value='" + Convert.ToString(AdultYrs - Yrs) + "' " + (Convert.ToString(AdultYrs - Yrs) == ControlVal ? "selected='true'" : "") + ">" + Convert.ToString(AdultYrs - Yrs) + "</option>";
            }
            else if (strPaxType == "Adult" && strBType == "PTP")
            {
                strHtml = "";
                Yrs = 26; YrsEnd = 59;
                for (; Yrs <= YrsEnd; Yrs++)
                    strHtml += " <option Value='" + Convert.ToString(AdultYrs - Yrs) + "' " + (Convert.ToString(AdultYrs - Yrs) == ControlVal ? "selected='true'" : "") + ">" + Convert.ToString(AdultYrs - Yrs) + "</option>";
            }
            else if (strPaxType == "Youth")
            {
                strHtml = "";
                Yrs = 4; YrsEnd = 26;
                for (; Yrs <= YrsEnd; Yrs++)
                    strHtml += " <option Value='" + Convert.ToString(AdultYrs - Yrs) + "' " + (Convert.ToString(AdultYrs - Yrs) == ControlVal ? "selected='true'" : "") + ">" + Convert.ToString(AdultYrs - Yrs) + "</option>";
            }
            else if (strPaxType == "Senior")
            {
                strHtml = "";
                Yrs = 59; YrsEnd = 105;
                for (; Yrs <= YrsEnd; Yrs++)
                    strHtml += " <option Value='" + Convert.ToString(AdultYrs - Yrs) + "' " + (Convert.ToString(AdultYrs - Yrs) == ControlVal ? "selected='true'" : "") + ">" + Convert.ToString(AdultYrs - Yrs) + "</option>";
            }
            else if (strPaxType == "Child" && strBType == "PTP")
            {
                strHtml = "";
                Yrs = 4; YrsEnd = 11;
                for (; Yrs <= YrsEnd; Yrs++)
                    strHtml += " <option Value='" + Convert.ToString(ChildYrs - Yrs) + "' " + (Convert.ToString(ChildYrs - Yrs) == ControlVal ? "selected='true'" : "") + ">" + Convert.ToString(ChildYrs - Yrs) + "</option>";
            }
            else if (strPaxType.ToUpper() == "INFANT") //specially for viator
            {
                strHtml = "";
                Yrs = 0; YrsEnd = 3;
                for (; Yrs <= YrsEnd; Yrs++)
                    strHtml += " <option Value='" + Convert.ToString(ChildYrs - Yrs) + "' " + (Convert.ToString(ChildYrs - Yrs) == ControlVal ? "selected='true'" : "") + ">" + Convert.ToString(ChildYrs - Yrs) + "</option>";
            }
            else if (strPaxType == "Child" && strBType != "PTP")
            {
                strDescription = strTariffName.IndexOf('<') > 0 ? strTariffName.Remove(strTariffName.IndexOf('<')) : strTariffName;
                if (strVisitCountry == "1C" && (strDescription == "3 days within 1 month" || strDescription == "4 days within 1 month" || strDescription == "5 days within 1 month"))
                {
                    strHtml = "";
                    Yrs = 1; YrsEnd = 15;
                    for (; Yrs <= YrsEnd; Yrs++)
                        strHtml += " <option Value='" + Convert.ToString(ChildYrs - Yrs) + "' " + (Convert.ToString(ChildYrs - Yrs) == ControlVal ? "selected='true'" : "") + ">" + Convert.ToString(ChildYrs - Yrs) + "</option>";
                }
                else if (strVisitCountry == "21C")
                {
                    strHtml = "";
                    Yrs = 0; YrsEnd = 16;
                    for (; Yrs <= YrsEnd; Yrs++)
                        strHtml += " <option Value='" + Convert.ToString(ChildYrs - Yrs) + "' " + (Convert.ToString(ChildYrs - Yrs) == ControlVal ? "selected='true'" : "") + ">" + Convert.ToString(ChildYrs - Yrs) + "</option>";
                }
                else if (strTariffName.Contains("below 06"))
                {
                    strHtml = "";
                    Yrs = 0; YrsEnd = 6;
                    for (; Yrs <= YrsEnd; Yrs++)
                        strHtml += " <option Value='" + Convert.ToString(ChildYrs - Yrs) + "' " + (Convert.ToString(ChildYrs - Yrs) == ControlVal ? "selected='true'" : "") + ">" + Convert.ToString(ChildYrs - Yrs) + "</option>";
                }
                else if (strTariffName.Contains("06-16"))
                {
                    strHtml = "";
                    Yrs = 6; YrsEnd = 16;
                    for (; Yrs <= YrsEnd; Yrs++)
                        strHtml += " <option Value='" + Convert.ToString(ChildYrs - Yrs) + "' " + (Convert.ToString(ChildYrs - Yrs) == ControlVal ? "selected='true'" : "") + ">" + Convert.ToString(ChildYrs - Yrs) + "</option>";
                }
                else if (strTariffName.Contains("0-16"))
                {
                    strHtml = "";
                    Yrs = 0; YrsEnd = 16;
                    for (; Yrs <= YrsEnd; Yrs++)
                        strHtml += " <option Value='" + Convert.ToString(ChildYrs - Yrs) + "' " + (Convert.ToString(ChildYrs - Yrs) == ControlVal ? "selected='true'" : "") + ">" + Convert.ToString(ChildYrs - Yrs) + "</option>";
                }
                else if (strTariffName.Contains("0-15"))
                {
                    strHtml = "";
                    Yrs = 0; YrsEnd = 15;
                    for (; Yrs <= YrsEnd; Yrs++)
                        strHtml += " <option Value='" + Convert.ToString(ChildYrs - Yrs) + "' " + (Convert.ToString(ChildYrs - Yrs) == ControlVal ? "selected='true'" : "") + ">" + Convert.ToString(ChildYrs - Yrs) + "</option>";
                }
                else if (strTariffName.IndexOf("1998 to 2004") > 0)
                {
                    strHtml = "";
                    Yrs = 10; YrsEnd = 16;
                    for (; Yrs <= YrsEnd; Yrs++)
                        strHtml += " <option Value='" + Convert.ToString(ChildYrs - Yrs) + "' " + (Convert.ToString(ChildYrs - Yrs) == ControlVal ? "selected='true'" : "") + ">" + Convert.ToString(ChildYrs - Yrs) + "</option>";
                }
                else if (strTariffName.Contains("2006 or later"))
                {
                    strHtml = "";
                    Yrs = 0; YrsEnd = 9;
                    for (; Yrs <= YrsEnd; Yrs++)
                        strHtml += " <option Value='" + Convert.ToString(ChildYrs - Yrs) + "' " + (Convert.ToString(ChildYrs - Yrs) == ControlVal ? "selected='true'" : "") + ">" + Convert.ToString(ChildYrs - Yrs) + "</option>";
                }
                else if (strTariffName.IndexOf("10-15") > 0)
                {
                    strHtml = "";
                    Yrs = 10; YrsEnd = 15;
                    for (; Yrs <= YrsEnd; Yrs++)
                        strHtml += " <option Value='" + Convert.ToString(ChildYrs - Yrs) + "' " + (Convert.ToString(ChildYrs - Yrs) == ControlVal ? "selected='true'" : "") + ">" + Convert.ToString(ChildYrs - Yrs) + "</option>";
                }
                else if (strTariffName.IndexOf("0-9") > 0)
                {
                    strHtml = "";
                    Yrs = 0; YrsEnd = 9;
                    for (; Yrs <= YrsEnd; Yrs++)
                        strHtml += " <option Value='" + Convert.ToString(ChildYrs - Yrs) + "' " + (Convert.ToString(ChildYrs - Yrs) == ControlVal ? "selected='true'" : "") + ">" + Convert.ToString(ChildYrs - Yrs) + "</option>";
                }
                else if (strVisitCountry == "Child in a doubleroom on their own")
                {
                    strHtml = "";
                    Yrs = 0; YrsEnd = 15;
                    for (; Yrs <= YrsEnd; Yrs++)
                        strHtml += " <option Value='" + Convert.ToString(ChildYrs - Yrs) + "' " + (Convert.ToString(ChildYrs - Yrs) == ControlVal ? "selected='true'" : "") + ">" + Convert.ToString(ChildYrs - Yrs) + "</option>";
                }
                else if (strTariffName.Contains("under 16"))
                {
                    strHtml = "";
                    Yrs = 0; YrsEnd = 16;
                    for (; Yrs <= YrsEnd; Yrs++)
                        strHtml += " <option Value='" + Convert.ToString(ChildYrs - Yrs) + "' " + (Convert.ToString(ChildYrs - Yrs) == ControlVal ? "selected='true'" : "") + ">" + Convert.ToString(ChildYrs - Yrs) + "</option>";
                }
                else if (strTariffName.Contains("under 12"))
                {
                    strHtml = "";
                    Yrs = 0; YrsEnd = 12;
                    for (; Yrs <= YrsEnd; Yrs++)
                        strHtml += " <option Value='" + Convert.ToString(ChildYrs - Yrs) + "' " + (Convert.ToString(ChildYrs - Yrs) == ControlVal ? "selected='true'" : "") + ">" + Convert.ToString(ChildYrs - Yrs) + "</option>";
                }
                else if (strTariffName.Contains("1999 to 2005"))
                {
                    strHtml = "";
                    Yrs = 10; YrsEnd = 16;
                    for (; Yrs <= YrsEnd; Yrs++)
                        strHtml += " <option Value='" + Convert.ToString(ChildYrs - Yrs) + "' " + (Convert.ToString(ChildYrs - Yrs) == ControlVal ? "selected='true'" : "") + ">" + Convert.ToString(ChildYrs - Yrs) + "</option>";
                }
                else if (strTariffName.Contains("9-15"))
                {
                    strHtml = "";
                    Yrs = 9; YrsEnd = 15;
                    for (; Yrs <= YrsEnd; Yrs++)
                        strHtml += " <option Value='" + Convert.ToString(ChildYrs - Yrs) + "' " + (Convert.ToString(ChildYrs - Yrs) == ControlVal ? "selected='true'" : "") + ">" + Convert.ToString(ChildYrs - Yrs) + "</option>";
                }
                else if (strTariffName.Contains("0-8"))
                {
                    strHtml = "";
                    Yrs = 0; YrsEnd = 8;
                    for (; Yrs <= YrsEnd; Yrs++)
                        strHtml += " <option Value='" + Convert.ToString(ChildYrs - Yrs) + "' " + (Convert.ToString(ChildYrs - Yrs) == ControlVal ? "selected='true'" : "") + ">" + Convert.ToString(ChildYrs - Yrs) + "</option>";
                }
                else if (strTariffName.Contains("03-05"))
                {
                    strHtml = "";
                    Yrs = 3; YrsEnd = 5;
                    for (; Yrs <= YrsEnd; Yrs++)
                        strHtml += " <option Value='" + Convert.ToString(ChildYrs - Yrs) + "' " + (Convert.ToString(ChildYrs - Yrs) == ControlVal ? "selected='true'" : "") + ">" + Convert.ToString(ChildYrs - Yrs) + "</option>";
                }
                else if (strTariffName.Contains("04-11"))
                {
                    strHtml = "";
                    Yrs = 4; YrsEnd = 11;
                    for (; Yrs <= YrsEnd; Yrs++)
                        strHtml += " <option Value='" + Convert.ToString(ChildYrs - Yrs) + "' " + (Convert.ToString(ChildYrs - Yrs) == ControlVal ? "selected='true'" : "") + ">" + Convert.ToString(ChildYrs - Yrs) + "</option>";
                }
                else if (strTariffName == "Kids (05 - 16 Yrs)")
                {
                    strHtml = "";
                    Yrs = 5; YrsEnd = 16;
                    for (; Yrs <= YrsEnd; Yrs++)
                        strHtml += " <option Value='" + Convert.ToString(ChildYrs - Yrs) + "' " + (Convert.ToString(ChildYrs - Yrs) == ControlVal ? "selected='true'" : "") + ">" + Convert.ToString(ChildYrs - Yrs) + "</option>";
                }
                else if (strBType == "SIS")
                {
                    strHtml = "";
                    Yrs = 0; YrsEnd = 18;
                    for (; Yrs <= YrsEnd; Yrs++)
                        strHtml += " <option Value='" + Convert.ToString(ChildYrs - Yrs) + "' " + (Convert.ToString(ChildYrs - Yrs) == ControlVal ? "selected='true'" : "") + ">" + Convert.ToString(ChildYrs - Yrs) + "</option>";
                }
                else
                {
                    strHtml = "";
                    Yrs = 4; YrsEnd = 12;
                    for (; Yrs <= YrsEnd; Yrs++)
                        strHtml += " <option Value='" + Convert.ToString(ChildYrs - Yrs) + "' " + (Convert.ToString(ChildYrs - Yrs) == ControlVal ? "selected='true'" : "") + ">" + Convert.ToString(ChildYrs - Yrs) + "</option>";
                }
            }
            else if (strPaxType == "Passport" && strBType == "PTP")
            {
                strHtml = "";
                Yrs = DateTime.Now.Year; YrsEnd = DateTime.Now.AddYears(20).Year;
                for (; Yrs <= YrsEnd; Yrs++)
                    strHtml += " <option Value='" + Convert.ToString(Yrs) + "' " + (Convert.ToString(Yrs) == ControlVal ? "selected='true'" : "") + ">" + Convert.ToString(Yrs) + "</option>";
            }
            else
            {
                strHtml = "";
                Yrs = 16; YrsEnd = 80;
                for (; Yrs <= YrsEnd; Yrs++)
                    strHtml += " <option Value='" + Convert.ToString(AdultYrs - Yrs) + "' " + (Convert.ToString(AdultYrs - Yrs) == ControlVal ? "selected='true'" : "") + ">" + Convert.ToString(AdultYrs - Yrs) + "</option>";
            }
        }

        return strHtml;
    }
    public string Fill_Day_Month_Content(String ControlType, String ControlVal)
    {
        String strHtml = "";
        if (ControlType == "DD")
        {
            for (int day = 0; day <= 31; day++)
            {
                if (day == 0)
                {
                    strHtml += " <option Value='0'>DD</option>";
                }
                else
                {
                    strHtml += " <option Value='" + Convert.ToString(day) + "' " + (Convert.ToString(day) == ControlVal ? "selected='true'" : "") + ">" + Convert.ToString(day) + "</option>";
                }
            }
        }

        //Month
        if (ControlType == "MM")
        {
            for (int mnth = 0; mnth <= 12; mnth++)
            {
                if (mnth == 0)
                {
                    strHtml += " <option Value='0'>MM</option>";
                }
                else
                {
                    strHtml += " <option Value='" + Convert.ToString(mnth) + "' " + (Convert.ToString(mnth) == ControlVal ? "selected='true'" : "") + ">" + info.GetMonthName(mnth).Substring(0, 3).ToUpper() + "</option>";
                }
            }
        }
        return strHtml;
    }

    public void FillContent()
    {
        DataSet ds = new DataSet();
        DataTable dt = new DataTable();
        EurailClasses.Eurail oClsEurail = new EurailClasses.Eurail();
        oClsEurail.TransactionId = Convert.ToString(transId);
        ds = oClsEurail.Get_Eurail_MTExcursions_BookingDetail();
        if (ds.Tables.Count > 0)
        {
            dt = ds.Tables[0];
            if (dt.Rows.Count > 0 && !string.IsNullOrEmpty(Convert.ToString(dt.Rows[0]["LeadPaxName"])))
            {
                ddlTitle.SelectedIndex = ddlTitle.Items.IndexOf(ddlTitle.Items.FindByText(Convert.ToString(dt.Rows[0]["PaxTitle"])));
                txtName.Value = Convert.ToString(dt.Rows[0]["LeadPaxName"]);
                txtStayDetails.Value = Convert.ToString(dt.Rows[0]["PaxAddress"]);
                txtPostalCode.Value = Convert.ToString(dt.Rows[0]["PaxPin"]);
                txtCountry.Value = Convert.ToString(dt.Rows[0]["PaxCountry"]);
                txtCity.Value = Convert.ToString(dt.Rows[0]["PaxCity"]);
                txtPhoneNo.Value = Convert.ToString(dt.Rows[0]["PaxPhone"]);
                txtMobileNo.Value = Convert.ToString(dt.Rows[0]["PaxMobile"]);
                txtEmail.Value = Convert.ToString(dt.Rows[0]["PaxEmail"]);
                txtComments.Value = Convert.ToString(dt.Rows[0]["PaxComment"]);
            }
        }
    }

    protected void btnContinue_Click(object sender, EventArgs e)
    {
        try
        {
            //////////////////// start we are captureing all extra charges//////////////////////////////
            //EurailClasses.Eurail oErail = new EurailClasses.Eurail();
            //oErail.TransactionId = Convert.ToString(transId);
            //oErail.Currency = Convert.ToString(Session["CurrencyCode"]);
            //oErail.Amount = 0;//will add later;
            //oErail.PGCharge = Convert.ToDecimal(lblBankCharges.Text);
            //oErail.PGChargeAmt = Convert.ToDecimal(lblBankChargesAmt.Text);
            //oErail.STax = Convert.ToDecimal(lblServiceTax.Text);
            //oErail.STaxAmt = Convert.ToDecimal(lblServiceTaxAmt.Text);
            //oErail.GrandTotalAmt = Convert.ToDecimal(lblTotalPayable.Text);
            //String isRsltOk = Convert.ToString(oErail.insert_ShoppingCartProduct_ExtraCharge_Master());
            ////&& isRsltOk.ToUpper() == "OK"
            //////////////////// end we are captureing all extra charges//////////////////////////////

            if (Convert.ToString(transId) != "")
            {
                DataTable dt = new DataTable();
                EurailClasses.Eurail oClsEurail = new EurailClasses.Eurail();
                oClsEurail.TransactionId = Convert.ToString(transId);
                dt = oClsEurail.Get_Eurail_Tariff_ShoppingCart();
                String str = "";
                String arrCart1 = "";
                String[] arrCart2 = null;
                String MtBId = "";
                if (dt.Rows.Count > 0)
                {
                    arrCart1 = Convert.ToString(hdnJValue.Value).LastIndexOf("~") > 0 ? Convert.ToString(hdnJValue.Value).Remove(Convert.ToString(hdnJValue.Value).LastIndexOf("~")) : Convert.ToString(hdnJValue.Value);
                    for (int i = 0; i < (arrCart1.Split('~')).Length; i++)
                    {
                        arrCart2 = Convert.ToString(arrCart1.Split('~')[i]).Split(',');
                        txtStayDetails.Value = txtStayDetails.Value.Replace("&", " ");
                        txtComments.Value = txtComments.Value.Replace("&", " ");
                        if (Convert.ToString(arrCart2[4]) == "PASS")
                        {
                            oClsEurail.TransactionId = Convert.ToString(transId);
                            oClsEurail.BookingDetailId = Convert.ToInt32(arrCart2[0]);
                            oClsEurail.Title = Convert.ToString(arrCart2[1] == "1" ? "Mr" : arrCart2[1] == "2" ? "Ms" : arrCart2[1] == "3" ? "Mrs" : "Select");
                            oClsEurail.FirstName = Convert.ToString(arrCart2[2]);
                            oClsEurail.LastName = Convert.ToString(arrCart2[3]);
                            oClsEurail.PassportNumber = "----" + "/" + Convert.ToString(arrCart2[5]) + "/----";
                            //oClsEurail.DOB = Convert.ToDateTime(new DateTime(Convert.ToInt32(arrCart2[8]), Convert.ToInt32(arrCart2[7]), Convert.ToInt32(arrCart2[6])));
                            oClsEurail.DOB = Convert.ToDateTime(arrCart2[6], dateFormatInf);
                            str = oClsEurail.Update_EurailPaxDetail();
                            if (str == "0")
                            {
                                break;
                            }
                            else if (str == "1")
                            {
                                oClsEurail = new EurailClasses.Eurail();
                                oClsEurail.TransactionId = Convert.ToString(transId);
                                oClsEurail.BookingDetailId = Convert.ToInt32(arrCart2[0]);
                                oClsEurail.IsConfirmedByUser = Convert.ToInt32(Convert.ToString(Session["IsRightToPrintVoucher"]) == "1" ? "1" : "0");
                                oClsEurail.PaxTitle = Convert.ToString(ddlTitle.Items[ddlTitle.SelectedIndex].Text).ToUpper();
                                oClsEurail.PaxFName = Convert.ToString(txtName.Value).ToUpper();
                                oClsEurail.PaxAddress = Convert.ToString(txtStayDetails.Value).ToUpper();
                                oClsEurail.PaxPin = Convert.ToString(txtPostalCode.Value).ToUpper();
                                oClsEurail.PaxCity = Convert.ToString(txtCity.Value).ToUpper();
                                oClsEurail.PaxCountry = Convert.ToString(txtCountry.Value).ToUpper();
                                oClsEurail.PaxPhone = Convert.ToString(txtPhoneNo.Value).ToUpper();
                                oClsEurail.PaxMobile = Convert.ToString(txtMobileNo.Value).ToUpper();
                                oClsEurail.PaxEmail = Convert.ToString(txtEmail.Value);
                                oClsEurail.Comment = Convert.ToString(txtComments.Value).ToUpper();
                                oClsEurail.Update_EurailbookingDetail_Entry();
                            }
                        }
                        else if (Convert.ToString(arrCart2[4]) == "PTP")
                        {
                            oRailEurope = new RailEuropeClasses.RailEuropeRea();
                            oRailEurope.TransactionId = Convert.ToString(transId);
                            oRailEurope.BookingDetailId = Convert.ToInt32(arrCart2[0]);
                            oRailEurope.Title = Convert.ToString(arrCart2[1] == "1" ? "Mr" : arrCart2[1] == "2" ? "Ms" : arrCart2[1] == "3" ? "Mrs" : "Select");
                            oRailEurope.FirstName = Convert.ToString(arrCart2[2]);
                            oRailEurope.LastName = Convert.ToString(arrCart2[3]);
                            oRailEurope.PassportNumber = (arrCart2.Length > 9 ? Convert.ToString(arrCart2[9]) : "----") + "/" + Convert.ToString(arrCart2[5]) + "/" + (arrCart2.Length > 9 ? Convert.ToInt32(arrCart2[12]) + "-" + Convert.ToInt32(arrCart2[11]) + "-" + Convert.ToInt32(arrCart2[10]) : "----");
                            //oRailEurope.DOB = Convert.ToDateTime(new DateTime(Convert.ToInt32(arrCart2[8]), Convert.ToInt32(arrCart2[7]), Convert.ToInt32(arrCart2[6])));
                            oRailEurope.DOB = Convert.ToDateTime(arrCart2[6], dateFormatInf);
                            str = oRailEurope.Update_REA_Pax_DetailRea();

                            if (str == "0")
                            {
                                break;
                            }
                            else if (str == "1")
                            {
                                oRailEurope = new RailEuropeClasses.RailEuropeRea();
                                oRailEurope.TransactionId = Convert.ToString(transId);
                                oRailEurope.BookingDetailId = Convert.ToInt32(arrCart2[0]);
                                oRailEurope.Title = Convert.ToString(ddlTitle.Items[ddlTitle.SelectedIndex].Text).ToUpper();
                                oRailEurope.LeadPaxName = Convert.ToString(txtName.Value).ToUpper();
                                oRailEurope.PaxAddress = Convert.ToString(txtStayDetails.Value).ToUpper();
                                oRailEurope.PaxPostalCode = Convert.ToString(txtPostalCode.Value).ToUpper();
                                oRailEurope.PaxCity = Convert.ToString(txtCity.Value).ToUpper();
                                oRailEurope.PaxCountry = Convert.ToString(txtCountry.Value).ToUpper();
                                oRailEurope.PaxPhoneNo = Convert.ToString(txtPhoneNo.Value).ToUpper();
                                oRailEurope.PaxMobileNo = Convert.ToString(txtMobileNo.Value).ToUpper();
                                oRailEurope.PaxEmail = Convert.ToString(txtEmail.Value);
                                oRailEurope.Comment = Convert.ToString(txtComments.Value).ToUpper();
                                oRailEurope.Update_REA_Booking_DetailRea();
                            }
                        }
                        else if (Convert.ToString(arrCart2[4]) == "SIS")
                        {
                            osightseeing = new SightSeeingClasses.SightSeeingxml();
                            osightseeing.TransactionId = Convert.ToString(transId);
                            osightseeing.BookingDetailId = Convert.ToInt32(arrCart2[0]);
                            osightseeing.Title = Convert.ToString(arrCart2[1] == "1" ? "Mr" : arrCart2[1] == "2" ? "Ms" : arrCart2[1] == "3" ? "Mrs" : "Select");
                            osightseeing.FirstName = Convert.ToString(arrCart2[2]);
                            osightseeing.LastName = Convert.ToString(arrCart2[3]);
                            osightseeing.PassportNumber = Convert.ToString(arrCart2[4]) + "/" + Convert.ToString(arrCart2[6]);
                            //osightseeing.DOB = Convert.ToDateTime(new DateTime(Convert.ToInt32(arrCart2[9]), Convert.ToInt32(arrCart2[8]), Convert.ToInt32(arrCart2[7])));
                            osightseeing.DOB = Convert.ToDateTime(arrCart2[6], dateFormatInf);
                            str = osightseeing.Update_Sightseeing_Pax_Detail();

                            if (str == "0")
                            {
                                break;
                            }
                            else if (str == "1")
                            {
                                osightseeing = new SightSeeingClasses.SightSeeingxml();
                                osightseeing.TransactionId = Convert.ToString(transId);
                                osightseeing.BookingDetailId = Convert.ToInt32(arrCart2[0]);
                                //oRailEurope.IsConfirmedByUser = Convert.ToInt32(Convert.ToString(Session["IsRightToPrintVoucher"]) == "1" ? "1" : "0"); specially commented here dont open
                                osightseeing.Title = Convert.ToString(ddlTitle.Items[ddlTitle.SelectedIndex].Text).ToUpper();
                                osightseeing.LeadPaxName = Convert.ToString(txtName.Value).ToUpper();
                                osightseeing.PaxAddress = Convert.ToString(txtStayDetails.Value).ToUpper();
                                osightseeing.PaxPinCode = Convert.ToInt32(txtPostalCode.Value);
                                osightseeing.PaxCity = Convert.ToString(txtCity.Value).ToUpper();
                                osightseeing.PaxCountry = Convert.ToString(txtCountry.Value).ToUpper();
                                osightseeing.PaxContactNumber = Convert.ToString(txtPhoneNo.Value).ToUpper();
                                osightseeing.PaxMobileNumber = Convert.ToString(txtMobileNo.Value).ToUpper();
                                osightseeing.PaxEmailID = Convert.ToString(txtEmail.Value);
                                osightseeing.Remarks = Convert.ToString(txtComments.Value).ToUpper();
                                osightseeing.Update_Sightseeing_Booking_Detail();
                            }
                        }
                        else if (Convert.ToString(arrCart2[4]) == "MTEX")
                        {
                            oClsEurail.CartId = Convert.ToInt32(arrCart2[0]);
                            oClsEurail.PaxTitle = Convert.ToString(arrCart2[1] == "1" ? "Mr" : arrCart2[1] == "2" ? "Ms" : arrCart2[1] == "3" ? "Mrs" : "Select");
                            oClsEurail.PaxFName = Convert.ToString(arrCart2[2]);
                            oClsEurail.PaxLName = Convert.ToString(arrCart2[3]);
                            if ((dt.Select("ExcursionName='Innsbruck card : 1 Day'")).Length > 0 || (dt.Select("ExcursionName='Sound of Music'")).Length > 0)
                                oClsEurail.PassNo = "Pass No.";
                            else
                                oClsEurail.PassNo = "----";
                            oClsEurail.PassNo = oClsEurail.PassNo + "/" + Convert.ToString(arrCart2[5]) + "/----";
                            //oClsEurail.DOB = Convert.ToDateTime(new DateTime(Convert.ToInt32(arrCart2[8]), Convert.ToInt32(arrCart2[7]), Convert.ToInt32(arrCart2[6])));
                            oClsEurail.DOB = Convert.ToDateTime(arrCart2[6], dateFormatInf);
                            str = oClsEurail.Update_Mountain_Excursions_Tariff_ShoppingCart();
                            if (str == "0")
                            {
                                //lblMsg.Text = "Sorry! " + (i + 1) + " Rows Inserted.";
                                break;
                            }
                            else if (str == "1")
                            {
                                if (dt.Rows.Count > 0)
                                {
                                    //if (Convert.ToString(Session["MtBId"]) == "")
                                    {
                                        oClsEurail = new EurailClasses.Eurail();
                                        oClsEurail.TransactionId = Convert.ToString(dt.Rows[0]["TransactionId"]);
                                        oClsEurail.AgencyId = Convert.ToInt32(dt.Rows[0]["AgencyId"]);
                                        oClsEurail.DeskId = Convert.ToInt32(dt.Rows[0]["DeskId"]);
                                        oClsEurail.BranchId = Convert.ToInt32(dt.Rows[0]["BranchId"]);
                                        oClsEurail.IsConfirmedByUser = Convert.ToInt32(Convert.ToString(Session["IsRightToPrintVoucher"]) == "1" ? "1" : "0");
                                        oClsEurail.PaxTitle = Convert.ToString(ddlTitle.Items[ddlTitle.SelectedIndex].Text).ToUpper();
                                        oClsEurail.PaxFName = Convert.ToString(txtName.Value).ToUpper();
                                        oClsEurail.PaxAddress = Convert.ToString(txtStayDetails.Value).ToUpper();
                                        oClsEurail.PaxPin = Convert.ToString(txtPostalCode.Value).ToUpper();
                                        oClsEurail.PaxCity = Convert.ToString(txtCity.Value).ToUpper();
                                        oClsEurail.PaxCountry = Convert.ToString(txtCountry.Value).ToUpper();
                                        oClsEurail.PaxPhone = Convert.ToString(txtPhoneNo.Value).ToUpper();
                                        oClsEurail.PaxMobile = Convert.ToString(txtMobileNo.Value).ToUpper();
                                        oClsEurail.PaxEmail = Convert.ToString(txtEmail.Value);
                                        oClsEurail.Currency = Convert.ToString(dt.Rows[0]["Currency"]);
                                        oClsEurail.TariffRate = Convert.ToDecimal(dt.Compute("Sum(TariffRate)", ""));
                                        oClsEurail.MarkUp = Convert.ToDecimal(dt.Rows[0]["MarkUp"]);
                                        oClsEurail.BookedThru = "B2C";
                                        oClsEurail.Comment = Convert.ToString(txtComments.Value).ToUpper();
                                        MtBId = oClsEurail.Insert_Mountain_Excursions_BookingDetail();
                                        Session["MtBId"] = MtBId.ToString();
                                        oClsEurail.TransactionId = Convert.ToString(transId);
                                        //Response.Redirect("PassMtPaxDetails.aspx?TransId=" + Convert.ToString(transId) + "&MtBId=" + MtBId + "&cntry=" + countrycode, false);
                                    }
                                }

                            }
                        }
                        else if (Convert.ToString(arrCart2[4]) == "PACK")
                        {
                            Packagesclasses.PackagesDetails opackagesdetails = new Packagesclasses.PackagesDetails();
                            opackagesdetails.PackPaxId = Convert.ToInt32(arrCart2[0]);
                            opackagesdetails.Title = Convert.ToString(arrCart2[1] == "1" ? "Mr" : arrCart2[1] == "2" ? "Ms" : arrCart2[1] == "3" ? "Mrs" : "Select");
                            opackagesdetails.FirstName = Convert.ToString(arrCart2[2]);
                            opackagesdetails.LastName = Convert.ToString(arrCart2[3]);
                            opackagesdetails.PassportNumber = "----" + "/" + Convert.ToString(arrCart2[5]) + "/----";
                            //opackagesdetails.DOB = Convert.ToDateTime(new DateTime(Convert.ToInt32(arrCart2[8]), Convert.ToInt32(arrCart2[7]), Convert.ToInt32(arrCart2[6])));
                            opackagesdetails.DOB = Convert.ToDateTime(arrCart2[6], dateFormatInf);
                            str = opackagesdetails.Update_PackageBookingDetail();
                            if (str == "0") { break; }
                            else if (str == "1")
                            {
                                opackagesdetails.PackTransId = Convert.ToString(transId);
                                opackagesdetails.IsConfirmedByUser = Convert.ToInt32(Convert.ToString(Session["IsRightToPrintVoucher"]) == "1" ? "1" : "0");
                                opackagesdetails.Title = Convert.ToString(ddlTitle.Items[ddlTitle.SelectedIndex].Text).ToUpper();
                                opackagesdetails.FName = Convert.ToString(txtName.Value).ToUpper();
                                opackagesdetails.Postalcode = Convert.ToString(txtPostalCode.Value).ToUpper();
                                opackagesdetails.Address = Convert.ToString(txtStayDetails.Value).ToUpper();
                                opackagesdetails.City = Convert.ToString(txtCity.Value).ToUpper();
                                opackagesdetails.Country = Convert.ToString(txtCountry.Value).ToUpper();
                                opackagesdetails.PhoneNo = Convert.ToString(txtPhoneNo.Value).ToUpper();
                                opackagesdetails.MobileNo = Convert.ToString(txtMobileNo.Value).ToUpper();
                                opackagesdetails.Email = Convert.ToString(txtEmail.Value);
                                opackagesdetails.Comments = Convert.ToString(txtComments.Value).ToUpper();
                                opackagesdetails.Update_PackagebookingDetail_Entry();
                            }
                        }
                        //Viator Integration 
                        if (Convert.ToString(arrCart2[4]) == "VIAT")
                        {
                            PaxDetails objPaxVtr = new PaxDetails();
                            objPaxVtr.transactionId = Convert.ToString(transId);
                            objPaxVtr.destnID = Convert.ToInt32(arrCart2[0]);
                            objPaxVtr.title = Convert.ToString(arrCart2[1] == "1" ? "Mr" : arrCart2[1] == "2" ? "Ms" : arrCart2[1] == "3" ? "Mrs" : "Select");
                            objPaxVtr.firstName = Convert.ToString(arrCart2[2]);
                            objPaxVtr.lastName = Convert.ToString(arrCart2[3]);
                            objPaxVtr.passportNumber = "----" + "/" + Convert.ToString(arrCart2[5]) + "/----";
                            //objPaxVtr.DOB = Convert.ToDateTime(new DateTime(Convert.ToInt32(arrCart2[8]), Convert.ToInt32(arrCart2[7]), Convert.ToInt32(arrCart2[6])));
                            objPaxVtr.DOB = Convert.ToDateTime(arrCart2[6], dateFormatInf);
                            str = objPaxVtr.Update_ViatorPaxDetail();
                            if (str == "0")
                            {
                                break;
                            }
                            else if (str == "1")
                            {
                                shoopingcartParam objvtrCart = new shoopingcartParam();
                                objvtrCart.transactionId = Convert.ToString(transId);
                                objvtrCart.cartId = Convert.ToInt32(arrCart2[0]);
                                objvtrCart.isConfirmedByUser = Convert.ToInt32(Convert.ToString(Session["IsRightToPrintVoucher"]) == "1" ? "1" : "0");
                                objvtrCart.title = Convert.ToString(ddlTitle.Items[ddlTitle.SelectedIndex].Text).ToUpper();
                                objvtrCart.name = Convert.ToString(txtName.Value).ToUpper();
                                objvtrCart.address = Convert.ToString(txtStayDetails.Value).ToUpper();
                                objvtrCart.postalCode = Convert.ToString(txtPostalCode.Value).ToUpper();
                                objvtrCart.city = Convert.ToString(txtCity.Value).ToUpper();
                                objvtrCart.country = Convert.ToString(txtCountry.Value).ToUpper();
                                objvtrCart.phoneNo = Convert.ToString(txtPhoneNo.Value).ToUpper();
                                objvtrCart.mobileNo = Convert.ToString(txtMobileNo.Value).ToUpper();
                                objvtrCart.email = Convert.ToString(txtEmail.Value);
                                objvtrCart.comment = Convert.ToString(txtComments.Value).ToUpper();
                                objvtrCart.UpdateVaitorPaxDetailToShopCart();
                            }
                        }
                    }
                    try
                    {//Added By Rajani..after closing viewstate in webconfig. i have to change this code
                        string strBranchValue = ddlBranch.SelectedValue == "" ? Request.Form["ctl00$ContentPlaceHolder$ddlBranch"] : ddlBranch.SelectedValue;
                        RailEuropeClasses.RailEuropeRea oRail = new RailEuropeClasses.RailEuropeRea();
                        //oRail.Update_Respective_Branch(Convert.ToInt32(ddlBranch.SelectedValue.Split(";".ToCharArray())[0]), Convert.ToString(ddlBranch.SelectedValue.Split(";".ToCharArray())[1]), Convert.ToString(txtPanNo.Value), Convert.ToString(transId));
                        oRail.Update_Respective_Branch(Convert.ToInt32(strBranchValue.Split(";".ToCharArray())[0]),
                            Convert.ToString(strBranchValue.Split(";".ToCharArray())[1]),
                            Convert.ToString(txtPanNo.Value), Convert.ToString(transId));
                    }
                    catch (Exception exx)
                    {
                        throw new Exception("Somthing wrong in updation of branchid.");
                    }
                    String Paymentflag = "false";
                    String strResult = "";
                    try
                    {
                        //////////////Start specially for PTP ticketing////////////
                        DataSet dsREABooking = new DataSet();
                        DataTable dtSearchInfo = new DataTable();
                        oRailEurope = new RailEuropeClasses.RailEuropeRea();
                        oRailEurope.TransactionId = Convert.ToString(transId);
                        dsREABooking = oRailEurope.Get_REA_BookingDetails_By_TransactionIdRea(); //start booking process for 1 sectore hitting xml
                        if (dsREABooking.Tables.Count > 0)
                        {
                            if (dsREABooking.Tables[0].Rows.Count > 0 && dsREABooking.Tables[1].Rows.Count > 0)
                            {
                                DataTable dtEraRows = new DataTable();
                                if (dsREABooking.Tables[0].Select("[EraKey] <> ''").Length > 0)
                                    dtEraRows = dsREABooking.Tables[0].Select("[EraKey] <> ''").CopyToDataTable();

                                DataTable dtREARows = new DataTable();
                                if (dsREABooking.Tables[0].Select("[EraKey] = ''").Length > 0)
                                    dtREARows = dsREABooking.Tables[0].Select("[EraKey] = ''").CopyToDataTable();

                                oRailEurope.SearchRefNo = Convert.ToString(dsREABooking.Tables[0].Rows[0]["SearchRefNo"]);
                                dtSearchInfo = oRailEurope.Get_REA_SearchInfo_MasterRea();
                                if (dtSearchInfo.Rows.Count > 0)
                                {
                                    if (dtEraRows.Rows.Count > 0)
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
                                        BookRailParam bookParam = new BookRailParam();
                                        bookParam.TransactionId = oRailEurope.TransactionId;
                                        bookParam.SearchRefId = oRailEurope.SearchRefNo;
                                        bookParam.CorrelationID = Convert.ToString(Session["CorrelationID"]);
                                        XmlDocument xmldoc = new XmlDocument();
                                        string strResp = new BookRailBLL().BookRails(bookParam);
                                        xmldoc.LoadXml(strResp);

                                        XmlNode node = xmldoc.SelectSingleNode("RailBookResponse/TransactionId");
                                        if (node != null)
                                            Paymentflag = "true";
                                        else
                                            Paymentflag = "false";
                                    }
                                    if (dtREARows.Rows.Count > 0)
                                    {
                                        oRailEurope.SearchRefNo = Convert.ToString(dtREARows.Rows[0]["SearchRefNo"]);
                                        DataTable dtREASearchInfo = oRailEurope.Get_REA_SearchInfo_MasterRea();

                                        DataTable dtREAPaxRows = new DataTable();
                                        dtREAPaxRows = dsREABooking.Tables[1].Select("[PaxDetails] = ''").CopyToDataTable();

                                        strResult = oRailEurope.Get_BookingCreationRea(dtREASearchInfo, dtREARows, dtREAPaxRows); //start booking process for 1 sectore hitting xml
                                        if (strResult != "")
                                        {
                                            if (Convert.ToString(strResult.Split(':')[0]) != "XX")
                                            {
                                                Paymentflag = "true";
                                                String strQuery = "";
                                                strQuery += "Update REA_Booking_Detail ";
                                                strQuery += "set BookingRefNo='" + Convert.ToString(strResult.Split(':')[0]) + "', ";
                                                strQuery += "BookingStatus='" + Convert.ToString(strResult.Split(':')[1]) + "' ";
                                                strQuery += "Where Id=" + Convert.ToString(dtREARows.Rows[0]["Id"]);
                                                oRailEurope.QueryBaseFunctionRea(strQuery);

                                                dsREABooking = oRailEurope.Get_REA_BookingDetails_By_TransactionIdRea(); //start booking process more than 1 sectore
                                                if (dsREABooking.Tables.Count > 0)
                                                {
                                                    if (dsREABooking.Tables[0].Rows.Count > 0 && dsREABooking.Tables[1].Rows.Count > 0)
                                                    {
                                                        dtREARows = new DataTable();
                                                        if (dsREABooking.Tables[0].Select("[EraKey] = ''").Length > 0)
                                                            dtREARows = dsREABooking.Tables[0].Select("[EraKey] = ''").CopyToDataTable();

                                                        dtREAPaxRows = new DataTable();
                                                        dtREAPaxRows = dsREABooking.Tables[1].Select("[PaxDetails] = ''").CopyToDataTable();

                                                        Paymentflag = "false";
                                                        oRailEurope.BookingRefNo = Convert.ToString(strResult.Split(':')[0]);//Convert.ToString(dsREABooking.Tables[0].Rows[0]["BookingRefNo"]);
                                                        strResult = oRailEurope.Get_BookingModificationRea(dtREASearchInfo, dtREARows, dtREAPaxRows, "false"); //start booking process more than 1 sectore hitting xml
                                                        if (strResult != "")
                                                        {
                                                            if (Convert.ToString(strResult.Split(':')[0]) != "XX")
                                                            {
                                                                Paymentflag = "true";
                                                            }
                                                            else
                                                            {
                                                                Paymentflag = "false";
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                            else
                                            {
                                                Paymentflag = "false";
                                            }
                                        }
                                    }
                                }
                            }
                            else
                            {
                                dsREABooking = null;
                                dsREABooking = oRailEurope.Get_REA_BookingDetails_By_TransactionId_For_ModificationOnlyRea();
                                if (dsREABooking.Tables.Count > 0)
                                {
                                    Paymentflag = "true";

                                }
                            }
                        }
                    }
                    catch (Exception ex)
                    {
                        Paymentflag = "false";
                    }
                    ////////////End specially for PTP ticketing////////////
                    if (Convert.ToBoolean(Paymentflag))
                    {
                        Response.Redirect("PassMtPaxList.aspx?TransId=" + Convert.ToString(transId) + "&cntry=" + countrycode + "&CartCnt=" + Convert.ToString(Session["CartCnt"]), false);
                    }
                    else
                    {
                        Utilities.ErrDetail oErrDetail = new Utilities.ErrDetail();
                        oErrDetail.ModuleName = "btn_Sumbmit_Click" + "##" + Convert.ToString(System.Web.HttpContext.Current.Request.Url.AbsolutePath);
                        oErrDetail.ErrDescription = strResult;
                        oErrDetail.AgencyId = Convert.ToDouble(oLoginDetail.AgencyId);
                        oErrDetail.DeskId = Convert.ToDouble(oLoginDetail.UserMasterId);
                        oErrDetail.SearchRefId = Convert.ToString(Session["SearchRefID"]);
                        oErrDetail.TransactionId = Convert.ToString(Session["TransactionID"]);
                        oErrDetail.Insert_ErrDetail();
                        Response.Redirect("/info/ErrorMessagepg.aspx?Error=" + strResult + "&Cntry=" + countrycode, false);
                    }
                }
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
            oErrDetail.TransactionId = Convert.ToString(Session["TransactionID"]);
            oErrDetail.Insert_ErrDetail();
            Response.Redirect("/info/ErrorMessagepg.aspx?Error=" + Convert.ToString(ex.Message).Replace("\n", ""), false);

        }
    }
}