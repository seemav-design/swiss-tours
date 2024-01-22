$(function () {
    try {
        $("#ContentPlaceHolder_txtSearchSSCity").autocomplete({
            source: function (request, response) {
                var searchtext = '';
                searchtext = document.getElementById("ContentPlaceHolder_txtSearchSSCity").value;
                $.ajax({
                    type: "POST",
                    url: "/Sightseeing/SightSeeingSearch.aspx/GetCountryCityListData",
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    data: '{SearchText: "' + searchtext + '"}',
                    success: function (data) {
                        response(data.d);
                    },
                    failure: function (response) {
                        alert(response.d);
                    }
                });
            },
            minLength: 3,
            select: function (event, ui) {
                document.getElementById("ContentPlaceHolder_hdnSearchFrom").value = ui.item.CityName + ":" + ui.item.CityId + ":" + ui.item.CountryName + ":" + ui.item.CountryCode;
            }
        });
    } catch (e) { }
    try {
        $('.ui-autocomplete').css('max-height', '500px');//this for auto complete box height   
        $('.ui-autocomplete').css('height', 'auto');//this for auto complete box height   
    } catch (e) { }
});