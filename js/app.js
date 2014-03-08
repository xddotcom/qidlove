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

    function dropAddressCircle() {
        var $circle = $('#where>.address-wrapper');
        var circlePos = $circle.offset();
        var bottomLine = circlePos.top;
        var topLine = circlePos.top - $(window).height();
        var windowScroll = $(window).scrollTop() - 100;
        if (topLine < windowScroll && windowScroll < bottomLine) {
            if (!$circle.hasClass('showing')) {
                $circle.addClass('showing');
                $circle.animate({
                    opacity : 1,
                    top : 50
                });
            }
        } else {
            $circle.removeClass('showing');
            $circle.animate({
                opacity : 0,
                top : 0
            });
        }
    }

    /**********************************/

    $(window).scroll(dropAddressCircle);
    //showMap();
});
