App.gui.add({
	_name: 'horizontal-wheelscroll',
	selector: '.js-horizontal-wheelscroll',
	build: function($el){
		var _lockscroll = false;
		var _timeoutLock;
		$el.on('mousewheel.horizontal-wheelscroll', function(e){
			if( _lockscroll ){
				e.preventDefault();
			}
			var delta = e.originalEvent.deltaY;
			if( Math.abs(delta) < 1 ) return;
			var width = $el.width();
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
		});
		$el.on('tabchange.horizontal-wheelscroll', function(e, $tab, $group){
			$el.scrollLeft( $tab.offset().left + $el.scrollLeft() - (parseInt($el.css('padding-left')) || 0) );
		})
	},
	destroy: function($el){
		$el.off('.horizontal-wheelscroll')
	}
})