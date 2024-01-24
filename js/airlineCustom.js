$(document).ready(function () {
  
  //menu toggle for mobile 
  const $dropdown = $(".sw-navbar .dropdown");
            const $dropdownToggle = $(".sw-navbar .dropdown-toggle");
            const $dropdownMenu = $(".sw-navbar .dropdown-menu");
            const showClass = "show";
        
            $(window).on("load resize", function() {
              if (this.matchMedia("(min-width: 768px)").matches) {
                $dropdown.hover(
                  function() {
                    const $this = $(this);
                    $this.addClass(showClass);
                    $this.find($dropdownToggle).attr("aria-expanded", "true");
                    $this.find($dropdownMenu).addClass(showClass);
                  },
                  function() {
                    const $this = $(this);
                    $this.removeClass(showClass);
                    $this.find($dropdownToggle).attr("aria-expanded", "false");
                    $this.find($dropdownMenu).removeClass(showClass);
                  }
                );
              } else {
                $dropdown.off("mouseenter mouseleave");
              }
            });
        
             document.addEventListener('click',function(e){
             // Hamburger menu
             if(e.target.classList.contains('hamburger-toggle')){
               e.target.children[0].classList.toggle('active');
             }
           })  ;
           $('.sw-navbar .nav-item a').on('click', function(event) {
              $('.sw-navbar .nav-item a.active').removeClass('active');
              $(this).addClass('active');
           });
          $('.nav-item.dropdown a').click(function(){
            $(this).parents(".nav-item.dropdown").addClass("active");
            $(".sw-navbar .nav-item").addClass("hidemenu");
          });

        
        $('.rmm-back').click(function(){
          $(this).closest(".nav-item").removeClass('active');
          $(".navbar-collapse .nav-item").removeClass("hidemenu");
          $(this).closest(".nav-item").removeClass('show');
          $(".navbar-collapse .nav-item a").removeClass("show");
         
          console.log($(".navbar-collapse .nav-item"));
        });

       $(".submenu2 h5").click(function(){
          $('.submenu2-content').addClass('show');
         
        });
        $(".submenu3 h5").click(function(){
          $('.submenu3-content').addClass('show');
         
        });
        $(".submenu4 h5").click(function(){
          $('.submenu4-content').addClass('show');
         
        });
    
        $(".one-country-pass").click(function(){
          $('.eurail-pass').addClass('show');
         
        });
      
        $(".s3-back").click(function(){
          $('.submenu3-content').removeClass('show');
          $('.submenu4-content').removeClass('show');
        
           console.log();
        });
        $(".s2back").click(function(){
          $('.submenu2-content').removeClass('show');
          $('.eurail-pass').removeClass('show');
        });
     
  //tooltip
           var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
           var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
             return new bootstrap.Tooltip(tooltipTriggerEl)
           })
           
  //view all 
   // Set the number of initially visible items
   var visibleItems = 3;
   $('.sw-navbar .mega-content .list-group a:lt(' + visibleItems + ')').removeClass('hidden');
    $('#viewAllButton').on('click', function() {
    $('.sw-navbar .mega-content .list-group a.hidden').removeClass('hidden');
    $(this).hide();
   });

  //popover 
  const list = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'))
  list.map((el) => {
    let opts = {
      animation: false,
    }
    if (el.hasAttribute('data-bs-content-id')) {
      opts.content = document.getElementById(el.getAttribute('data-bs-content-id')).innerHTML;
      opts.html = true;
     
    }
    new bootstrap.Popover(el, opts);
  })

//department and arrival datepicker
$('#departuretime').datetimepicker({
    language: 'en', 
    weekStart: 1, 
    todayBtn: 0, 
    autoclose: 1, 
    startView: 2,
    forceParse: 0, 
    minView: 2, 
    format: 'dd M yyyy', 
    pickerPosition: 'bottom-left'
  
});
$('#Selectiondate,#EpassSelectiondate').datetimepicker({
  language: 'en', 
  weekStart: 1, 
  todayBtn: 0, 
  autoclose: 1, 
  startView: 2,
  forceParse: 0, 
  minView: 2, 
  format: 'dd M yyyy', 
  pickerPosition: 'bottom-right'

});
$('#ESelectiondate').datetimepicker({
  language: 'en', 
  weekStart: 1, 
  todayBtn: 0, 
  autoclose: 1, 
  startView: 2,
  forceParse: 0, 
  minView: 2, 
  format: 'dd M yyyy', 
  pickerPosition: 'bottom-right'

});
$('#arrivaltime').datetimepicker({
    language: 'en', 
    weekStart: 1, 
    todayBtn: 0, 
    autoclose: 1, 
    startView: 2,
    forceParse: 0, 
    minView: 2, 
    format: 'dd M yyyy', 
    pickerPosition: 'bottom-left'
  
});


