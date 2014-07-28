
$(function() {
    var imageRoot = 'http://oatpie.qiniudn.com/dolphin/';
    var scroller;
    
    var SectionView = Backbone.View.extend({
        onEnter: function() {},
        onLeave: function() {},
        play: function() {}
    });
    
    var Collection = Backbone.Collection.extend({
        parse: function(response) {
            if (response.results != null) {
                this.count = response.count;
                this.previous = response.previous;
                this.next = response.next;
                return response.results;
            } else {
                return response;
            }
        }
    });
    
    var Model = Backbone.Model.extend({
        url: function() {
            if (this.attributes.url) {
                return this.attributes.url;
            } else {
                var origUrl = Backbone.Model.prototype.url.call(this);
                return origUrl + (origUrl.charAt(origUrl.length - 1) == '/' ? '' : '/');
            }
        }
    });
    
    var API = 'http://api.toplist.oatpie.com';
    
    var HeroView = new (SectionView.extend({
        
    }))({el: $('#hero')});
    
    var TheGirlView = new (SectionView.extend({
        onEnter: function() {
            this.$('.shy-girl').addClass('invisible');
            this.$('.love-cross').addClass('crossed');
        },
        onLeave: function() {
            this.$('.shy-girl').removeClass('invisible');
            this.$('.love-cross').removeClass('crossed');
        },
        play: function() {
            var lines = this.$('.hesays').children();
            lines.css('opacity', 0);
            var next = function(i) {
                var line = lines[i];
                if (!line) return;
                var duration = line.innerText.length * 170;
                $(line).animate({ opacity: 1 }, duration, function() { next(i+1); });
            };
            setTimeout(function() {
                next(0);
            }, 1000);
        }
    }))({el: $('#thegirl')});
    
    var StoryView = new (SectionView.extend({
        onEnter: function() {
            var $timeline = this.$('.timeline');
            var gap = $timeline.outerHeight() - this.$el.innerHeight();
            var translate = 'translate3d(0, ' + (-gap-300) + 'px, 0)';
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
        },
        play: function() {
            var lines = this.$('>header').children();
            lines.css('opacity', 0);
            var next = function(i) {
                var line = lines[i];
                if (!line) return;
                var duration = line.innerText.length * 250;
                $(line).animate({ opacity: 1 }, duration, function() { next(i+1); });
            };
            setTimeout(function() {
                next(0);
            }, 2000);
        }
    }))({el: $('#wedding')});
    
    var LaVieView = new (SectionView.extend({
        events: {
            'click .gallery img': 'previewImage'
        },
        previewImage: function(e) {
            var $img = $(e.currentTarget);
            window.WeixinJSBridge && window.WeixinJSBridge.invoke('imagePreview', {
                current: $img[0].src,
                urls: _.map($img.siblings('img').andSelf(), function(item) { return item.src; })
            });
        },
        onEnter: function() {
            this.$('.gallery-inner').removeClass('animate').css({
                '-webkit-transform': 'translate3d(0, 0, 0)',
                'transform': 'translate3d(0, 0, 0)'
            });
        },
        onLeave: function() {
            this.$('.gallery-inner').removeClass('animate').css({
                '-webkit-transform': 'translate3d(0, 0, 0)',
                'transform': 'translate3d(0, 0, 0)'
            });
        },
        play: function() {
            var outerWidth = this.$('.gallery').innerWidth();
            var innerWidth = _.reduce(this.$('.gallery-inner').children(), function(a,b){return a+$(b).outerWidth();}, 0);
            var translate = 'translate3d(' + (outerWidth - innerWidth) + 'px, 0, 0)';
            this.$('.gallery-inner').addClass('animate').css({
                '-webkit-transform': translate,
                'transform': translate
            });
        }
    }))({el: $('#lavie')});
    
    var WishView = new (SectionView.extend({
        onEnter: function() {
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
    
    var ContactView = new (SectionView.extend({
        events: {
            'submit form': 'sendMessage'
        },
        initialize: function() {
            var Messages = Collection.extend({
                url: API + '/sites/story/1/wishes/',
                model: Model
            });
            this.messages = new Messages();
            this.listenTo(this.messages, 'add', this.addMessage);
            this.listenTo(this.messages, 'reset', this.renderMessages);
        },
        renderMessages: function() {
            var $list = [];
            this.messages.forEach(function(item) {
                $list.push($('<p></p>').text(item.get('message')).prepend('<i class="fa fa-heart-o"></i>'));
            });
            this.$('.messages').html($list);
        },
        addMessage: function(item) {
            var $msg = $('<p></p>').text(item.get('message')).prepend('<i class="fa fa-heart-o"></i>')
                                   .css('opacity', 0).animate({opacity: 1});
            this.$('.messages').prepend($msg);
        },
        sendMessage: function(e) {
            if (e.preventDefault) e.preventDefault();
            var content = this.$('textarea').val();
            if (content) {
                this.messages.create({
                    story: 1,
                    message: content
                }, {
                    url: API + '/sites/wish/'
                });
                this.$('textarea').val('').attr('placeholder', '谢谢你的祝福！');
            }
        },
        onEnter: function() {
            this.messages.fetch({reset: true});
            $('.copyright').removeClass('hidden');
        },
        onLeave: function() {
            this.$('textarea').blur();
            $('.copyright').addClass('hidden');
        }
    }))({el: $('#contact')});
    
    /*************************************************************/
    
    var sectionList = [HeroView, TheGirlView, StoryView, WeddingView, LaVieView, WishView, ContactView];
    
    function autoPlayViews() {
        $('.forbid-gesture').removeClass('hidden');
        $('.forbid-gesture').on('touchmove', function(e) { e.preventDefault(); });
        var duration = [7, 35, 75, 40, 65, 30, 1];
        //duration = [1, 1, 1, 1, 1, 1, 1];
        var next = function(i) {
            if (i > 6) {
                $('.forbid-gesture').addClass('hidden');
            } else {
                scroller.goToPage(0, i, 2000, IScroll.utils.ease.quadratic);
                setTimeout(function() { sectionList[i].play(); }, 2500);
                setTimeout(function() { next(i+1); }, duration[i] * 1000);
            }
        };
        next(0);
    }
    
    function startApp() {
        $('.view-wrapper,.view').css('height', $(window).height());
        $('.loading-text').addClass('hidden');
        $('.view-wrapper').removeClass('hidden');
        $('img').each(function() {
            var src = $(this).data('src');
            src && $(this).attr('src', imageRoot + src);
        });
        scroller = new IScroll('.view-wrapper', {
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
        if (location.hash != '#noplay') {
            autoPlayViews();
        }
    }
    
    var imageList = [
        "img/angel.jpg", "img/dolphin.jpg", "img/avatar.jpg",
        "img/thegirl1.jpg", "img/thegirl2.jpg", "img/thegirl3.jpg", "img/thegirl4.jpg", "img/thegirl5.jpg", "img/thegirl6.jpg",
        "img/thestory1.jpg", "img/thestory2.jpg", "img/thestory3.jpg",
        "img/heart-cross-pink.png", "img/thecouple.png",
        "img/thecouple1.jpg", "img/thecouple2.jpg", "img/thecouple3.jpg", "img/thecouple4.jpg", "img/thecouple5.jpg",
        "img/story-cover.jpg", "img/story-cover-text.jpg",
        "img/rose-bottom.jpg", "img/rose-top.jpg",
        "img/ring1.jpg", "img/ring2.jpg", "img/nightsky.jpg",
        "img/food1.jpg", "img/food2.jpg", "img/food3.jpg", "img/food4.jpg", "img/food5.jpg",
        "img/cover-page-dark.jpg", "img/cover-page-light.jpg",
        "img/bouquet.png", "img/amalfi.jpg", "img/registry.jpg"
    ];
    
    var limg = imageList.length;
    function imageLoaded() {
        limg--;
        $('.loading-text>span').text(parseInt((1-limg/imageList.length)*100) + '%');
        if (limg == 0) {
            $('.loading-text').text("点击开始播放");
            $('#audio').removeClass('hidden');
        }
    }
    
    //var audio = window.BACKGROUND_AUDIO = new Audio();
    //audio.autoplay = true;
    audio = document.getElementById('audio');
    audio.addEventListener('playing', function() {
        $('#audio').addClass('hidden');
        startApp();
    });
    audio.src = "img/timelinebg.mp3";
    
    for (var i=0; i<imageList.length; i++) {
        var image = new Image();
        image.onload = imageLoaded;
        image.src = imageRoot + imageList[i];
    }
    
    var match = window.location.search.match(/[\?\&]radius=(\d+)(&|$)/);
    var radius = match ? +match[1] : 0;
    var message = {
        "img_url" : 'http://love.oatpie.com/dolphin/img/avatar.jpg',
        "img_width" : "640",
        "img_height" : "640",
        "link" : ['http://love.oatpie.com/dolphin/#noplay', '?radius=', radius + 1].join(''),
        "desc" : "致我们永不褪色的爱情",
        "title" : "我钟爱的女子"
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
    
});
