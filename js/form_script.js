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
            // title: '<?= lang("Select passengers");?><a class="close demise");">×</a>',
            content: function () {
                return $(this).parent().find('.content').html();
            }
        });


        // open popover & inital value in form     
        //passengers = [0,0,0,0] //adult,youth,child,senior
        var adult = 0, youth = 0, child = 0, senior = 0;
        adult = $('#ContentPlaceHolder_adult').val() == "" ? 0 : $('#ContentPlaceHolder_adult').val();
        youth = $('#ContentPlaceHolder_youth').val() == "" ? 0 : $('#ContentPlaceHolder_youth').val();
        child = $('#ContentPlaceHolder_child').val() == "" ? 0 : $('#ContentPlaceHolder_child').val();
        senior = $('#ContentPlaceHolder_senior').val() == "" ? 0 : $('#ContentPlaceHolder_senior').val();
        var passengers = [adult, youth, child, senior];
        var Passengersids = ['#ContentPlaceHolder_hdnadult', '#ContentPlaceHolder_hdnyouth', '#ContentPlaceHolder_hdnchild', '#ContentPlaceHolder_hdnsenior'];

        // store form value when popover closed
        $popover.on('hide.bs.popover', function () {
            
            if ($popover.data('bs.popover').$tip && $popover.data('bs.popover').$tip[0]) {
                var popoverElem = $popover.data('bs.popover').$tip[0];

                $(".popover-content input", popoverElem).each(function (i) {
                    
                    passengers[i] = $(this).val();
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
            
            if ($popover.data('bs.popover').$tip && $popover.data('bs.popover').$tip[0]) {
                var popoverElem = $popover.data('bs.popover').$tip[0];

                $('input', popoverElem).each(function (i) {
                    
                    $(this).val(passengers[i]);
                });

                $(popoverElem).on('click', '.demise', function () {
                    $popover.popover('hide');
                    
                    //here putting data after closeing pax list
                    for (var p = 0; p < passengers.length; p++) {
                        $(Passengersids[p]).val(passengers[p]);
                    }
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
                        }
                    } else {
                        if (oldValue > input.attr('min')) {
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