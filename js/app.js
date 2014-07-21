
$(function() {
    var CDNURL = '/';
    var scroller;
    
    var sectionList = [];
    
    var SectionView = Backbone.View.extend({
        onEnter: function() {},
        onLeave: function() {},
        play: function() {}
    });
    
    var HeroView = sectionList[0] = new (SectionView.extend({
        onEnter: function() {},
        onLeave: function() {},
        play: function() {}
    }))({el: $('#view-hero')});
    
    var PartyView = sectionList[1] = new (SectionView.extend({
        onEnter: function() {},
        onLeave: function() {},
        play: function() {}
    }))({el: $('#view-party')});
    
    var EscalierView = sectionList[2] = new (SectionView.extend({
        onEnter: function() {},
        onLeave: function() {}
    }))({el: $('#view-escalier')});
    
    var MovieView = sectionList[3] = new (SectionView.extend({
        onEnter: function() {},
        onLeave: function() {},
        play: function() {}
    }))({el: $('#view-movie')});
    
    var FoodView = sectionList[4] = new (SectionView.extend({
        onEnter: function() {},
        onLeave: function() {},
        play: function() {}
    }))({el: $('#view-food')});
    
    var PerformView = sectionList[5] = new (SectionView.extend({
        onEnter: function() {},
        onLeave: function() {}
    }))({el: $('#view-perform')});
    
    var FireworkView = sectionList[6] = new (SectionView.extend({
        onEnter: function() {},
        onLeave: function() {}
    }))({el: $('#view-firework')});
    
    var ContactView = sectionList[7] = new (SectionView.extend({
        onEnter: function() {},
        onLeave: function() {}
    }))({el: $('#view-contact')});
    
    /*************************************************************/
    
    function imageFullpath(src) {
        return /^http:\/\//.test(src) ? src : CDNURL + src;
    };
    
    function loadImage(img, src, options) {
        if (!src) return;
        options = options || {};
        var image = new Image(), image_src = imageFullpath(src);
        image.onload = function() {
            img.attr('src', image_src);
        };
        image.src = image_src;
    };
    
    function loadBgImage(el, src, options) {
        if (!src) return;
        options = options || {};
        el.css('background-image', 'url(' + CDNURL + 'img/loading.gif' + ')');
        var image = new Image(), image_src = imageFullpath(src);
        image.onload = function() {
            el.removeClass('img-loading');
            el.css('background-image', 'url(' + image_src + ')');
        };
        el.addClass('img-loading');
        image.src = image_src;
    };
    
    var cacheImages = function(callback) {
        var imageList = [];
        $('img[data-src]').each(function() {
            imageList.push($(this).data('src'));
        });
        $('.img[data-bg-src]').each(function() {
            imageList.push($(this).data('bg-src'));
        });
        imageList = _.compact(imageList);
        var l = imageList.length;
        if (l == 0) return;
        var $loadingText = $('<h4 class="text-center loading-text fullscreen img">正在加载 <span>1</span>%</h4>');
        $loadingText.prependTo('body');
        var succ = function() {
            percent = parseInt($loadingText.find('>span').text()) + 1;
            if (percent < 100) {
                $loadingText.find('>span').text(percent);
                setTimeout(succ, 1000);
            }
        };
        setTimeout(succ, 1000);
        var progress = function(percent) {
            $loadingText.find('>span').text(percent);
        };
        var startTime = (new Date()).getTime();
        function imageLoaded() {
            if ((--l) == 0) {
                callback && callback();
                var endTime = (new Date()).getTime();
                ga('send', 'timing', 'Load', 'Load Images', endTime - startTime);
                setTimeout(function() {
                    $loadingText.animate({opacity: 0}, 1000, function() {
                        $(this).remove();
                    });
                }, 500);
            }
            progress(parseInt((1 - l / imageList.length) * 100));
        }
        for (var i = 0; i < imageList.length; i++) {
            var image = new Image();
            image.onload = imageLoaded;
            image.onerror = imageLoaded;
            image.src = imageFullpath(imageList[i]);
        }
    };
    
    var fillImages = function() {
        $('img[data-src]').each(function() {
            var src = $(this).data('src');
            src && loadImage($(this), src);
        });
        $('.img[data-bg-src]').each(function() {
            var src = $(this).data('bg-src');
            src && loadBgImage($(this), src);
        });
    };
    
    var bindWxSharing = function() {
        var match = window.location.search.match(/[\?\&]radius=(\d+)(&|$)/);
        var radius = match ? +match[1] : 0;
        var message = {
            "img_url": "",
            "img_width" : "640",
            "img_height" : "640",
            "link" : [window.location.origin, window.location.pathname, '?radius=', radius + 1].join(''),
            "desc" : "",
            "title" : ""
        };
        var onBridgeReady = function () {
            WeixinJSBridge.on('menu:share:appmessage', function(argv) {
                WeixinJSBridge.invoke('sendAppMessage', message);
            });
            WeixinJSBridge.on('menu:share:timeline', function(argv) {
                WeixinJSBridge.invoke('shareTimeline', message);
            });
        };
        if (window.WeixinJSBridge) {
            onBridgeReady();
        } else {
            document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
        }
    };
    
    function initScroller() {
        scroller = new IScroll('.views-wrapper', {
            momentum: false,
            bounce: false,
            snap: true,
            snapSpeed: 500,
            snapThreshold: 0.1,
            mouseWheel: true,
            eventPassthrough: 'horizontal'
        });
        var page;
        scroller.on('scrollEnd', function() {
            if (scroller.currentPage.pageY == page) return;
            page = scroller.currentPage.pageY;
            sectionList[page+1] && sectionList[page+1].onLeave();
            sectionList[page-1] && sectionList[page-1].onLeave();
            sectionList[page] && sectionList[page].onEnter();
        });
        //scroller.goToPage(0, 0);
    }
    
    function startApp() {
        bindWxSharing();
        $('.views-wrapper,.view').css('height', $(window).height());
        $('.views-wrapper').addClass('hidden');
        cacheImages(function() {
            fillImages();
            $('.views-wrapper').removeClass('hidden');
            initScroller();
        });
    };
    
    startApp();
});
