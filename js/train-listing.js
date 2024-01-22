$(function() {                       //run when the DOM is ready

    $('.more-fare').on('click', function() {
        $(this).toggleClass('_open');
        $(this).parent().children('.more-fare_details').slideToggle();
        $(this).parent().parent().siblings('.train-time-detail-container').slideUp();
        $('.more-details').removeClass('_open');
    });
    $('.more-details').on('click', function() {
        $('.more-details').toggleClass('_open');
        $(this).parent().parent().siblings('.train-time-detail-container').slideToggle();
        $(this).siblings('.more-fare_details').slideUp();
        $('.more-fare').removeClass('_open');
    });
    $('.tab_link1').on('click', function() {
        $(this).addClass('active');
        $('#tab_1').show();
        $('.tab_link2').removeClass('active');
        $('#tab_2').hide();
    });

    $('.tab_link2').on('click', function() {
        $(this).addClass('active');
        $('#tab_2').show();
        $('.tab_link1').removeClass('active');
        $('#tab_1').hide();
    });
});

// Old sticky div code removed
// $(document).scroll(function() {
//     var span = $('.booking-details_section'),
//         div = $('.booking-details_container'),
//         spanHeight = span.outerHeight(),
//         divHeight = div.height(),
//         spanOffset = span.offset().top + spanHeight,
//         divOffset = div.offset().top + divHeight;

//     if (spanOffset >= divOffset) {
//         span.addClass('booking-details_sectionBottom');
//             if($(window).width()>1400){    
//                 var windowScroll = $(window).scrollTop() + $(window).height()-50;
//                 if (spanOffset > windowScroll) {
//                     span.removeClass('booking-details_sectionBottom');
//                 }
//             }
//             if($(window).width()<1401){    
//                 var windowScroll = $(window).scrollTop() + $(window).height()+150;
//                 if (spanOffset > windowScroll) {
//                     span.removeClass('booking-details_sectionBottom');
//                 }
//             }          
//         }
// });

/**
 * train_listing-1 sticky sidebar: Change by Javed Starts
 */
$(document).ready(function () {

	var $sticky 		= $(".sticky");
	var $stickyrStopper = $(".sticky-stopper");
	
	if (!!$sticky.offset()) {
		// make sure ".sticky" element exists
		var generalSidebarHeight  = $sticky.innerHeight();
		var stickyTop 			  = $sticky.offset().top;
		var stickOffset 		  = 130;
        var stickyStopperPosition = $stickyrStopper.offset();//.top;
		var stopPoint 			  = stickyStopperPosition - generalSidebarHeight - stickOffset;
		var diff 				  = stopPoint + stickOffset;

		if ($(window).width() > 960) {
			$(window).scroll(function () {
				// scroll event
				var windowTop = $(window).scrollTop(); // returns number

				if (stopPoint < windowTop) {
					$sticky.css({
						position: "sticky",
						top: stickOffset,
					});
				} else if (stickyTop < windowTop + stickOffset) {
					$sticky.css({
						position: "sticky",
						top: stickOffset,
					});
				} else {
					$sticky.css({
						position: "sticky",
						top: stickOffset,
					});
				}
				
			});
		}
	}
});

// Enable "i" button fancybox on class selection
$(function() {

	$('.train-price-container input[type="radio"]').bind('click', function(){
			// Processing only those that match the name attribute of the currently clicked button...
			$('input[name="' + $(this).attr('name') + '"]').not($(this)).trigger('deselect'); // Every member of the current radio group except the clicked one...
	});


	$(".train-price-container input").change(function(e) {
		e.preventDefault();
		// find the nested "i" button
		if($(this).is(':checked')) {
			console.log('checked');
			$(this).parent().parent().addClass('enable');
		}

		$('.train-price-container input[type="radio"]').bind("deselect", function (event) {
			console.log("deselect");
			$(this).parent().parent().removeClass("enable");
		});
	})
	
});