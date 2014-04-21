
$(function() {
    
    var scroller;
    
    var SectionView = Backbone.View.extend({
        onEnter: function() {},
        onLeave: function() {}
    });
    
    var HeroView = new (SectionView.extend({
        
    }))({el: $('#hero')});
    
    var WeddingView = new (SectionView.extend({
        
    }))({el: $('#wedding')});
    
    var TheGirlView = new (SectionView.extend({
        onEnter: function() {
            this.$('.shy-girl').addClass('invisible');
            this.$('.love-cross').addClass('crossed');
        },
        onLeave: function() {
            this.$('.shy-girl').removeClass('invisible');
            this.$('.love-cross').removeClass('crossed');
        }
    }))({el: $('#thegirl')});
    
    var TheBigDayView = new (SectionView.extend({
        onEnter: function() {
            var $timeline = this.$('.timeline');
            var gap = $timeline.outerHeight() - this.$el.innerHeight();
            var translate = 'translate3d(0, ' + (-gap) + 'px, 0)';
            $timeline.addClass('animate');
            $timeline.css({
                '-webkit-transform': translate,
                'transform': translate
            });
        },
        onLeave: function() {
            var $timeline = this.$('.timeline');
            $timeline.removeClass('animate');
            $timeline.css({
                '-webkit-transform': 'translate3d(0, 0, 0)',
                'transform': 'translate3d(0, 0, 0)'
            });
        }
    }))({el: $('#thebigday')});
    
    var ProposalView = new (SectionView.extend({
        onEnter: function() {
            this.$('.rose-cover').addClass('animate');
            $('.copyright').removeClass('invisible');
        },
        onLeave: function() {
            this.$('.rose-cover').removeClass('animate');
            $('.copyright').addClass('invisible');
        }
    }))({el: $('#proposal')});
    
    /*************************************************************/
   
    function startApp() {
        $('img').each(function() {
            var src = $(this).data('src');
            src && $(this).attr('src', src);
        });
        $('.view').css('height', $('.view-wrapper').innerHeight());
        $('#hero').css('height', '100%');
        var sectionList = [WeddingView, TheGirlView, TheBigDayView, ProposalView];
         
        var initScroll = function() {
            return new IScroll('.view-wrapper', {
                momentum : false,
                bounce : false,
                snap : true,
                snapSpeed : 500,
                mouseWheel : true
            });
        };
        
        if(/android/i.test(navigator.userAgent)){
            $('.phoneScrollBar').css('bottom', $('.phoneScrollBar').css('margin-bottom'));
            $('.phoneScrollBar').css('margin-bottom', 0);
        }
        
        var phoneScroll = new IScroll('.phoneScrollBar', {
            momentum : false,
            scrollX : true,
            scrollY : false,
            bounce : false,
            snap : false,
            snapSpeed : 500,
            mouseWheel : true
        });
        
        phoneScroll.scrollToElement('.call-button', 0);
        
        var removeHero = function() {
            $('#hero').animate({
                opacity : 0
            }, 1000, function() {
                $('#hero').remove();
                scroller = initScroll();
                scroller.on('scrollEnd', function() {
                    var page = scroller.currentPage.pageY;
                    sectionList[page] && sectionList[page].onEnter();
                    sectionList[page + 1] && sectionList[page + 1].onLeave();
                    sectionList[page - 1] && sectionList[page - 1].onLeave();
                });
            });
        };
        
        phoneScroll.on('scrollEnd', function() {
            if (this.x >= -20) {
                phoneScroll.scrollToElement('.call-button-dummy', 1000);
                removeHero();
            } else {
                phoneScroll.scrollToElement('.call-button', 1000);
            }
        });
    }
    
    var imageList = [
        "img/avatar.jpg", "img/caricatures.png", "img/theboy.jpg", "img/thecouple.jpg",
        "img/thegirl.jpg", "img/thegirl2.jpg", "img/thegirl3.jpg", "img/thegirl4.jpg",
        "img/levoyage/1.jpg", "img/levoyage/2.jpg", "img/levoyage/3.jpg", "img/levoyage/4.jpg", "img/levoyage/5.jpg",
        "img/heart-cross-pink.png",
        "img/call.png", "img/phone.png",
        "img/rose-bottom.jpg", "img/rose-top.jpg",
        "img/dotted.png", "img/bulle_bleue.png", "img/body-bg-gray.jpg"
    ];
    var l = imageList.length, i=0;
    function imageLoaded() {
        l--;
        $('.loading-text>span').text(parseInt((1-l/imageList.length)*100) + '%');
        if (l == 0) {
            $('.loading-text').addClass('hidden');
            $('.view-wrapper').removeClass('hidden');
            $('#hero').removeClass('hidden');
            startApp();
        }
    }
    for (i=0; i<imageList.length; i++) {
        var image = new Image();
        image.onload = imageLoaded;
        image.src = imageList[i];
    }

    document.addEventListener('WeixinJSBridgeReady', function onBridgeReady() {
        var message = {
            "img_url" : 'http://love.oatpie.com/libra/img/avatar.jpg',
            "img_width" : "640",
            "img_height" : "640",
            "link" : 'http://love.oatpie.com/libra/',
            "desc" : "这是@Libra_雪er和@王禹清的婚礼邀请，我们喜欢你来见证我们的故事",
            "title" : "有关爱情的故事"
        };
        WeixinJSBridge.on('menu:share:appmessage', function(argv) {
            WeixinJSBridge.invoke('sendAppMessage', message);
        });
        WeixinJSBridge.on('menu:share:timeline', function(argv) {
            WeixinJSBridge.invoke('shareTimeline', message);
        });
    }, false);
});
