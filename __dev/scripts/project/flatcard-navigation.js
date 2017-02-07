App.gui.add({
	_name: 'flatcard-navigation',
	selector: '.js-flatcard-navigation',
	build: function($el){
		var _lockscroll = false;
		var _timeoutLock;
		$el.on('mousewheel.flatcard-navigation', function(e){
			if( _lockscroll ){
				e.preventDefault();
			}
			var delta = e.originalEvent.deltaY;
			if( Math.abs(delta) < 1 ) return;
			var width = $el.outerWidth();
			var innerWidth = $el.get(0).scrollWidth;
			var scrollLeft = $el.scrollLeft();

			if( delta > 0 ){
				if( scrollLeft + width == innerWidth ) return;
			} else {
				if(scrollLeft == 0) return;
			}
			scrollLeft += delta;
			_lockscroll = true;
			if(_timeoutLock){
				clearTimeout(_timeoutLock);
				_timeoutLock = undefined;
			}
			_timeoutLock = setTimeout(function(){
				_lockscroll = false;
				_timeoutLock = undefined;
			}, 100);
			e.preventDefault();
			$el.scrollLeft(scrollLeft);
			$el.trigger('scroll');
		});
		$el.on('tabchange.flatcard-navigation', function(e, $tab, $group){
			$el.scrollLeft( $tab.offset().left + $el.scrollLeft() - (parseInt($el.css('padding-left')) || 0) ).trigger('scroll');
		});
		$el.on('scroll.flatcard-navigation', function(){
			$('.js-flatcard-navigation-wrapper')
				[ $el.scrollLeft() == 0 ? 'addClass' : 'removeClass' ]('__start')
				[ $el.scrollLeft() + $el.outerWidth() == $el.get(0).scrollWidth ? 'addClass' : 'removeClass' ]('__end');
		});

		$('.js-flatcard-navigation-prev,.js-flatcard-navigation-next').on('click', function(e){
			e.preventDefault();
			var isPrev = $(this).is('.js-flatcard-navigation-prev');
			$el.scrollLeft( $el.scrollLeft() + ( isPrev ? -50 : 50 ) );
		})
	},
	destroy: function($el){
		$el.off('.flatcard-navigation');
		$('.js-flatcard-navigation-prev,.js-flatcard-navigation-next').off('.flatcard-navigation');
	}
})