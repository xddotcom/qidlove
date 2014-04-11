$(function() {
    
    var scroller;
    
    var SectionView = Backbone.View.extend({
        onEnter: function() {},
        onLeave: function() {}
    });
    
    var HeroView = new (SectionView.extend({
        
    }))({el: $('#hero')});
    
    var TheGirlView = new (SectionView.extend({
        onEnter: function() {
            this.$('.img').removeClass('invisible');
        },
        onLeave: function() {
            this.$('.img').addClass('invisible');
        }
    }))({el: $('#thegirl')});
    
    var TheBigDayView = new (SectionView.extend({
        onEnter: function() {
            var $timeline = this.$('.timeline');
            var gap = $timeline.outerHeight() - this.$el.innerHeight();
            var translate = 'translate3d(0, ' + (-gap) + 'px, 0)';
            $timeline.removeClass('invisible').addClass('animate');
            $timeline.css({
                '-webkit-transform': translate,
                'transform': translate
            });
            //scroller.disable();
            //setTimeout(function() { scroller.enable(); }, 10000);
        },
        onLeave: function() {
            var $timeline = this.$('.timeline');
            $timeline.addClass('invisible').removeClass('animate');
            $timeline.css({
                '-webkit-transform': 'translate3d(0, 0, 0)',
                'transform': 'translate3d(0, 0, 0)'
            });
        }
    }))({el: $('#thebigday')});
    
    var ProposalView = new (SectionView.extend({
        onEnter: function() {
            this.$('.rose-cover').removeClass('invisible');
        },
        onLeave: function() {
            this.$('.rose-cover').addClass('invisible');
        }
    }))({el: $('#proposal')});
    
    var GoodNightView = new (SectionView.extend({
        
    }))({el: $('#goodnight')});
    
    var GoodMorningView = new (SectionView.extend({
        
    }))({el: $('#goodmorning')});
    
    var LaVieView = new (SectionView.extend({
        
    }))({el: $('#lavie')});
    
    var HoneymoonView = new (SectionView.extend({
        
    }))({el: $('#honeymoon')});
    
    var ContactView = new (SectionView.extend({
        
    }))({el: $('#contact')});
    
    /*************************************************************/
    
    $('.view').css('height', $('.view-wrapper').innerHeight());
    scroller = new IScroll('.view-wrapper', {
        momentum: false,
        bounce: false,
        snap: true,
        snapThreshold: 0.001,
        snapSpeed: 500,
        mouseWheel: true
    });
    var sectionList = [HeroView, TheGirlView, TheBigDayView, ProposalView,
                       GoodNightView, GoodMorningView, LaVieView, HoneymoonView, ContactView];
    scroller.on('scrollEnd', function() {
        var page = scroller.currentPage.pageY;
        sectionList[page] && sectionList[page].onEnter();
        sectionList[page+1] && sectionList[page+1].onLeave();
        sectionList[page-1] && sectionList[page-1].onLeave();
    });
});
