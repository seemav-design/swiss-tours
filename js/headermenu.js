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

       $(".submenu2 .submenutitle").click(function(){
          $('.submenu2-content').toggleClass('show');
        });
      
        $(".submenu3 .submenutitle").click(function(){
          $('.submenu3-content').addClass('show');
         
        });
        $(".submenu4 .submenutitle").click(function(){
          $('.submenu4-content').addClass('show');
        });
        $(".submenu5 .submenutitle").click(function(){
          $('.submenu5-content').addClass('show');
        });
        $(".one-country-pass").click(function(){
          $('.eurail-pass').addClass('show');
         
        });
      
        $(".s3-back").click(function(){
          $('.submenu3-content').removeClass('show');
          $('.submenu4-content').removeClass('show');
          $('.submenu5-content').removeClass('show');
        
           console.log();
        });
        $(".s2back").click(function(){
          $('.submenu2-content').removeClass('show');
          $('.submenu3-content').removeClass('show');
          $('.submenu5-content').removeClass('show');
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
});



  