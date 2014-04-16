$(function() {

    var scroller;
    var timelineBg = new Audio("img/timelinebg.mp3");

    var SectionView = Backbone.View.extend({
        onEnter: function() {},
        onLeave: function() {}
    });

    var HeroView = new (SectionView.extend({

    }))({el: $('#hero')});

    var TheGirlView = new (SectionView.extend({
        onEnter: function() {
            timelineBg.play();
            this.$('.shy-girl').addClass('invisible');
            this.$('.love-cross').addClass('crossed');
        },
        onLeave: function() {
            this.$('.shy-girl').removeClass('invisible');
            this.$('.love-cross').removeClass('crossed');
        }
    }))({el: $('#thegirl')});

    var StoryView = new (SectionView.extend({
        onEnter: function() {
            var $timeline = this.$('.timeline');
            var gap = $timeline.outerHeight() - this.$el.innerHeight();
            var translate = 'translate3d(0, ' + (-gap) + 'px, 0)';
            $timeline.addClass('animate');
            $timeline.css({
                '-webkit-transform': translate,
                'transform': translate
            });
            //scroller.disable();
            //setTimeout(function() { scroller.enable(); }, 10000);
        },
        onLeave: function() {
            var $timeline = this.$('.timeline');
            $timeline.removeClass('animate');
            $timeline.css({
                '-webkit-transform': 'translate3d(0, 0, 0)',
                'transform': 'translate3d(0, 0, 0)'
            });
        }
    }))({el: $('#story')});

    var WeddingView = new (SectionView.extend({
        onEnter: function() {
            this.$('.rose-cover').addClass('animate');
            this.$('.the-ring').addClass('animate');
        },
        onLeave: function() {
            this.$('.rose-cover').removeClass('animate');
            this.$('.the-ring').removeClass('animate');
        }
    }))({el: $('#wedding')});

    var LaVieView = new (SectionView.extend({
        events: {
            'click .gallery img': 'previewImage'
        },
        previewImage: function(e) {
            var $img = $(e.currentTarget);
            window.WeixinJSBridge && window.WeixinJSBridge.invoke('imagePreview', {
                current: location.origin + location.pathname + $img.attr('src'),
                urls: _.map($img.siblings('img'), function(item) {
                    return location.origin + location.pathname + $(item).attr('src');
                })
            });
        }
    }))({el: $('#lavie')});

    var WishView = new (SectionView.extend({
        onEnter: function() {
            timelineBg.pause();
            this.$('.cover').addClass('flip');
            this.$('.bouquet').addClass('slidein');
            $('.copyright').removeClass('hidden');
        },
        onLeave: function() {
            this.$('.cover').removeClass('flip');
            this.$('.bouquet').removeClass('slidein');
            $('.copyright').addClass('hidden');
        }
    }))({el: $('#wish')});

    /*************************************************************/

    function startApp() {
        $('img').each(function() {
            var src = $(this).data('src');
            src && $(this).attr('src', src);
        });
//        $('.view').css('height', $('.view-wrapper').innerHeight());
//        scroller = new IScroll('.view-wrapper', {
//            momentum: false,
//            bounce: false,
//            snap: true,
//            snapSpeed: 500,
//            snapThreshold: 0.1,
//            mouseWheel: true,
//            eventPassthrough: 'horizontal'
//        });
//        var sectionList = [HeroView, TheGirlView, StoryView, WeddingView, LaVieView, WishView];
//        scroller.on('scrollEnd', function() {
//            var page = scroller.currentPage.pageY;
//            sectionList[page] && sectionList[page].onEnter();
//            sectionList[page+1] && sectionList[page+1].onLeave();
//            sectionList[page-1] && sectionList[page-1].onLeave();
//        });
//        scroller.goToPage(0, 0);
    }

    var imageList = [
        "img/lu/image001.jpg", "img/lu/image003.jpg", "img/lu/image005.jpg",
        "img/lu/image007.jpg", "img/lu/image009.jpg", "img/lu/image011.jpg"
    ];

    var l = imageList.length;
    function imageLoaded() {
        l--;
        $('.loading-text>span').text(parseInt((1-l/imageList.length)*100) + '%');
        if (l == 0) {
            $('.loading-text').addClass('hidden');
            $('.view-wrapper').removeClass('hidden');
            startApp();
        }
    }

    for (var i=0; i<imageList.length; i++) {
        var image = new Image();
        image.onload = imageLoaded;
        image.src = imageList[i];
    }

    document.addEventListener('WeixinJSBridgeReady', function onBridgeReady() {
        var message = {
            "img_url" : 'http://love.oatpie.com/dolphin/img/avatar.jpg',
            "img_width" : "640",
            "img_height" : "640",
            "link" : 'http://love.oatpie.com/dolphin/',
            "desc" : "致我们永不褪色的爱情",
            "title" : "我钟爱的女子"
        };
        WeixinJSBridge.on('menu:share:appmessage', function(argv) {
            WeixinJSBridge.invoke('sendAppMessage', message);
        });
        WeixinJSBridge.on('menu:share:timeline', function(argv) {
            WeixinJSBridge.invoke('shareTimeline', message);
        });
    }, false);

});