;(function(){

	App.gui.add({
		_name: 'radio',
		selector: 'input[type="radio"],input[type="checkbox"]',
		build: function($el) {
			var el = $el.get(0);
			var changed = function(){
				$el[ el.checked ? 'addClass' : 'removeClass' ]('-checked');
			}
			var eventFamily = '.' + App.getUniqKey();

			$el.on('change' + eventFamily, changed);
			$el.on('uirefresh' + eventFamily, changed);

			$('html').on('change' + eventFamily, 'input[type="radio"],input[type="checkbox"]', changed);
			changed();

			return {
				destroy: function(){
					$('html').off(eventFamily);
					$el.off(eventFamily);
				}
			}
		},
		destroy: function($el, methods){
			if(methods && typeof methods['destroy'] == 'function') methods['destroy']();
		}
	});

})();