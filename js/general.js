/* Main Menus JS */

jQuery(document).ready(function ($) {
    var MqL = 1200;
    moveNavigation();
    $(window).on('resize', function () {
        (!window.requestAnimationFrame) ? setTimeout(moveNavigation, 300) : window.requestAnimationFrame(moveNavigation);
    });

    //mobile - open lateral menu clicking on the menu icon
    $('.cd-nav-trigger').on('click', function (event) {
        event.preventDefault();
        if ($('.cd-main-content').hasClass('nav-is-visible')) {
            closeNav();
            $('.cd-overlay').removeClass('is-visible');
        } else {
            $(this).addClass('nav-is-visible');
            $('.cd-primary-nav').addClass('nav-is-visible');
            $('.cd-main-header').addClass('nav-is-visible');
            $('.cd-main-content').addClass('nav-is-visible').one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function () {
                $('body').addClass('overflow-hidden');
            });
            toggleSearch('close');
            $('.cd-overlay').addClass('is-visible');
        }
    });

    //open search form
    $('.cd-search-trigger').on('click', function (event) {
        event.preventDefault();
        toggleSearch();
        closeNav();
    });

    //close lateral menu on mobile 
    $('.cd-overlay').on('swiperight', function () {
        if ($('.cd-primary-nav').hasClass('nav-is-visible')) {
            closeNav();
            $('.cd-overlay').removeClass('is-visible');
        }
    });
    $('.nav-on-left .cd-overlay').on('swipeleft', function () {
        if ($('.cd-primary-nav').hasClass('nav-is-visible')) {
            closeNav();
            $('.cd-overlay').removeClass('is-visible');
        }
    });

    if ($(window).width() <= MqL) {
        $('.cd-overlay').on('click', function () {
            closeNav();
            toggleSearch('close')
            $('.cd-overlay').removeClass('is-visible');
        });
    } else {
        $('.cd-overlay').on('mouseover', function () {
            closeNav();
            toggleSearch('close')
            $('.cd-overlay').removeClass('is-visible');
        });
    }


    //prevent default clicking on direct children of .cd-primary-nav 
    $('.cd-primary-nav').children('.has-children').children('a').on('click', function (event) {
        event.preventDefault();
    });
    //open submenu

    if ($(window).width() <= MqL) {

        $('.has-children').children('a').on('click', function (event) {
            if (!checkWindowWidth()) event.preventDefault();
            var selected = $(this);
            if (selected.next('ul').hasClass('is-hidden')) {
                //desktop version only
                selected.addClass('selected').next('ul').removeClass('is-hidden').end().parent('.has-children').parent('ul').addClass('moves-out');
                selected.parent('.has-children').siblings('.has-children').children('ul').addClass('is-hidden').end().children('a').removeClass('selected');
                $('.cd-overlay').addClass('is-visible');
            } else {
                selected.removeClass('selected').next('ul').addClass('is-hidden').end().parent('.has-children').parent('ul').removeClass('moves-out');
                $('.cd-overlay').removeClass('is-visible');
            }
            toggleSearch('close');
        });

    } else {

        $('.has-children').on('mouseover', function (event) {
            //			if( !checkWindowWidth() ) event.preventDefault();
            var selected = $(this).children('a');
            if (selected.next('ul').hasClass('is-hidden')) {
                //desktop version only
                selected.addClass('selected').next('ul').removeClass('is-hidden').end().parent('.has-children').parent('ul').addClass('moves-out');
                selected.parent('.has-children').siblings('.has-children').children('ul').addClass('is-hidden').end().children('a').removeClass('selected');
                $('.cd-overlay').addClass('is-visible');
            }
            toggleSearch('close');
        });

        $('.has-children').on('mouseout', function (event) {
            //			if( !checkWindowWidth() ) event.preventDefault();
            var selected = $(this).children('a');
            {
                selected.removeClass('selected').next('ul').addClass('is-hidden').end().parent('.has-children').parent('ul').removeClass('moves-out');
                $('.cd-overlay').removeClass('is-visible');
            }
            toggleSearch('close');
        });

    }

    //submenu items - go back link
    $('.go-back').on('click', function () {
        $(this).parent('ul').addClass('is-hidden').parent('.has-children').parent('ul').removeClass('moves-out');
    });

    function closeNav() {
        $('.cd-nav-trigger').removeClass('nav-is-visible');
        $('.cd-main-header').removeClass('nav-is-visible');
        $('.cd-primary-nav').removeClass('nav-is-visible');
        $('.has-children ul').addClass('is-hidden');
        $('.has-children a').removeClass('selected');
        $('.moves-out').removeClass('moves-out');
        $('.cd-main-content').removeClass('nav-is-visible').one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function () {
            $('body').removeClass('overflow-hidden');
        });
    }

    function toggleSearch(type) {
        if (type == "close") {
            //close serach 
            $('.cd-search').removeClass('is-visible');
            $('.cd-search-trigger').removeClass('search-is-visible');
            $('.cd-overlay').removeClass('search-is-visible');
        } else {
            //toggle search visibility
            $('.cd-search').toggleClass('is-visible');
            $('.cd-search-trigger').toggleClass('search-is-visible');
            $('.cd-overlay').toggleClass('search-is-visible');
            if ($(window).width() > MqL && $('.cd-search').hasClass('is-visible')) $('.cd-search').find('input[type="search"]').focus();
            ($('.cd-search').hasClass('is-visible')) ? $('.cd-overlay').addClass('is-visible') : $('.cd-overlay').removeClass('is-visible');
        }
    }

    function checkWindowWidth() {
        //check window width (scrollbar included)
        var e = window,
            a = 'inner';
        if (!('innerWidth' in window)) {
            a = 'client';
            e = document.documentElement || document.body;
        }
        if (e[a + 'Width'] >= MqL) {
            return true;
        } else {
            return false;
        }
    }

    function moveNavigation() {
        var navigation = $('.cd-nav');
        var desktop = checkWindowWidth();
        if (desktop) {
            navigation.detach();
            navigation.insertBefore('.cd-header-buttons');
        } else {
            navigation.detach();
            navigation.insertAfter('.cd-main-content');
        }
    }
});






