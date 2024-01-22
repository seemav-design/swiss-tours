/* Date Time picker */
$('.form_datetime').datetimepicker({
    language: 'en', weekStart: 1, todayBtn: 0, autoclose: 1, todayHighlight: 1, startView: 2, forceParse: 0, minView: 1, format: 'dd M yyyy - hh:00', pickerPosition: "bottom-right", hoursDisabled: '0,1,2,3,5,7,9,11,13,15,17,19,21,22,23'
});

$('.form_date').datetimepicker({
    language: 'en', weekStart: 1, todayBtn: 0, autoclose: 1, todayHighlight: 1, startView: 2, forceParse: 0, minView: 2, format: 'dd M yyyy', pickerPosition: "bottom-right"
});

/*  Passengers Select  */
$(function () {
    $('.popover-markup>.trigger').each(function (index, elem) {
        var $popover = $(elem).popover({
            html: true,
            placement: 'bottom',
            sanitize: false,
            container: '.popover-markup',
            
            // title: '<?= lang("Select passengers");?><a class="close demise");">×</a>',
            content: function () {
                return $(this).parent().find('.content').html();
            }
        });

        
        // open popover & inital value in form     
        //passengers = [0,0,0,0] //adult,youth,child,senior
        var adult = 0, youth = 0, child = 0, senior = 0, childAges = '';
        adult = $('#ContentPlaceHolder_adult').val() == "" ? 0 : $('#ContentPlaceHolder_adult').val();
        youth = $('#ContentPlaceHolder_youth').val() == "" ? 0 : $('#ContentPlaceHolder_youth').val();
        child = $('#ContentPlaceHolder_child').val() == "" ? 0 : $('#ContentPlaceHolder_child').val();
        senior = $('#ContentPlaceHolder_senior').val() == "" ? 0 : $('#ContentPlaceHolder_senior').val();
        for (var c = 1; c < child; c++) {
            if (c == 1)
                childAges = $('.popover-body #ContentPlaceHolder_childAge' + c).val() == "" ? 0 : $('.popover-body #ContentPlaceHolder_childAge' + c).val();
            else
                childAges += "," + ($('.popover-body #ContentPlaceHolder_childAge' + c).val() == "" ? 0 : $('.popover-body #ContentPlaceHolder_childAge' + c).val());

        }
        var passengers = [adult, youth, child, senior, childAges];
        var Passengersids = ['#ContentPlaceHolder_hdnadult', '#ContentPlaceHolder_hdnyouth', '#ContentPlaceHolder_hdnchild', '#ContentPlaceHolder_hdnsenior', '#ContentPlaceHolder_hdnchildAges'];

        // store form value when popover closed
        $popover.on('hide.bs.popover', function () {

            $('#ContentPlaceHolder_btnSearch').show();
            if ($popover.data('bs.popover').tip) {
                var popoverElem = $popover.data('bs.popover').tip;
                //when hide popup
                $(".popover-body .number-spinner input", popoverElem).each(function (i) {

                    passengers[i] = $(this).val();
                    var chdAges = "";
                    if ($(this)[0].name.indexOf('child') >= 0) {
                        var chd = $(this).val();
                        if ($.trim(chd) != "") {
                            for (var a = 1; a <= chd; a++) {
                                if ($.trim($('#ContentPlaceHolder_hdndemisePopOver').val()) != "")
                                    $('.popover-body #ContentPlaceHolder_childAge' + a).val($.trim($('#ContentPlaceHolder_hdnchildAges').val()).split('!')[a - 1]);
                                if (a == 1)
                                    chdAges = $('.popover-body #ContentPlaceHolder_childAge' + a).val() == "" ? "" : $('.popover-body #ContentPlaceHolder_childAge' + a).val();
                                else
                                    chdAges += "," + ($('.popover-body #ContentPlaceHolder_childAge' + a).val() == "" ? "" : $('.popover-body #ContentPlaceHolder_childAge' + a).val());

                                $('.popover-body #ContentPlaceHolder_childAge' + a).show();
                                $('.popover-body #ContentPlaceHolder_childAge' + a).css("display", "inline");
                                //$('#ContentPlaceHolder_childAge' + (a + 1)).val(cAges.split('!')[a])

                            }
                            $('#ContentPlaceHolder_hdndemisePopOver').val('');

                        }
                        $('#ContentPlaceHolder_hdnchildAges').val(chdAges)
                        passengers[4] = chdAges;
                    }

                });
                ////////////////dont open it it will effect on railsearch.aspx pax selection
                ////var textbox = document.getElementById('passengers');
                ////if (passengers[1] == '')
                ////{
                ////    textbox.value = passengers[0] + ' Adult';
                ////    document.getElementById("ContentPlaceHolder_hdnAgeBands").value = passengers[0] + ' Adult';
                ////}
                ////else
                ////{
                ////    textbox.value = passengers[0] + ' Adult , ' + passengers[1] + 'Child';
                ////    document.getElementById("ContentPlaceHolder_hdnAgeBands").value = passengers[0] + ' Adult , ' + passengers[1] + ' Child';
                ////}

                ////$('#passengers').removeClass('highlight_error');

                ////// remove events
                $(popoverElem).off('click', '.number-spinner a');
                $(popoverElem).off('click', '.demise');
            }
        });

        $popover.on('inserted.bs.popover', function () {
            if ($popover.data('bs.popover').tip) {
                var popoverElem = $popover.data('bs.popover').tip;

                //when open  popup

                $('.popover-body .number-spinner input', popoverElem).each(function (i) {
                    $('#ContentPlaceHolder_btnSearch').hide();
                    $(this).val(passengers[i]);
                    if ($(this)[0].name.indexOf('child') >= 0) {
                        var cAges = $.trim($('#ContentPlaceHolder_hdnchildAges').val());//passengers[4];
                        if ($.trim(cAges) != "") {
                            if ($.trim(cAges).split('!').length > 0) {
                                for (var a = 0; a < cAges.split('!').length; a++) {
                                    $('.popover-body #ContentPlaceHolder_childAge' + (a + 1)).show();
                                    $('.popover-body #ContentPlaceHolder_childAge' + (a + 1)).css("display", "inline");
                                    $('.popover-body #ContentPlaceHolder_childAge' + (a + 1)).val(cAges.split('!')[a])
                                }
                            }
                        }

                    }
                });

                //when close by button popup
                $(popoverElem).on('click', '.demise', function () {
                    
                    $popover.popover('hide');
                    $('#ContentPlaceHolder_hdndemisePopOver').val('demise');
                    $('#ContentPlaceHolder_btnSearch').show();

                    //here putting data after closeing pax list
                    for (var p = 0; p < 4; p++) {
                        $(Passengersids[p]).val(passengers[p]);
                    }
                    $(Passengersids[4]).val(passengers[4])//specially for child age
                });

                // spinner(+-btn to change value) & total to parent input
                $(popoverElem).on('click', '.number-spinner a', function () {
                    
                    var btn = $(this),
                        input = btn.closest('.number-spinner').find('input'),
                        total = $('#ContentPlaceHolder_passengers', elem).val(),
                        oldValue = input.val().trim();
                    if (btn.attr('data-dir') == 'up') {
                        if (oldValue < input.attr('max')) {
                            oldValue++;
                            total++;
                            if (input[0].id == "ContentPlaceHolder_child") {
                                //$('#' + input[0].id + 'Age' + oldValue).val(oldValue);
                                $('.popover-body #' + input[0].id + 'Age' + oldValue).show();
                                $('.popover-body #' + input[0].id + 'Age' + oldValue).css("display", "inline");
                            }
                        }
                    } else {
                        if (oldValue > input.attr('min')) {
                            if (input[0].id == "ContentPlaceHolder_child") {
                                $('.popover-body #' + input[0].id + 'Age' + oldValue).val('');
                                $('.popover-body #' + input[0].id + 'Age' + oldValue).hide();
                            }
                            oldValue--;
                            total--;
                        }
                    }
                    $('#ContentPlaceHolder_passengers', elem).val(total);
                    input.val(oldValue);
                    //strPassengers += input.attr('id') + ":" + oldValue + ",";
                });
            }
            $('[data-toggle="tooltip"]').tooltip();
        });

    });
});

