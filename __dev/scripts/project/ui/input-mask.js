App.gui.add({
	_name: 'input-mask',
	selector: 'input[data-mask]',
	build: function($el) {
		$el.mask($el.attr('data-mask'))
	},
	destroy: function($el) {
		$el.unmask()
	}
})