//department from and return datepicker
$('#department-todate').datetimepicker({
    language: 'en', 
        weekStart: 1, 
        todayBtn: 0, 
        autoclose: 1, 
        startView: 2,
        forceParse: 0, 
        minView: 2, 
        format: 'dd M yyyy', 
        pickerPosition: 'bottom-left'
       
});
    $('#department-formdate').datetimepicker({ 
        language: 'en', 
        weekStart: 1, 
        todayBtn: 0, 
        autoclose: 1, 
        startView: 2,
        forceParse: 0, 
        minView: 2, 
        format: 'dd M yyyy', 
        pickerPosition: 'bottom-left' 
});


//add and remove div on checked input
$('#nextarrival-time').change(function () {
   if (this.checked) {
   $('.nextday-arriavaldiv').show();
    } else {
   $('.nextday-arriavaldiv').hide();
    }
});
//pagination
$(".passenger-details ul.pagination li a").click(function () {
  $(this).closest('ul').find('li a').removeClass("active");
  $(this).addClass('active'); 
});


//ui.autocomplete suggestion
$.ui.autocomplete.prototype._renderItem = function (ul , item) {

    var re = new RegExp("(?![^&;]+;)(?!<[^<>]*)(" + $.ui.autocomplete.escapeRegex(this.term) + ")(?![^<>]*>)(?![^&;]+;)", "gi");
    //var t = item.label.replace(re, "<b>" + this.term + "</b>");
    if (item.city != null && item.city != "") {
        var t = item.city.replace(re, "<u><strong>$1</strong></u>");
        return $("<li></li>")
            .data("item.autocomplete", item)
            .append("<div><span style='font-size:90%;float:left;width:60%;color:rgba(11 11 11 /1);' class='img-icon'>" + t + ",</span><span style='color:rgba(11 11 11 / 50%);font-size:75%;float:right;width:20%'>" + item.city + "</span></div>")
            .appendTo(ul);
    }
    else if (item.label != null && item.label != "") {
        var t = item.label.replace(re, "<u><strong>$1</strong></u>");

        return $("<li></li>")
            .data("item.autocomplete", item)
            .append("<div><span style='font-size:90%;float:left;width:60%'>" + t + "</span>, <span style='color:rgba(11 11 11 / 1);font-size:75%;font-weight:400;float:right;width:20%'>" + item.city + "</span></div>")
            .appendTo(ul);
    }
    else {
        return $("<li></li>")
            .data("item.autocomplete", item)
            .append("<div><span style='color:rgba(11 11 11 / 50%);font-size:75%;font-weight:400'>" + item.country + "</span></div>")
            .appendTo(ul);
    }

};

$('.ui-autocomplete').css('max-height', '158px');
$('.ui-autocomplete').css('height', 'auto');

//department start and date ui datpicker

$('#deptStart').datepicker({
  numberOfMonths: 2,
  startDate: new Date(),
  my: 'left top',
  at: 'left bottom',
  dateFormat: 'D,dd/mm',
  collision: 'flipfit'
}).on('changeDate', function() {
  // After selecting a date, destroy the datepicker and reinitialize without startDate
  $(this).datepicker('destroy').datepicker({
    numberOfMonths: 2,
    my: 'left top',
    at: 'left bottom',
    dateFormat: 'D,dd/mm',
    collision: 'flipfit'
  });
});

// Initialize datepicker for #deptEnd
$('#deptStart').datepicker({
  numberOfMonths: 2,
  startDate: new Date(),
  my: 'left top',
  at: 'left bottom',
  dateFormat: 'D, dd/mm',
  collision: 'flipfit'
}).on('changeDate', function() {
  // Get the selected start date
  var startDate = $(this).datepicker('getDate');

  // Update the startDate option for #deptEnd based on the selected start date
  $('#deptEnd').datepicker('setStartDate', startDate).datepicker('update', startDate);
});

// Initialize datepicker for #deptEnd
$('#deptEnd').datepicker({
  numberOfMonths: 2,
  my: 'left top',
  at: 'left bottom',
  dateFormat: 'D, dd/mm',
  collision: 'flipfit'
});

  $.extend($.datepicker,{_checkOffset:function(inst,offset,isFixed){return offset}});



