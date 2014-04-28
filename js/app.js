
$(function() {
    var imageRoot = 'http://oatpie.qiniudn.com/catking/';
    //var imageRoot = 'http://192.168.0.119:8080/';
    var scroller;
    
    var SectionView = Backbone.View.extend({
        onEnter: function() {},
        onLeave: function() {}
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
    
    var Views = {};
    
    function initViews() {
        Views.HeroView = new (SectionView.extend({
            
        }))({el: $('#hero')});
        
        Views.TheBoyView = new (SectionView.extend({
            
        }))({el: $('#theboy')});
        
        Views.TheGirlView = new (SectionView.extend({
            initialize: function() {
                var $scene = $('.body-background');
                var $cross = this.$('.love-cross');
                var winH = $(window).height();
                $scene.addClass('scene1');
                $(window).scroll(function() {
                    var dis = $cross.offset().top - $(window).scrollTop();
                    if (dis > 0 - 170 && dis < winH - 170) {
                        $cross.addClass('crossed');
                    } else {
                        $cross.removeClass('crossed');
                    }
                    if (dis < 0) {
                        $scene.addClass('scene2').removeClass('scene1');
                    }
                    if (dis > -winH) {
                        $scene.removeClass('scene2').addClass('scene1');
                    }
                });
            }
        }))({el: $('#thegirl')});
        
        Views.StoryView = new (SectionView.extend({
            
        }))({el: $('#story')});
        
        Views.WeddingView = new (SectionView.extend({
            
        }))({el: $('#wedding')});
        
        Views.LaVieView = new (SectionView.extend({
            events: {
                'click .gallery img': 'previewImage'
            },
            previewImage: function(e) {
                var $img = $(e.currentTarget);
                window.WeixinJSBridge && window.WeixinJSBridge.invoke('imagePreview', {
                    current: $img[0].src,
                    urls: _.map($img.siblings('img').andSelf(), function(item) { return item.src; })
                });
            }
        }))({el: $('#lavie')});
        
        Views.HoneymoonView = new (SectionView.extend({
            events: {
                'click .gallery img': 'previewImage'
            },
            previewImage: function(e) {
                var $img = $(e.currentTarget);
                window.WeixinJSBridge && window.WeixinJSBridge.invoke('imagePreview', {
                    current: $img[0].src,
                    urls: _.map($img.siblings('img').andSelf(), function(item) { return item.src; })
                });
            }
        }))({el: $('#honeymoon')});
        
        Views.ContactView = new (SectionView.extend({
            events: { 'submit form': 'sendMessage' },
            initialize: function() {
                var API = 'http://api.toplist.oatpie.com/lovemessages/message/';
                var Message = Model.extend({ urlRoot: API });
                var Messages = Collection.extend({ url: API, model: Message });
                this.messages = new Messages();
                this.listenTo(this.messages, 'add', this.addMessage);
                this.listenTo(this.messages, 'reset', this.renderMessages);
                this.messages.fetch({reset: true, data: {site: 3}});
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
            }
        }))({el: $('#contact')});
    }
    
    /*************************************************************/
    
    function startApp() {
        $('.loading-text').addClass('hidden');
        $('.view-wrapper').removeClass('hidden');
        $('.view').css('min-height', $(window).height() + 50);
        $('img').each(function() {
            var src = $(this).data('src');
            src && $(this).attr('src', imageRoot + src);
        });
        $('.img').each(function() {
            var bg_src = $(this).data('bg-src');
            bg_src && $(this).css('background-image', 'url(' + imageRoot + bg_src + ')');
        });
        initViews();
    }
    
    var imageList = [
        "img/avatar.jpg",
        "img/boy/1.jpg", "img/boy/2.jpg", "img/boy/3.jpg", "img/boy/4.jpg",
        "img/girl/1.jpg", "img/girl/2.jpg", "img/girl/3.jpg", "img/girl/4.jpg", "img/girl/5.jpg", "img/girl/6.jpg",
        "img/couple/1.jpg", "img/couple/2.jpg", "img/couple/3.jpg", "img/couple/1.png",
        "img/lavie/1.jpg", "img/lavie/2.jpg", "img/lavie/3.jpg", "img/lavie/4.jpg",
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
