
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
        initialize: function() {
            _.bindAll(this, 'switchGirlPhoto', 'resetGirlPhoto');
        },
        switchGirlPhoto: function() {
            this.$('.img-the-girl').addClass('switch');
        },
        resetGirlPhoto: function() {
            this.$('.img-the-girl').removeClass('switch');
        },
        onEnter: function() {
            this.$('.shy-girl').addClass('invisible');
            this.$('.love-cross').addClass('crossed');
            //scroller.on('scrollStart', this.switchGirlPhoto);
            //scroller.on('scrollEnd', this.resetGirlPhoto);
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
    }))({el: $('#thebigday')});
    
    var HoneymoonView = new (SectionView.extend({
        
    }))({el: $('#honeymoon')});
    
    var ContactView = new (SectionView.extend({
        
    }))({el: $('#contact')});
    
    /*************************************************************/
    $('.view').css('height', $('.view-wrapper').innerHeight());

    var sectionList = [WeddingView, TheGirlView, TheBigDayView, HoneymoonView, ContactView];
    //var sectionList = [HeroView, WeddingView, TheGirlView, TheBigDayView, HoneymoonView, ContactView];
    
    var initScroll=function(){
        return new IScroll('.view-wrapper', {
            momentum: false,
            bounce: false,
            snap: true,
            snapSpeed: 500,
            mouseWheel: true
        });
    }

    var phoneScroll = new IScroll('.phoneScrollBar', {
        momentum: false,
        scrollX: true,
        scrollY: false,
        bounce: false,
        snap: false,
        snapSpeed: 500,
        mouseWheel: true
    });
    phoneScroll.scrollToElement('.call-button',0);

    var removeHero = function(){
        $('#hero').remove();
        setTimeout(function(){
            scroller=initScroll();
            scroller.on('scrollEnd', function() {
                var page = scroller.currentPage.pageY;
                sectionList[page] && sectionList[page].onEnter();
                sectionList[page+1] && sectionList[page+1].onLeave();
                sectionList[page-1] && sectionList[page-1].onLeave();
            });
        },0);
    };

    phoneScroll.on('scrollEnd', function() {
        if(this.x>=-20){
            phoneScroll.scrollToElement('.call-button-dummy', 1000);
            $('.view-wrapper-inner').one('webkitAnimationEnd',removeHero);
            $('.view-wrapper-inner').addClass('init');          
        }
        else{
            phoneScroll.scrollToElement('.call-button', 1000);
        }
    });
    //$('.phoneScrollWrapper').on('webkitTransitionEnd', function() {   
});