/*jQuery(document).ready(function($){var MqL=1200;moveNavigation();$(window).on('resize',function(){(!window.requestAnimationFrame)?setTimeout(moveNavigation,300):window.requestAnimationFrame(moveNavigation);});$('.cd-nav-trigger').on('click',function(event){event.preventDefault();if($('.cd-main-content').hasClass('nav-is-visible')){closeNav();$('.cd-overlay').removeClass('is-visible');}else{$(this).addClass('nav-is-visible');$('.cd-primary-nav').addClass('nav-is-visible');$('.cd-main-header').addClass('nav-is-visible');$('.cd-main-content').addClass('nav-is-visible').one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend',function(){$('body').addClass('overflow-hidden');});toggleSearch('close');$('.cd-overlay').addClass('is-visible');}});$('.cd-search-trigger').on('click',function(event){event.preventDefault();toggleSearch();closeNav();});$('.cd-overlay').on('swiperight',function(){if($('.cd-primary-nav').hasClass('nav-is-visible')){closeNav();$('.cd-overlay').removeClass('is-visible');}});$('.nav-on-left .cd-overlay').on('swipeleft',function(){if($('.cd-primary-nav').hasClass('nav-is-visible')){closeNav();$('.cd-overlay').removeClass('is-visible');}});$('.cd-overlay').on('click',function(){closeNav();toggleSearch('close')
$('.cd-overlay').removeClass('is-visible');});$('.cd-primary-nav').children('.has-children').children('a').on('click',function(event){event.preventDefault();});$('.has-children').on('mouseover',function(event){if(!checkWindowWidth())event.preventDefault();var selected=$(this).children('a');if(selected.next('ul').hasClass('is-hidden')){selected.addClass('selected').next('ul').removeClass('is-hidden').end().parent('.has-children').parent('ul').addClass('moves-out');selected.parent('.has-children').siblings('.has-children').children('ul').addClass('is-hidden').end().children('a').removeClass('selected');$('.cd-overlay').addClass('is-visible');}else{selected.removeClass('selected').next('ul').addClass('is-hidden').end().parent('.has-children').parent('ul').removeClass('moves-out');$('.cd-overlay').removeClass('is-visible');}toggleSearch('close');});$('.has-children').on('mouseout',function(event){var selected=$(this).children('a');selected.removeClass('selected').next('ul').addClass('is-hidden').end().parent('.has-children').parent('ul').removeClass('moves-out');$('.cd-overlay').removeClass('is-visible');});$('.go-back').on('click',function(){$(this).parent('ul').addClass('is-hidden').parent('.has-children').parent('ul').removeClass('moves-out');});function closeNav(){$('.cd-nav-trigger').removeClass('nav-is-visible');$('.cd-main-header').removeClass('nav-is-visible');$('.cd-primary-nav').removeClass('nav-is-visible');$('.has-children ul').addClass('is-hidden');$('.has-children a').removeClass('selected');$('.moves-out').removeClass('moves-out');$('.cd-main-content').removeClass('nav-is-visible').one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend',function(){$('body').removeClass('overflow-hidden');});}function toggleSearch(type){if(type=="close"){$('.cd-search').removeClass('is-visible');$('.cd-search-trigger').removeClass('search-is-visible');$('.cd-overlay').removeClass('search-is-visible');}else{$('.cd-search').toggleClass('is-visible');$('.cd-search-trigger').toggleClass('search-is-visible');$('.cd-overlay').toggleClass('search-is-visible');if($(window).width()>MqL&&$('.cd-search').hasClass('is-visible'))$('.cd-search').find('input[type="search"]').focus();($('.cd-search').hasClass('is-visible'))?$('.cd-overlay').addClass('is-visible'):$('.cd-overlay').removeClass('is-visible');}}function checkWindowWidth(){var e=window,a='inner';if(!('innerWidth'in window)){a='client';e=document.documentElement||document.body;}if(e[a+'Width']>=MqL){return true;}else{return false;}}function moveNavigation(){var navigation=$('.cd-nav');var desktop=checkWindowWidth();if(desktop){navigation.detach();navigation.insertBefore('.cd-header-buttons');}else{navigation.detach();navigation.insertAfter('.cd-main-content');}}});*/

