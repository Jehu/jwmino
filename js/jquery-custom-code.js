//$(document).bind("mobileinit", function(){
    $.mobile.touchOverflowEnabled = false;
    $.mobile.defaultPageTransition = "fade";
    $.mobile.page.prototype.options.addBackBtn = true;
    moment.lang('de');

    // vll fixt das den footer? https://github.com/jquery/jquery-mobile/issues/58#issuecomment-915067
    $('[data-role=footer], [data-role=header]').live("touchmove", function(e) {
      e.stopPropagation();
      e.preventDefault();
    })
//});
