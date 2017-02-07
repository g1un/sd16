(function(){
"use strict";
App.usemaplightStyles = {
	default: {
		classStyle: {
			'state-hover': {
				fill: 'rgba(255,255,255,0)',
				stroke: {
					style: '#007cbf',
					width: 5
				},
				without: ['.__sold_flat', '.__disabled', '.__selected']
			},
			'__selected': {
				fill: 'rgba(255,255,255,0)',
				stroke: {
					style: '#006298',
					width: 5
				}
			},
			'__disabled': {
				fill: 'rgba(182, 182, 182, 0.5)',
				stroke: false
			},
			'__sold_flat': {
				fill: 'rgba(182, 182, 182, 0.5)',
				stroke: false,
				without: ['.__disabled']
			}
		}
	},
	'complexmap': {
		classStyle: {
			'state-hover': {
				fill: 'rgba(0, 98, 152, 0.5)',
				stroke: false,
				without: ['.js-not-instock', '[data-complexmap-trigger]']
			},
			'highlight': {
				fill: 'rgba(100, 255, 100, 0.5)',
				stroke: false,
				without: ['.state-hover']
			}
		},
		ENTER: function(e, $area) {
			$area.closest('map').find('area.highlight').removeClass('highlight')
		}
	},
	'buildingmap': {
		classStyle: {
			'state-hover': {
				fill: 'rgba(0, 98, 152, 0.5)',
				stroke: false,
				without: ['.js-not-instock', '[data-complexmap-trigger]']
			},
			'highlight': {
				fill: 'rgba(100, 255, 100, 0.5)',
				stroke: false,
				without: ['.state-hover']
			}
		},
		ENTER: function(e, $area) {
			$area.closest('map').find('area.highlight').removeClass('highlight')
		}
	}
}

App.gui.add({
	_name: 'usemaplight',
	selector: '[data-usemaplight]:not(.__usemaplightinited)',
	build: function($el){

		$el.addClass('__usemaplightinited');

		var _options = App.usemaplightStyles[ $el.attr('data-usemaplight') ] || App.usemaplightStyles.default;

		var maplight = $el.maplight(_options);
		$el.on('refreshMap', function() { maplight.refreshMap(); });
		App.onLoad(function(){ maplight.refreshMap(); });


		return {
			refresh: function(){
				maplight.refreshMap();
			}
		}

	},
	refresh: function($el, methods){
		if(methods && typeof methods['refresh'] == 'function') methods['refresh']();
	},
	destroy: function(){}
})
})();