//navbar-toggler
  $('.sw-navbar .navbar-toggler').click (function(){
    $(this).toggleClass('open');
    $('sw-navbar .navbar-collapse').toggleClass('show');
   
  });

//add new div
  function HideSeekFun()
  {
   $('#multi-Citytab>.mcDiv').each(function(index) {
    
     if($( this ).hasClass('d-none'))
     {
      $( this ).toggleClass('d-none');
      return false;
     }
    });
  }

var count = 0;

    // Function to add a new div
    function addDiv() {
      count++;
      var newDiv = $('<div class="box">Div ' + count + ' <span class="close-btn">Close</span></div>');

      // Add click event for close button
      newDiv.find('.close-btn').click(function() {
        newDiv.remove();
        updateCloseButtons();
      });

      $('#output').append(newDiv);
      updateCloseButtons();
    }

    // Function to update the visibility of close buttons
    function updateCloseButtons() {
      $('.box .close-btn').hide();
      $('.box:last-child .close-btn').show();
    }

    // Click event for the "Add Div" button
    $('#addBtn').click(function() {
      addDiv();
    });
 //slider ranger2

 $("#slider-range2").slider({
  range: true, 
  min: 0,
  max: 3500,
  step: 50,
  slide: function( event, ui ) {
    $( "#min-price").html(ui.values[ 0 ]);
    
    console.log(ui.values[0])
    
    suffix = '';
    if (ui.values[ 1 ] == $( "#max-price").data('max') ){
       suffix = ' +';
    }
    $( "#max-price").html(ui.values[ 1 ] + suffix);         
  }
})

//on click toggle div
$('.diffplanes').click(function(){
  // var link = $(this);
  // $(this).closest(".sw-booknowcard").find('.bookcard-rowbottom').show();
  $(this).closest(".sw-booknowcard").find('.bookcard-rowbottom').show();
    
  });
      
//Viewdetails-btn

$('#Viewdetails-btn').click(function(){
  var link = $(this);
  $('#bookcardcheckinadd').slideToggle('slow', function() {
  
      if ($(this).is(":visible")) {
           link.text('Hide Details');                
      } else {
           link.text('View Details');                
      }        
  });
  });

$('#Viewdetails-btn2').click(function(){
  
  var link = $(this);
  $('#bookcardcheckinadd2').slideToggle('slow', function() {
      if ($(this).is(":visible")) {
           link.text('Hide Details');                
      } else {
           link.text('View Details');                
      }        
  });
  
  });

$('#Viewdetails-btn3').click(function(){
  
  var link = $(this);
  $('#bookcardcheckinadd3').slideToggle('slow', function() {
      if ($(this).is(":visible")) {
           link.text('Hide Details');                
      } else {
           link.text('View Details');                
      }        
  });
 });

$('#Viewdetails-btn4').click(function(){
  
  var link = $(this);
  $('#bookcardcheckinadd4').slideToggle('slow', function() {
      if ($(this).is(":visible")) {
           link.text('Hide Details');                
      } else {
           link.text('View Details');                
      }        
  });
  
      
});
//filtermobilepoupbtn

$("#filtermobilepoupbtn").click(function () {
  $("#filtermobilepoup").toggle();
});


//CloseBtn 
$("#Closelist1").click(function () {
  $("#ancillary-seat").css({"display": "none", "margin": "0px"});
  
});
$("#Closelist2").click(function () {
  $("#ancillary-Express").css({"display": "none", "margin": "0px"});
});
$("#Closelist3").click(function () {
  $("#ancillary-lounge").css({"display": "none", "margin": "0px"});
});

//fightRemoveBtn
$("#fightRemoveBtn").click(function () {
  $("#ancillarycard-content").hide();
  
});


//counter input
const inputNumber = $("input[type='number']");
inputNumber.wrap("<div class=\"quantity-number\"></div>");

$('<button type="button" class="minus-button">-</button>').insertBefore("input[type='number']");
$('<button type="button" class="plus-button">+</button></div>').insertAfter("input[type='number']");

// Functions on each button
const minusButton = $(".minus-button");
const plusButton = $(".plus-button");

minusButton.each(function (index) {
  $(this).on("click", function (evt) {
	  let inputNumber = $(evt.target).next("input[type='number']");
		inputNumber[0].stepDown();
		inputNumber.change();
	})
});

plusButton.each(function (index) {
	$(this).on("click", function (evt) {
    let inputNumber = $(evt.target).prev("input[type='number']");
		inputNumber[0].stepUp();
		inputNumber.change();
	})
});


