App.gui.add({
	_name: 'floor-map-tooltip',
	selector: '.js-floor-map [data-usetooltip]',
	build: function($el){
		$el.on('usetooltipdata.floor-map-tooltip', function(e, $area, $tooltip){
			var id = $area.attr('data-id');
			var data = App.floorData["flats"][id];
			$tooltip.find('[data-type="title"]').html( data.name );

			_.each(["square", "decoration", "state-label", "price"], function(type){
				$tooltip.find('[data-type="' + type + '"]').find('[data-type="cell-value"]').html( data[type] );
			});

			$tooltip.find('[data-type="price"]')[ data.state === "0" ? "show" : "hide" ]();

		});

		return {
			destroy: function(){
				$el.off('.floor-map-tooltip');
			}
		}
	},
	destroy: function($el, methods){
		if(methods && typeof methods['destroy'] == 'function') methods['destroy']();
	}
});