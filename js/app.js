$(function() {
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
    
    var ContactView = new (Backbone.View.extend({
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
                                   .css('opacity', 0).animate({opacity: 1})
            this.$('.messages').prepend($msg);
        },
        sendMessage: function(e) {
            if (e.preventDefault) e.preventDefault();
            var content = this.$('textarea').val();
            if (content) {
                this.messages.create({ site: 2, content: content });
                this.$('textarea').val('').attr('placeholder', '谢谢你的祝福！');
            }
        }
    }))({el: $('#contact')});
    
    function startApp() {
        $('img').each(function() {
            var src = $(this).data('src');
            src && $(this).attr('src', src);
        });
    }

    var imageList = ["img/lu/jimmy.jpg", "img/lu/sherry.jpg", "img/lu/kiss.png", "img/lu/togather.png",
                     "img/etoiles.png", "img/lu/wedding.jpg", "img/lu/xianhengjiudian.jpg"];

    var l = imageList.length;
    function imageLoaded() {
        l--;
        $('.loading-text>span').text(parseInt((1 - l / imageList.length) * 100) + '%');
        if (l == 0) {
            $('.loading-text').addClass('hidden');
            $('.view-wrapper').removeClass('hidden');
            startApp();
        }
    }

    for (var i = 0; i < imageList.length; i++) {
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