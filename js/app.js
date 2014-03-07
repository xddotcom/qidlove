$(function() {
    function showMap() {
        var map = new BMap.Map('map-canvas', {
            mapType: BMAP_NORMAL_MAP
        });
        var point = new BMap.Point(116.404, 39.915);
        map.centerAndZoom(point,15);
        //map.enableScrollWheelZoom();
    }
    function dropAddressCircle() {
        var circlePos = $('#where>address').offset();
        if (circlePos.top < $(window).scrollTop() + $(window).height()) {
            //console.log(123);
        }
    }
    
    /**********************************/
    
    $(window).scroll(dropAddressCircle);
    showMap();
});
