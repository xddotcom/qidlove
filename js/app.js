$(function() {
    
    var imageRoot = 'http://oatpie.qiniudn.com/jimmy/';
    
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
    
    var API = 'http://api.wedfairy.com';
    
    var ContactView = new (Backbone.View.extend({
        events: {
            'submit form': 'sendMessage'
        },
        initialize: function() {
            var Messages = Collection.extend({
                url: API + '/sites/story/2/wishes/',
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
                    story: 2,
                    message: content
                }, {
                    url: API + '/sites/wish/'
                });
                this.$('textarea').val('').attr('placeholder', '谢谢你的祝福！');
            }
        }
    }))({el: $('#contact')});
    
    function startApp() {
        $('img').each(function() {
            var src = $(this).data('src');
            src && $(this).attr('src', imageRoot + src);
        });
        $('.view-wrapper').removeClass('hidden');
        $('.loading-text').addClass('hidden');
        ContactView.messages.fetch({reset: true});
    }
    
    var imageList = ["img/lu/jimmy.jpg", "img/lu/sherry.jpg", "img/lu/kiss.png", "img/lu/togather.png",
                     "img/etoiles.png", "img/lu/wedding.jpg", "img/lu/xianhengjiudian.jpg"];
    
    var l = imageList.length;
    function imageLoaded() {
        l--;
        $('.loading-text>span').text(parseInt((1 - l / imageList.length) * 100) + '%');
        if (l == 0) {
            startApp();
        }
    }
    
    for (var i = 0; i < imageList.length; i++) {
        var image = new Image();
        image.onload = imageLoaded;
        image.src = imageRoot + imageList[i];
    }
    
    var match = window.location.search.match(/[\?\&]radius=(\d+)(&|$)/);
    var radius = match ? +match[1] : 0;
    var message = {
        "img_url" : 'http://love.oatpie.com/jimmy/img/lu/kiss.jpg',
        "img_width" : "640",
        "img_height" : "640",
        "link" : ['http://love.oatpie.com/jimmy', '?radius=', radius + 1].join(''),
        "desc" : "您一定不能错过这场温馨浪漫的婚礼，见证美丽的公主说出那句 Yes, I do !",
        "title" : "Jimmy & Sherry's Wedding Ceremony"
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
