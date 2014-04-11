$(function() {
    
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
        
    }))({el: $('#thebigday')});
    
    var ProposalView = new (SectionView.extend({
        
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
