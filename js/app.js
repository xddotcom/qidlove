
$(function() {
    var imageRoot = 'http://oatpie.qiniudn.com/catking/';
    //var imageRoot = 'http://192.168.1.99:8080/';
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
    
    var HoneymoonView = new (SectionView.extend({
        events: {
            'click .cover-top .img': 'previewImage'
        },
        initialize: function() {
            this.images = ['img/travel/1.jpg', 'img/travel/2.jpg', 'img/travel/3.jpg',
                           'img/travel/4.jpg', 'img/travel/5.jpg', 'img/travel/6.jpg'];
        },
        previewImage: function(e) {
            var $img = $(e.currentTarget);
            window.WeixinJSBridge && window.WeixinJSBridge.invoke('imagePreview', {
                current: imageRoot + this.images[+$img.data('img')],
                urls: _.map(this.images, function(item) { return imageRoot + item; })
            });
        },
        onEnter: function() {
            this.$('.cover').addClass('flip');
            var images = this.images;
            this.$('.cover-top .img').each(function(index, img) {
                $(img).css('background-image', 'url(' + imageRoot + images[index] + ')');
                $(img).data('img', index);
            });
        },
        onLeave: function() {
            this.$('.cover').removeClass('flip');
        }
    }))({el: $('#honeymoon')});
    
    var ContactView = new (SectionView.extend({
        events: {
            'submit form': 'sendMessage'
        },
        initialize: function() {
            var API = 'http://api.toplist.oatpie.com/lovemessages/message/';
            var Message = Model.extend({ urlRoot: API });
            var Messages = Collection.extend({ url: API, model: Message });
            this.messages = new Messages();
            this.listenTo(this.messages, 'add', this.addMessage);
            this.listenTo(this.messages, 'reset', this.renderMessages);
        },
        renderMessages: function() {
            var $list = [];
            this.messages.forEach(function(item) {
                $list.push($('<p></p>').text(item.get('content')).prepend('<i class="fa fa-heart-o"></i>'));
            });
            this.$('.messages').html($list);
        },
        addMessage: function(item) {
            var $msg = $('<p></p>').text(item.get('content')).prepend('<i class="fa fa-heart-o"></i>')
                                   .css('opacity', 0).animate({opacity: 1});
            this.$('.messages').prepend($msg);
        },
        sendMessage: function(e) {
            if (e.preventDefault) e.preventDefault();
            var content = this.$('textarea').val();
            if (content) {
                this.messages.create({ site: 3, content: content });
                this.$('textarea').val('').attr('placeholder', '谢谢你的祝福！');
            }
        },
        onEnter: function() {
            this.messages.fetch({reset: true, data: {site: 3}});
            $('.copyright').removeClass('hidden');
        },
        onLeave: function() {
            this.$('textarea').blur();
            $('.copyright').addClass('hidden');
        }
    }))({el: $('#contact')});
    
    /*************************************************************/
    
    var sectionList = [HeroView, TheGirlView, StoryView, WeddingView, LaVieView, HoneymoonView, ContactView];
    
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
        //scroller.goToPage(0, 5);
    }
    
    var imageList = [
        "img/avatar.jpg",
        "img/boy/1.jpg",
        "img/girl/1.jpg", "img/girl/2.jpg", "img/girl/3.jpg", "img/girl/4.jpg", "img/girl/5.jpg", "img/girl/6.jpg",
        "img/couple/1.jpg", "img/couple/2.jpg", "img/couple/3.jpg", "img/couple/1.png",
        "img/lavie/1.jpg", "img/lavie/2.jpg", "img/lavie/3.jpg", "img/lavie/4.jpg", "img/lavie/5.jpg", "img/lavie/6.jpg", "img/lavie/7.jpg",
        "img/proposal/1.jpg", "img/proposal/2.jpg", "img/proposal/3.jpg", "img/proposal/4.jpg", "img/proposal/5.jpg", "img/proposal/6.jpg", "img/proposal/7.jpg", "img/proposal/8.jpg",
        "img/travel/1.jpg", "img/travel/2.jpg", "img/travel/3.jpg", "img/travel/4.jpg", "img/travel/5.jpg", "img/travel/6.jpg",
        "img/marriage-cert.jpg", "img/sunset.jpg",
        "img/body-bg-gray.jpg", "img/rip.png",
        "img/heart-cross-pink.png",
        "img/story-cover.jpg", "img/story-cover-text.jpg",
        "img/rose-bottom.jpg", "img/rose-top.jpg",
        "img/nightsky.jpg",
        "img/cover-page-dark.jpg", "img/cover-page-light.jpg",
    ];
    
    var limg = imageList.length;
    function imageLoaded() {
        limg--;
        $('.loading-text>span').text(parseInt((1-limg/imageList.length)*100) + '%');
        if (limg == 0) {
            $('.loading-text').text("点击开始播放");
            startApp();
        }
    }
    
    for (var i=0; i<imageList.length; i++) {
        var image = new Image();
        image.onload = imageLoaded;
        image.src = imageRoot + imageList[i];
    }
    
    document.addEventListener('WeixinJSBridgeReady', function onBridgeReady() {
        var message = {
            "img_url" : 'http://love.oatpie.com/catking/img/avatar.jpg',
            "img_width" : "640",
            "img_height" : "640",
            "link" : 'http://love.oatpie.com/catking/',
            "desc" : "今后只愿将心付与一人",
            "title" : "猫王的故事"
        };
        WeixinJSBridge.on('menu:share:appmessage', function(argv) {
            WeixinJSBridge.invoke('sendAppMessage', message);
        });
        WeixinJSBridge.on('menu:share:timeline', function(argv) {
            WeixinJSBridge.invoke('shareTimeline', message);
        });
    }, false);
    
});