/* footer on mobile resize*/
$(window).width() < 767 && jQuery(".foot_head").click(function (e) { jQuery(".foot_dropdown").slideUp(), $(this).next("ul").is(":visible") ? ($(this).next("ul").slideUp(), jQuery(".foot_head").children("i").removeClass("fa-minus"), jQuery(".foot_head").children("i").addClass("fa-plus")) : ($(this).next("ul").slideDown(), jQuery(".foot_head").children("i").removeClass("fa-minus"), jQuery(".foot_head").children("i").addClass("fa-plus"), jQuery(this).children("i").removeClass("fa-plus"), jQuery(this).children("i").addClass("fa-minus")) });

/* ScrollToTop */
//$("body").prepend("<a href='#' class='scrollToTop fade_anim fa fa-chevron-up hidden-print'></a>"),$(window).scroll(function(){$(this).scrollTop()>200?$(".scrollToTop").fadeIn():$(".scrollToTop").fadeOut()}),$(".scrollToTop").click(function(){return $("html, body").animate({scrollTop:0},800),!1});

/* Contact Nos */
//$(".dd_contact").click(function (event) {
//    $(".dd_contact_content").slideToggle(500);
//});
//$(".dd_cancel").click(function (event) {
//    $(".dd_contact_content").slideToggle(500);
//});

//$(".dd_roe").click(function (event) {
//    $(".dd_roe_content").slideToggle(500);
//});
//$(".dd_roe_cancel").click(function (event) {
//    $(".dd_roe_content").slideToggle(500);
//});

/* Tooltips */
$(function () {
    $('[data-toggle="tooltip"]').tooltip()
})

/* PlaceHolder script */
var _debug = false;
var _placeholderSupport = function () {
    var t = document.createElement("input");
    t.type = "text";
    return (typeof t.placeholder !== "undefined");
}();

window.onload = function () {
    var arrInputs = document.getElementsByTagName("input");
    var arrTextareas = document.getElementsByTagName("textarea");
    var combinedArray = [];
    for (var i = 0; i < arrInputs.length; i++)
        combinedArray.push(arrInputs[i]);
    for (var i = 0; i < arrTextareas.length; i++)
        combinedArray.push(arrTextareas[i]);
    for (var i = 0; i < combinedArray.length; i++) {
        var curInput = combinedArray[i];
        if (!curInput.type || curInput.type == "" || curInput.type == "text" || curInput.type == "textarea")
            HandlePlaceholder(curInput);
        else if (curInput.type == "password")
            ReplaceWithText(curInput);
    }

    if (!_placeholderSupport) {
        for (var i = 0; i < document.forms.length; i++) {
            var oForm = document.forms[i];
            if (oForm.attachEvent) {
                oForm.attachEvent("onsubmit", function () {
                    PlaceholderFormSubmit(oForm);
                });
            }
            else if (oForm.addEventListener)
                oForm.addEventListener("submit", function () {
                    PlaceholderFormSubmit(oForm);
                }, false);
        }
    }
};

