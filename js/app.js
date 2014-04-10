$(function() {
    var scroller;
    
    function initViews() {
        $('.view').css('height', $('.view-wrapper').innerHeight());
        scroller = new IScroll('.view-wrapper', {
            momentum: false,
            snap: true,
            snapThreshold: 0.001,
            snapSpeed: 500,
            bounce: false
        });
    }
    
    /*************************************************************/
    
    initViews();
    scroller.on('scrollEnd', function() {
        if (scroller.currentPage.pageY == 1) {
            $('#thegirl .img').removeClass('invisible');
        } else {
            $('#thegirl .img').addClass('invisible');
        }
    });
});
