App.gui.add({
	_name: 'clearwhitespace',
	selector: '[data-clearwhitespace]',
	build: function($el){
		$el.cleanWhitespace().attr('data-clearwhitespace', 'cleared');
	},
	destroy: function(){}
})