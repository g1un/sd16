App.gui.add({
	_name: 'form-line-clearwhitespace',
	selector: '.form-line',
	build: function($el){
		$el.cleanWhitespace().attr('data-clearwhitespace', 'cleared');
	},
	destroy: function(){}
})

App.run(function(){
	App.gui.add({
		_name: 'group-checkbox',
		selector: '[data-group-checkbox]',
		build: function($el){
			var isAll = $el.is('[data-group-checkbox-all]');

			var $group = $('[data-group-checkbox="' + $el.attr('data-group-checkbox') + '"]');
			var $groupWithoutAll = $group.not('[data-group-checkbox-all]');
			var $all = $group.filter('[data-group-checkbox-all]');

			var _check = function(){
				if( isAll ){
					if(this.checked){
						$groupWithoutAll.each(function(){ this.checked = false; }).trigger('uirefresh');
					} else {
						$groupWithoutAll.each(function(){ this.checked = $(this).data('was-checked') || false; }).trigger('uirefresh');
					}
				} else {
					var $checked = $groupWithoutAll.filter(function(){ return this.checked });
					$(this).data('was-checked', this.checked);

					if( $checked.length == $groupWithoutAll.length ){
						$groupWithoutAll.each(function(){ this.checked = false; })
						$all.get(0).checked = true;
					} else {
						if( $checked.length ){
							$all.get(0).checked = false;
						} else {
							$all.get(0).checked = true;
						}
					}
					$group.trigger('uirefresh');
				}
			}

			$el.on('change.group-checkbox', _check);
			_check.apply( $el.get(0) );

			return {
				destroy: function(){
					$el.off('.group-checkbox');
				}
			}
		},
		destroy: function($el, methods){
			if(methods && typeof methods['destroy'] == 'function') methods['destroy']();
		}
	})
});