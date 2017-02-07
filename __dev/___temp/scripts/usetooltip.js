(function(){
"use strict";
App.gui.add({
	_name: 'usetooltip',
	selector: '[data-usetooltip]',
	build: function($el){
		var $tooltip = $( $el.attr('data-usetooltip') );
		if( $tooltip.length == 0 ){
			console.error('Tooltip', $el.attr('data-usetooltip'), 'not found');
			return;
		}

		var _area = App.areas($el);

		var resizeListener = App.onResize(function(){ setTimeout(function(){ _area.clearCache(); }, 10); });

		$el.on('mouseenter.usetooltip', function(){
			var isVisible = $tooltip.is(":visible");
			if(!isVisible){ $tooltip.show(); }

			$tooltip.css({
				top: '',
				left: ''
			})
			var $area = $(this);

			$area.trigger('usetooltipdata', [$area, $tooltip]);

			_area.clearCache();

			var pos = _area.getLeftCorners(true);
			pos = {
				x: Math.round((pos.top.x + pos.bottom.x)/2),
				y: Math.round((pos.top.y + pos.bottom.y)/2)
			}



			var $tooltipParent = $tooltip.offsetParent();
			var $areaParent = _area.getAreaParents($area).$parent;


			var offset = {
				x: 0,
				y: 0
			}
			if( $tooltipParent.get(0) !== $areaParent.get(0) ){
				offset.x = $areaParent.offset().left - $tooltipParent.offset().left;
				offset.y = $areaParent.offset().top - $tooltipParent.offset().top;
			}


			$tooltip.removeClass('__from-right');

			var tooltipSize = {
				width: $tooltip.outerWidth(),
				height: $tooltip.outerHeight(),
			}

			$tooltip.css({
				'top': pos.y + offset.y,
				'left': pos.x - tooltipSize.width + offset.x
			})

			if( $tooltip.offset().left < 0 ){
				pos = _area.getRightCorners(true);
				pos = {
					x: Math.round((pos.top.x + pos.bottom.x)/2),
					y: Math.round((pos.top.y + pos.bottom.y)/2)
				}

				$tooltip.css({
					'top': pos.y + offset.y,
					'left': pos.x + offset.x
				}).addClass('__from-right');
			}

			if( $tooltip.offset().left + tooltipSize.width > $('body').width() ){
				pos = _area.getLeftCorners(true);
				pos = {
					x: Math.round((pos.top.x + pos.bottom.x)/2),
					y: Math.round((pos.top.y + pos.bottom.y)/2)
				}

				$tooltip.css({
					'top': pos.y + offset.y,
					'left': pos.x + offset.x
				})
			}

			if(!isVisible){ $tooltip.hide(); }
			$tooltip.stop().fadeTo(100, 1);
		});

		$el.on('mouseleave.usetooltip', function(){
			$tooltip.stop().fadeOut(300);
		});


		if($tooltip.hasClass('__noleave')){
			$tooltip.on('mouseenter.complexmap-map-tooltip', function(){
				$tooltip.stop().fadeTo(100, 1);
			});
			$tooltip.on('mouseleave.complexmap-map-tooltip', function(){
				$tooltip.stop().fadeOut(300);
			});	
		}


		return {
			destroy: function(){
				App.onResize.remove(resizeListener)
				$el.off('.usetooltip');
			}
		}
	},
	destroy: function($el, methods){
		if(methods && typeof methods['destroy'] == 'function') methods['destroy']();
	}
})
})();