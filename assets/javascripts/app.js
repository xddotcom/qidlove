
var Star=function(){function t(t){return document.getElementById(t)}function e(){var t=document.documentElement.clientWidth,n=document.documentElement.clientHeight;return Array(t,n)}function o(){for(var e=0;n>e;e++)b[e]=new Array(5),b[e][0]=Math.random()*f*2-2*m,b[e][1]=Math.random()*h*2-2*s,b[e][2]=Math.round(Math.random()*g),b[e][3]=0,b[e][4]=0;var o=t("starfield");o.style.position="absolute",o.width=f,o.height=h,d=o.getContext("2d"),d.fillStyle="rgba(0,0,0,"+T+")",d.strokeStyle="rgb(255,255,255)"}function r(){E=w-m,S=A-s,d.fillRect(0,0,f,h);for(var t=0;n>t;t++)i=!0,u=b[t][3],c=b[t][4],b[t][0]+=E>>4,b[t][0]>m<<1&&(b[t][0]-=f<<1,i=!1),b[t][0]<-m<<1&&(b[t][0]+=f<<1,i=!1),b[t][1]+=S>>4,b[t][1]>s<<1&&(b[t][1]-=h<<1,i=!1),b[t][1]<-s<<1&&(b[t][1]+=h<<1,i=!1),b[t][2]-=M,b[t][2]>g&&(b[t][2]-=g,i=!1),b[t][2]<0&&(b[t][2]+=g,i=!1),b[t][3]=m+b[t][0]/b[t][2]*y,b[t][4]=s+b[t][1]/b[t][2]*y,u>0&&f>u&&c>0&&h>c&&i&&(d.lineWidth=2*(1-v*b[t][2]),d.beginPath(),d.moveTo(u,c),d.lineTo(b[t][3],b[t][4]),d.stroke(),d.closePath());l=setTimeout(function(){r()},k)}function a(){f=e()[0],h=e()[1],m=Math.round(f/2),s=Math.round(h/2),g=(f+h)/2,v=1/g,w=m,A=s,o()}var i=!0;n=512;var u,c,d,l,f=200,h=100,m=0,s=0,g=0,v=0,y=256,M=2,b=new Array(n),T=.1,w=0,A=0,E=0,S=0,k=20;return{start:function(){a(),r()},end:function(){clearTimeout(l)}}}();

function dispatchLoadingScreen(callback) {
    var $loadingScreen = $('#loading-screen');
    var imageLoadEnd = _.once(function() {
        $('.views-wrapper').removeClass('hidden').addClass('invisible');
        Amour.trigger('StorytellAppReady');
        _.delay(function() {
            $loadingScreen.animate({opacity: 0}, 500, function() {
                $(this).css({opacity: 1}).addClass('hidden');
                $('.views-wrapper').removeClass('invisible');
            });
        }, 1000);
    });
    var succ = new function() {
        var $percent = $loadingScreen.find('.progress-fill');
        var loadingProgress = 1;
        var progressDelay = 200;
        var start = this.start = function() {
            if (loadingProgress <= 100) {
                $percent.css('width', (loadingProgress++) + '%');
                _.delay(start, progressDelay);
            } else {
                imageLoadEnd();
            }
        };
        this.rush = function() {
            progressDelay = 1;
        };
    };
    _.defer(succ.start);
    Amour.on('ImagesLoaded', succ.rush);
}

function initScroll() {
    var scroller = new IScroll('.views-wrapper', {
        snap: true,
        momentum: false,
        snapThreshold: 0.1,
        snapSpeed: 500,
        bounceEasing: 'quadratic',
        eventPassthrough: 'horizontal'
    });
    var switchActive = function() {
        var page = scroller.currentPage.pageY;
        $($('.view')[page]).addClass('active').trigger('active')
                .siblings().removeClass('active').trigger('inactive');
        //$('#metallic-top,#metallic-bottom').toggleClass('fold', (page > 1));
        Star[page==1?'start':'end']();
        $('#starfield').toggleClass('hidden', (page != 1));
    };
    scroller.on('scrollStart', function() {});
    scroller.on('scrollEnd', switchActive);
    _.delay(switchActive, 1800);
}

(function() {

    $('.views-wrapper').addClass('hidden');

    var $style = $('<style></style>');
    $style.text('.view,.views-wrapper{height:'+$(window).height()+'px;}').appendTo('head');
    $(window).resize(_.debounce(function() {
        $style.text('.view,.views-wrapper{height:'+$(window).height()+'px;}')
    }, 100));

    function start() {
        initScroll();
    }

    Amour.on('StorytellAppReady', start);
    dispatchLoadingScreen();

})();