//add  Ancillary Service
$("#ServiceSeatselection").click(function () {
  $("#seatselectService").show('show');
  $('.ancillaryTopSelection').hide();
});
$("#Serviceexpress").click(function () {
  $("#expressService").show('show');
  $('.ancillaryTopSelection').hide();
});

$("#Servicelounge").click(function () {
  $("#loungeService").show('show');
  $('.ancillaryTopSelection').hide();
});
$("#Servicemeal").click(function () {
  $("#mealService").show('show');
  $('.ancillaryTopSelection').hide();
});
$("#Serviceassistance").click(function () {
  $("#sAssistanceService").show('show');
  $('.ancillaryTopSelection').hide();
});


//cartright mobile toggle
var windowWidth=$(document).innerWidth();
$("#cartContinue").click(function () {
  if (window.matchMedia('screen and (max-width: 990px)').matches) {
    $("#mb-cartright").toggle('slow');
  }
});

//swissPassDate  datetimepicker
$('#swissPassDate').datetimepicker({
  language: 'en', 
  weekStart: 0, 
  todayBtn: 0, 
  autoclose: 1, 
  startView: 2,
  forceParse: 0, 
  minView: 2, 
  format: 'dd M yyyy', 
  pickerPosition: 'bottom-right'

});

//TopSwissTravelPass buy now toggle btn
$("#BuyNowSwPass").click(function () {
    $(".divSwissTravelpass").toggle('fade');
   });


//divSwissTravelpass ViewSummarybtn toggle
$(".ViewSummarybtn").click(function () {
  $(this).toggleClass('arrow-up');
  $(".ViewSummaryContent").toggle('fade');
 });

//my cart toogle button 
 //adult-youth

$(".adultPass").click(function () {
  $(".adultpassfare").show();
  $(".youthpassfare").hide();
 });

 $(".youthpass").click(function () {
  $(".youthpassfare").show();
  $(".adultpassfare").hide();
 });

//class and pass toggle
 $(".SecondPassbtn").click(function () {
  if($('.continuepassbtn').is(':checked')) {
          $(this).attr('checked', false)    
          $(".continueFirstclass").hide();           
          $(".continueSecondclass").show(); 
          $(".fexiFirstclass").hide();
          $(".fexiSecondclass").hide();        
      } 
      else {
        $(this).attr('checked', false)    
        $(".continueFirstclass").hide();           
        $(".continueSecondclass").hide(); 
        $(".fexiFirstclass").hide();
        $(".fexiSecondclass").show();        
    }       
});

$(".firstPassbtn").click(function () {
  if($('.continuepassbtn').is(':checked')) {
              $(this).attr('checked', false)             
              $(".continueFirstclass").show();
              $(".continueSecondclass").hide();  
              $(".fexiFirstclass").hide();
              $(".fexiSecondclass").hide();           
          }   
          else {
            $(this).attr('checked', false)    
            $(".continueFirstclass").hide();           
            $(".continueSecondclass").hide(); 
            $(".fexiFirstclass").show();
            $(".fexiSecondclass").hide();        
        }         
 });

 $(".fexipassbtn").click(function () {
  if($('.firstPassbtn').is(':checked')) {
              $(this).attr('checked', false)            
              $(".fexiFirstclass").show();
              $(".fexiSecondclass").hide();  
              $(".continueFirstclass").hide();
              $(".continueSecondclass").hide();             
          }     
          else{
            $(".fexiFirstclass").hide();
              $(".fexiSecondclass").show();  
              $(".continueFirstclass").hide();
              $(".continueSecondclass").hide(); 
          } 
 });


$(".continuepassbtn").click(function () {
  if($('.firstPassbtn').is(':checked')) {
    $(this).attr('checked', false)
    
    $(".fexiFirstclass").hide();
    $(".fexiSecondclass").hide();  
    $(".continueFirstclass").show();
    $(".continueSecondclass").hide();             
}     
else{
  $(".fexiFirstclass").hide();
    $(".fexiSecondclass").hide();  
    $(".continueFirstclass").hide();
    $(".continueSecondclass").show(); 
}     

});
//
$(".nstp_aboutBox .more").click(function () {

  $(this).parents(".nstp_aboutBox").toggleClass("expand");
  $(this).fadeOut(function () {
      $(this).text(($(this).text() == 'Read more') ? 'Read less' : 'Read more').fadeIn();
  })
  $(this).click(function () { return $("html,body").animate({ scrollTop: $(this).parents(".nstpAbout").offset().top - 150 }, 300), !1 })
});

