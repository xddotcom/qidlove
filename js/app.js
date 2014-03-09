$(function() {
    function showMap() {
        var map = new BMap.Map('map-canvas');
        var point = new BMap.Point(120.63407, 29.969563);
        map.centerAndZoom(point, 16);
        map.setMapStyle({
            style : "normal"
        });
        var marker = new BMap.Marker(new BMap.Point(120.642703, 29.970088));
        map.addOverlay(marker);
        map.addControl(new BMap.NavigationControl());
        //map.enableScrollWheelZoom();
        //map.disableDragging();
        map.disableDoubleClickZoom();
    }
    
    function displayAddressWrapper() {
        var $circle = $('#where>.address-wrapper');
        if (!$circle.hasClass('animating')) {
            $circle.addClass('animating');
            $circle.animate({
                opacity : 1,
                top : 50
            }, 500, function() {
                $circle.removeClass('animating');
            });
        }
    }
    
    function hideAddressWrapper() {
        var $circle = $('#where>.address-wrapper');
        if (!$circle.hasClass('animating')) {
            $circle.addClass('animating');
            $circle.animate({
                opacity : 0,
                top : 0
            }, 0, function() {
                $circle.removeClass('animating');
            });
        }
    }
    
    function dropAddressCircle() {
        var topLineGone = $('#where').offset().top;
        var topLineAppear = topLineGone - $(window).height();
        var bottomLineGone = topLineGone + $('#where').outerHeight();
        var windowScroll = $(window).scrollTop();
        if (topLineAppear < windowScroll && windowScroll < topLineGone) {
            displayAddressWrapper();
        } else {
            hideAddressWrapper();
        }
    }
    
    /**********************************/
    
    $('#where>.address-wrapper').pin({
        containerSelector: "#where",
        minWidth: 360
    });
    //$(window).scroll(dropAddressCircle);
    //showMap();
});
