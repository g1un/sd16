App.gui.add({
	_name: 'combobox',
	selector: 'select[data-select-custom="combobox"]',
	build: function($el) {
		var _resizeEvent, _self;
		$el.combobox({
			removeIfInvalid: false,
			toggleTitle: "",
			invalidLabel: "не найден"
		});
		_resizeEvent = App.onResize(function() {
			_self.refresh();
		});

		var instance = $el.combobox("instance")

		var $wrapper = instance.wrapper;

		$wrapper.append(instance.autocompleteInstance.menu.element);


		return _self = {
			refresh: function() {
				if ($('body').find($el).length < 1) {
					_self.destroy();
					return;
				}
			},
			destroy: function() {
				App.onResize.remove(_resizeEvent);
				if ($('body').find($el).length < 1) {
					return;
				}
				return $el.combobox("destroy");
			}
		};
	},
	destroy: function($el, methods) {
		if (typeof methods['destroy'] !== 'function') {
			return;
		}
		methods['destroy']();
	}
});