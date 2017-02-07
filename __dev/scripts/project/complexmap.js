App.gui.add({
	_name: 'complexmap-map-selected',
	selector: '.js-complexmap-map area.js-selected-build',
	build: function($el){
		var $map = $el.closest('.js-complexmap-map-block');

		var $target;

		var resizeListener = App.onResize(function(){
			self.refresh();
		});
		var loadListener = App.onLoad(function(){
			self.refresh();
		});

		var _area = App.areas($el);
		var _timeout;

		var self = {
			refresh: function(delay){
				if(_timeout){ clearTimeout(_timeout); }

				$target = $map.find('.complexmap-selected-pointer')
				if($target.length < 1){
					$target = $('<div class="complexmap-selected-pointer"></div>').appendTo($map.find('map').parent());
				}
				$target.hide();

				_timeout = setTimeout(function(){
					_area.clearCache();
					var center = _area.getCenter(true);
					$target.css({
						left: center.x,
						top: center.y
					});
					if($map.is(":visible")){ $target.show(); }
					_timeout = false;
				}, (delay > 0 ? delay : 100));

				if( $el.closest('map').find('area.highlight').length == 0 ){
					$el.closest('[data-usemaparea]').trigger('mapareacall', ['centeringArea', $el])
				}
			},
			destroy: function(){
				$target.remove();
				App.onResize.remove(resizeListener);
				App.onLoad.remove(loadListener);
				_area = undefined;
				if(_timeout){ clearTimeout(_timeout); }
			}
		}
		self.refresh();
		return self;
	},
	refresh: function($el, methods){
		if(methods && typeof methods['refresh'] == 'function') methods['refresh']();
	},
	destroy: function($el, methods){
		if(methods && typeof methods['destroy'] == 'function') methods['destroy']();
	}
});


App.gui.add({
	_name: 'complexmap-map-tooltip',
	selector: '.js-complexmap-map-block [data-usetooltip]',
	build: function($el){
		$el.on('usetooltipdata.complexmap-map-tooltip', function(e, $area, $tooltip){
			var count = $area.attr('data-flat');
			var queue = $area.attr('data-queue');
			var href = $area.attr('data-href');
			var name = $area.attr('data-name');
			var time = $area.attr('data-time');
			var put = $area.attr('data-put');
			if(count == "0"){
				$tooltip.find('[data-type="left"]').hide();
				$tooltip.find('[data-type="sold"]').show();
			} else {
				$tooltip.find('[data-type="left"]').show();
				$tooltip.find('[data-type="left-count"]').html( count ).attr("href", href);
				$tooltip.find('[data-type="sold"]').hide();
			}
			$tooltip.find('[data-type="settlement"]')[ put == "0" ? "hide" : "show" ]();
			$tooltip.find('[data-type="name"]').html( name );
			$tooltip.find('[data-type="queue"]').html( queue );
			$tooltip.find('[data-type="time"]').html( time );
		});

		return {
			destroy: function(){
				$el.off('usetooltipdata.complexmap-map-tooltip');
			}
		}
	},
	destroy: function($el, methods){
		if(methods && typeof methods['destroy'] == 'function') methods['destroy']();
	}
});


App.onLiveClick('[data-complexmap-trigger-element]', function(e){
	e.preventDefault();
	$('[data-complexmap-trigger]').removeClass('highlight').filter('[data-complexmap-trigger="' + $(this).attr('data-complexmap-trigger-element') + '"]').addClass('highlight');
	$('.js-complexmap-map').trigger('refreshMap').trigger('map-highlight');
});