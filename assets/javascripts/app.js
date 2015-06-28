
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
        snapThreshold: 0.1,
        snapSpeed: 500,
        bounceEasing: 'quadratic',
        //eventPassthrough: 'horizontal',
        momentum: false
    });
    var switchActive = function() {
        var page = scroller.currentPage.pageY;
        $($('.view')[page]).addClass('active').trigger('active')
                .siblings().removeClass('active').trigger('inactive');
        //$('#metallic-top,#metallic-bottom').toggleClass('fold', (page > 1));
        Star[page==1?'start':'end']();
        if (page == 1) {
            window.prologueAudio.currentTime = 0;
            window.prologueAudio.play();
        } else {
            window.prologueAudio.pause();
        }
        $('#starfield').toggleClass('hidden', (page != 1));
    };
    scroller.on('scrollStart', function() {});
    scroller.on('scrollEnd', switchActive);
    _.delay(switchActive, 1800);
    Amour.on('next-view', function() {
        scroller.goToPage(0, scroller.currentPage.pageY + 1);
        //scroller.goToPage(0, scroller.currentPage.pageY - 1);
    });
}

function initDashboard() {
    var canvasDash, stage, exportRoot;
    canvasDash = document.getElementById("canvas-dashboard");
    exportRoot = new lib.Dashboard();
    stage = new createjs.Stage(canvasDash);
    stage.addChild(exportRoot);
    stage.update();
    //createjs.Ticker.setFPS(lib.properties.fps);
    //createjs.Ticker.addEventListener("tick", stage);
}

var dispatchMusic = function() {
    if (window.Audio) {
        if (!window.prologueAudio) {
            window.prologueAudio = new Audio();
            window.prologueAudio.src = 'assets/audios/xd.mp3';
        }
        var audio = window.prologueAudio;
        var play = function() { audio.play(); };
        //$('body').one('touchstart', play);
        //_.defer(play);
    }
};

(function() {

    $('.views-wrapper').addClass('hidden');

    var $style = $('<style></style>');
    $style.text('.view,.views-wrapper{height:'+$(window).height()+'px;}').appendTo('head');
    $(window).resize(_.debounce(function() {
        $style.text('.view,.views-wrapper{height:'+$(window).height()+'px;}')
    }, 100));

    // #view-start
    $('#view-start .circles-wrapper').on('click', function() {
        $('#view-start .car').addClass('gone');
        _.delay(function() {
            Amour.trigger('next-view');
        }, 500);
    });
    $('#view-start').on('active', function() {
        $(this).find('.car').removeClass('gone');
    });

    //#view-prologue
    $('#view-prologue').on('active', function() {
        dispatchMusic();
        var i=0, j=0;
        var tick = function() {
            var $text = $($('#view-prologue .text')[i]);
            if ($text.length == 0 || !$('#view-prologue').hasClass('active')) return;
            var text = $text.data('text');
            if (j >= text.length) {
                i++; j=0;
            } else {
                $text.text(text.substr(0,j+1));
                j++;
            }
            _.delay(tick, 150);
        };
        tick();
    }).on('inactive', function() {
        $(this).find('.text').empty();
        window.prologueAudio.pause();
    });

    //#view-dashboard
    $('#view-dashboard').on('active', function() {
        var j=0;
        var $text = $('#view-dashboard .display-items .text > span');
        var tick = function() {
            if (j >= 10 || !$('#view-dashboard').hasClass('active')) return;
            $text.each(function() {
                var text = $(this).data('text');
                $(this).text(text.substr(0,j+1));
            });
            j++;
            _.delay(tick, 150);
        };
        _.delay(tick, 1000);
    }).on('inactive', function() {
        $(this).find('.display-items .text > span').empty();
    });

    //#view-rewards
    var step = 0;
    $('#view-rewards .fingerprint').on('touchstart', function() {
        if (step > 3) return;
        $('#view-rewards').addClass('scaning');
        var $bar = $($('#view-rewards .scan-bar')[3-step]);
        $bar.addClass('fill');
        var $bar = $($('#view-rewards article')[step]);
        $bar.addClass('show').siblings().removeClass('show');
        step++;
        if (step > 3) $(this).addClass('stop');
    });
    $('#view-rewards').on('inactive', function() {
        $(this).removeClass('scaning');
        step = 0;
        $(this).find('.fingerprint').removeClass('stop');
        $(this).find('.scan-bar').removeClass('fill');
        $(this).find('article').removeClass('show');
    });

    // start
    Amour.on('StorytellAppReady', function start() {
        initDashboard();
        dispatchMusic();
        initScroll();
    });

    dispatchLoadingScreen();

})();