/* Radio btns */
(function ($) { $.fn.ezMark = function (options) { options = options || {}; var defaultOpt = { checkboxCls: options.checkboxCls || 'ez-checkbox', radioCls: options.radioCls || 'ez-radio', checkedCls: options.checkedCls || 'ez-checked', selectedCls: options.selectedCls || 'ez-selected', hideCls: 'ez-hide' }; return this.each(function () { var $this = $(this); var wrapTag = $this.attr('type') == 'checkbox' ? '<div class="' + defaultOpt.checkboxCls + '">' : '<div class="' + defaultOpt.radioCls + '">'; if ($this.attr('type') == 'checkbox') { $this.addClass(defaultOpt.hideCls).wrap(wrapTag).change(function () { if ($(this).is(':checked')) { $(this).parent().addClass(defaultOpt.checkedCls); } else { $(this).parent().removeClass(defaultOpt.checkedCls); } }); if ($this.is(':checked')) { $this.parent().addClass(defaultOpt.checkedCls); } } else if ($this.attr('type') == 'radio') { $this.addClass(defaultOpt.hideCls).wrap(wrapTag).change(function () { $('input[name="' + $(this).attr('name') + '"]').each(function () { if ($(this).is(':checked')) { $(this).parent().addClass(defaultOpt.selectedCls); } else { $(this).parent().removeClass(defaultOpt.selectedCls); } }); }); if ($this.is(':checked')) { $this.parent().addClass(defaultOpt.selectedCls); } } }); } })(jQuery);
$(function () {
    $('.ez_checkbox input[type="radio"]').ezMark();
    $('.ez_checkbox input[type="checkbox"]').ezMark({ checkboxCls: 'ez-checkbox', checkedCls: 'ez-checked-select' });
});