//faq accordiance close after next open
$('.accordion-button').click(function() {
  var target = $($(this).data('bs-target'));
  $('.accordion-collapse').not(target).collapse('hide');
});



$('.sw-hwTable.hwTable').slick({
  slidesToShow: 4, slidesToScroll: 4, infinite: false, speed: 1000, cssEase: 'ease-in-out', dots: false, arrows: false,
  responsive: [{ breakpoint: 1280, settings: { slidesToShow: 3, slidesToScroll: 3, dots: true } }, { breakpoint: 1080, settings: { slidesToShow: 2, slidesToScroll: 2, dots: true } }, { breakpoint: 767, settings: { slidesToShow: 1, slidesToScroll: 1, dots: true } },
  { breakpoint: 767, settings: { slidesToShow: 1, slidesToScroll: 1, dots: true } }
  ]
});
$(".sw-comboOfferSlider").slick({slidesToShow:3,slidesToScroll:1,dots:!1,arrows:!0,speed:500,infinite:false,
  responsive: [{breakpoint:850,settings:{slidesToShow:2,slidesToScroll:1}},
        {breakpoint:600,settings:{slidesToShow:1,slidesToScroll:1,arrows:!0,centerMode:true,centerPadding:'20px',infinite:true}}]
});
$(".fightticketslider").slick({slidesToShow:3,slidesToScroll:1,dots:!1,arrows:!0,speed:500,infinite:false,
  responsive: [{breakpoint:850,settings:{slidesToShow:2,slidesToScroll:1}},
        {breakpoint:600,settings:{slidesToShow:1.06,slidesToScroll:1,dots:!0,arrows:!1,centerMode:true,centerPadding:'10px',infinite:true}}]
});

$(".sw-guideDaySlider").slick({slidesToShow:3.5,slidesToScroll:1,dots:!1,arrows:!0,speed:500,infinite:false,autoplay:false,centerPadding: '0px', centerMode: false,
  responsive: [{breakpoint:850,settings:{slidesToShow:2.8,slidesToScroll:1}},
    {breakpoint:600,settings:{slidesToShow:1.6,slidesToScroll:1,dots:!0,arrows:!1}}]
});



/*3d slick recommanded slider*/
var rev = $('.rev_slider');
rev.on('init', function(event, slick, currentSlide) {
  var
    cur = $(slick.$slides[slick.currentSlide]),
    next = cur.next(),
    next2 = cur.next().next(),
    prev = cur.prev(),
    prev2 = cur.prev().prev();
  prev.addClass('slick-sprev');
  next.addClass('slick-snext');  
  prev2.addClass('slick-sprev2');
  next2.addClass('slick-snext2');  
  cur.removeClass('slick-snext').removeClass('slick-sprev').removeClass('slick-snext2').removeClass('slick-sprev2');
  slick.$prev = prev;
  slick.$next = next;
}).on('beforeChange', function(event, slick, currentSlide, nextSlide) {
  console.log('beforeChange');
  var
    cur = $(slick.$slides[nextSlide]);
  console.log(slick.$prev, slick.$next);
  slick.$prev.removeClass('slick-sprev');
  slick.$next.removeClass('slick-snext');
  slick.$prev.prev().removeClass('slick-sprev2');
  slick.$next.next().removeClass('slick-snext2');
  next = cur.next(),  
  prev = cur.prev();
  //prev2.prev().prev();
  //next2.next().next();
  prev.addClass('slick-sprev');
  next.addClass('slick-snext');
  prev.prev().addClass('slick-sprev2');
  next.next().addClass('slick-snext2');
  slick.$prev = prev;
  slick.$next = next;
  cur.removeClass('slick-next').removeClass('slick-sprev').removeClass('slick-next2').removeClass('slick-sprev2');
});

rev.slick({
  speed: 1000,
  arrows: true,
  dots: true,
  focusOnSelect: true,
  prevArrow: '<a class="slick-prev"> prev</a>',
  nextArrow: '<a class="slick-next"> next</a>',
  infinite: true,
  centerMode: true,
  slidesPerRow: 1,
  slidesToShow: 1,
  slidesToScroll: 1,
  centerPadding: '0',
  swipe: true,
  customPaging: function(slider, i) {
    return '';
  },
  
  /*infinite: false,*/
});
//selection popup for responsive
$('#selectionModal').on('click', function() {
  $('.right-seletdiv').css({"display":"block"});

});
$('.stickyContent .btn-close').on('click', function() {
  $('.right-seletdiv').css({"display":"none"});
});


});



  