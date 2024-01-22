
//$(function () {
//	$('.slider_D4, .slider_D3').on('setPosition', function () {
//	$(this).find('.slick-slide').height('auto');
//	var slickTrack = $(this).find('.slick-track');
//	var slickTrackHeight = $(slickTrack).height();
//	$(this).find('.slick-slide').css('height', slickTrackHeight + 'px');
//	});
//})

$(".slider_D4").slick({slidesToShow:4,slidesToScroll:1,dots:!0,arrows:!0,speed:500,infinite:false,autoplay:false, 
	responsive: [{breakpoint:1100,settings:{slidesToShow:3,slidesToScroll:3}},
    			{breakpoint:850,settings:{slidesToShow:2,slidesToScroll:2}},
    			{breakpoint:600,settings:{slidesToShow:1,slidesToScroll:1,arrows:!1,centerMode:true,centerPadding:'10px',infinite:true}}]
});
$(".slider_D44").slick({slidesToShow:4,slidesToScroll:1,dots:!0,arrows:!0,speed:500,infinite:false,autoplay:false, 
	responsive: [{breakpoint:1100,settings:{slidesToShow:3,slidesToScroll:3}},
    			{breakpoint:850,settings:{slidesToShow:2,slidesToScroll:2}},
    			{breakpoint:600,settings:{slidesToShow:1,slidesToScroll:1,arrows:!1,centerMode:true,centerPadding:'10px',infinite:true}}]
});
$(".slider_D3").slick({slidesToShow:1,slidesToScroll:1,dots:!1,arrows:!0,speed:500,infinite:false,
    responsive: [{breakpoint:850,settings:{slidesToShow:2,slidesToScroll:1}},
    			{breakpoint:600,settings:{slidesToShow:1,slidesToScroll:1,arrows:!1,centerMode:true,centerPadding:'10px',infinite:true}}]
});

$(".slider_Destinations").slick({slidesToShow:1,slidesToScroll:1,dots:!1,arrows:!0,speed:500,infinite:false,rows:2,slidesPerRow:4,
    responsive: [{breakpoint:992,settings:{slidesPerRow:3}},
    			{breakpoint:767,settings:{slidesPerRow:2}},
    			{breakpoint:600,settings:{slidesPerRow:2,arrows:!1,centerMode:true,centerPadding:'10px',infinite:!1}}]
});
$(".slider_D33").slick({slidesToShow:1,slidesToScroll:1,dots:!0,arrows:!1,speed:1500,infinite:false,autoplay:true,
    responsive: [{breakpoint:850,settings:{slidesToShow:2,slidesToScroll:1}},
    			{breakpoint:600,settings:{slidesToShow:1,slidesToScroll:1,arrows:!1,centerMode:true,centerPadding:'10px',infinite:true}}]
});
equalheight=function(t){var i,e=0,h=0,r=new Array;$(t).each(function(){if(i=$(this),$(i).height("auto"),topPostion=i.position().top,h!=topPostion){for(currentDiv=0;currentDiv<r.length;currentDiv++)r[currentDiv].height(e);r.length=0,h=topPostion,e=i.height(),r.push(i)}else r.push(i),e=e<i.height()?i.height():e;for(currentDiv=0;currentDiv<r.length;currentDiv++)r[currentDiv].height(e)})};

//$(window).load(function() {equalheight('.section_D5 > div');});	
//$(window).resize(function(){equalheight('.section_D5 > div');});