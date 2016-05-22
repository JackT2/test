$(document).ready(function () {

var menu = $('.navbar');
var origOffsetY = menu.offset().top;

function scroll() {
    if ($(window).scrollTop() >= origOffsetY) {
        $('.navbar').addClass('navbar-fixed-top');
        $('body').addClass('scroll-padding');
        $('.content').addClass('content-main');
    } else {
        $('.navbar').removeClass('navbar-fixed-top');
        $('body').removeClass('scroll-padding');
        $('.content').removeClass('content-main');
    }
   }
  document.onscroll = scroll;

});

$('.btn-header').click(function() {
    $('.btn-header').addClass('btn-header-click');
    $('.btn-header-click').removeClass('btn-header');
    $('.hide-click').addClass('show-click');
    $('.show-click').removeClass('hide-click');
    $('.text-header').addClass('text-header-hide');
    $('.link-header').addClass('link-header-hide');
});


$(document).ready(function () {
  $('[data-toggle=offcanvas]').click(function () {
    if ($('.sidebar-offcanvas').css('background-color') == 'rgb(255, 255, 255)') {
	    $('.list-group-item').attr('tabindex', '-1');
    } else {
	    $('.list-group-item').attr('tabindex', '');
    }
    $('.row-offcanvas').toggleClass('active');
    
  });
});


$('.btn-add-project').click(function() {
    $('.btn-add-project').addClass('btn-add-project-click');
    $('.btn-add-project-click').removeClass('btn-add-project');
    $('.hide-click').addClass('show-click');
    $('.show-click').removeClass('hide-click');
    $('.text-header').addClass('text-header-hide');
    $('.link-header').addClass('link-header-hide');
});
$('.popoverData').popover();
$('.popoverData1').popover();
$(".pop").popover({ trigger: "manual" , html: true, animation:false})
    .on("mouseenter", function () {
        var _this = this;
        $(this).popover("show");
        $(".popover").on("mouseleave", function () {
            $(_this).popover('hide');
        });
    }).on("mouseleave", function () {
        var _this = this;
        setTimeout(function () {
            if (!$(".popover:hover").length) {
                $(_this).popover("hide");
            }
        }, 300);
});