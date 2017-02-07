App.gui.add({
	_name: 'building-map-tooltip',
	selector: '.js-building-map [data-usetooltip]',
	build: function($el){
		$el.on('usetooltipdata.building-map-tooltip', function(e, $area, $tooltip){
			var id = $area.attr('data-id');
			var data = App.buildingData["korpus"]["floors"][id];
			
			$tooltip.find('[data-type="title"]').html(data.name);
			
			if(data.free == 0){
				$tooltip.find('[data-type="left"]').hide();
				$tooltip.find('[data-type="sold"]').show();
			} else {
				$tooltip.find('[data-type="left"]').show();
				$tooltip.find('[data-type="sold"]').hide();
				_.each(["room0", "room1", "room2", "room3"], function(type){
					if( data[type] == 0 ){
						$tooltip.find('[data-type="' + type + '"]').hide();
					} else {
						$tooltip.find('[data-type="' + type + '"]').show().find('[data-type="room-left"]').html( data[type] );
					}
				});
			}

		});

		return {
			destroy: function(){
				$el.off('.building-map-tooltip');
			}
		}
	},
	destroy: function($el, methods){
		if(methods && typeof methods['destroy'] == 'function') methods['destroy']();
	}
});

App.gui.add({
	_name: 'building-floors',
	selector: '.js-building-floors',
	build: function($el){
		var _checkScroll = function(){
			var scrollTop = $list.scrollTop();
			var innerHeight = $list.get(0).scrollHeight;
			var outerHeight = $list.height();
			
			$el[ (scrollTop != 0) ? 'addClass' : 'removeClass' ]( '__scroll-top' )
			$el[ Math.abs((outerHeight + scrollTop) - innerHeight) > 2 ? 'addClass' : 'removeClass' ]( '__scroll-bottom' )
		}

		var $list = $el.find('.js-building-floors-list').on('scroll.building-floors', _checkScroll);

		var _isLockedClick = false;

		var _lockClick = function(){
			if(_isLockedClick){ clearTimeout(_isLockedClick); }
			_isLockedClick = setTimeout(function(){ _isLockedClick = undefined; }, 300);
			$('html').off('click.lockClick').on('click.lockClick', function(e){
				if(_isLockedClick){ e.preventDefault(); _lockClick(); }
			})
		}

		var $arrows = $el.find('.js-building-floors-up,.js-building-floors-down').on('click', function(e){
			e.preventDefault();
			$list.scrollTop( $list.scrollTop() + ($(this).is('.js-building-floors-up') ? -61 : 61) );
			_checkScroll();
			_lockClick();
		});

		_checkScroll();

		return {
			destroy: function(){
				$list.off('.building-floors');
			}
		}
	},
	destroy: function($el, methods) {
		if (typeof methods['destroy'] !== 'function') {
			return;
		}
		methods['destroy']();
	}
})