function PlaceholderFormSubmit(oForm) {
    for (var i = 0; i < oForm.elements.length; i++) {
        var curElement = oForm.elements[i];
        HandlePlaceholderItemSubmit(curElement);
    }
}

function HandlePlaceholderItemSubmit(element) {
    if (element.name) {
        var curPlaceholder = element.getAttribute("placeholder");
        if (curPlaceholder && curPlaceholder.length > 0 && element.value === curPlaceholder) {
            element.value = "";
            window.setTimeout(function () {
                element.value = curPlaceholder;
            }, 100);
        }
    }
}

function ReplaceWithText(oPasswordTextbox) {
    if (_placeholderSupport)
        return;
    var oTextbox = document.createElement("input");
    oTextbox.type = "text";
    oTextbox.id = oPasswordTextbox.id;
    oTextbox.name = oPasswordTextbox.name;
    //oTextbox.style = oPasswordTextbox.style;
    oTextbox.className = oPasswordTextbox.className;
    for (var i = 0; i < oPasswordTextbox.attributes.length; i++) {
        var curName = oPasswordTextbox.attributes.item(i).nodeName;
        var curValue = oPasswordTextbox.attributes.item(i).nodeValue;
        if (curName !== "type" && curName !== "name") {
            oTextbox.setAttribute(curName, curValue);
        }
    }
    oTextbox.originalTextbox = oPasswordTextbox;
    oPasswordTextbox.parentNode.replaceChild(oTextbox, oPasswordTextbox);
    HandlePlaceholder(oTextbox);
    if (!_placeholderSupport) {
        oPasswordTextbox.onblur = function () {
            if (this.dummyTextbox && this.value.length === 0) {
                this.parentNode.replaceChild(this.dummyTextbox, this);
            }
        };
    }
}

function HandlePlaceholder(oTextbox) {
    if (!_placeholderSupport) {
        //alert(oTextbox.tagName);
        var curPlaceholder = oTextbox.getAttribute("placeholder");
        if (curPlaceholder && curPlaceholder.length > 0) {
            Debug("Placeholder found for input box '" + oTextbox.name + "': " + curPlaceholder);
            oTextbox.value = curPlaceholder;
            oTextbox.setAttribute("old_color", oTextbox.style.color);
            oTextbox.style.color = "#c0c0c0";
            oTextbox.onfocus = function () {
                var _this = this;
                if (this.originalTextbox) {
                    _this = this.originalTextbox;
                    _this.dummyTextbox = this;
                    this.parentNode.replaceChild(this.originalTextbox, this);
                    _this.focus();
                }
                Debug("input box '" + _this.name + "' focus");
                _this.style.color = _this.getAttribute("old_color");
                if (_this.value === curPlaceholder)
                    _this.value = "";
            };
            oTextbox.onblur = function () {
                var _this = this;
                Debug("input box '" + _this.name + "' blur");
                if (_this.value === "") {
                    _this.style.color = "#c0c0c0";
                    _this.value = curPlaceholder;
                }
            };
        }
        else {
            Debug("input box '" + oTextbox.name + "' does not have placeholder attribute");
        }
    }
    else {
        Debug("browser has native support for placeholder");
    }
}

function Debug(msg) {
    if (typeof _debug !== "undefined" && _debug) {
        var oConsole = document.getElementById("Console");
        if (!oConsole) {
            oConsole = document.createElement("div");
            oConsole.id = "Console";
            document.body.appendChild(oConsole);
        }
        oConsole.innerHTML += msg + "<br />";
    }
}

// toggle trip section js sneha


$('.tripBtn').on('click', function(tripName){
    var tripName = $(this).attr('ID');
    $('.tripBtn').removeClass('selected_trip');
    $(this).addClass('selected_trip');
    if(tripName == "roundTripBtn"){
        $('#ContentPlaceHolder_retDate').parents('.form-group').removeClass('trans_return_date');
        $('#ContentPlaceHolder_hdnIsRound').val(1);
    }else{
        $('#ContentPlaceHolder_retDate').parents('.form-group').addClass('trans_return_date');
        $('#ContentPlaceHolder_hdnIsRound').val(0);
    }
});

// read more for mobile section js sneha

(function () {
        console.log("sagarw")   
})();