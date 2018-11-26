(function() {
  "use strict";

  $(document).ready(function () {
    $('.button').click(function() {
      console.log('click');
      if ( $('.main-container').hasClass('opened') ) {
        $('.main-container').removeClass('opened');
      } else {
        $('.main-container').addClass('opened');
      }
    });
  });

}());
