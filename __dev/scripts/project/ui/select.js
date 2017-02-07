App.gui.add({
	_name: 'select',
	selector: 'select:not([data-select-custom])',
	build: function($el) {
		var _resizeEvent, _self;
		$el.selectmenu({
			change: function() {
				$el.trigger('change');
			}
		});

		var instance = $el.selectmenu("instance")

		var $wrapper = $('<div class="ui-selectmenu-wrapper"></div>')

		$wrapper.insertBefore(instance.button);
		$wrapper.append(instance.button);
		$wrapper.append(instance.menuWrap);

		_resizeEvent = App.onResize(function() {
			_self.refresh(true);
		});

		var _changed = function() {
			$wrapper[$el.find('option:selected').hasAttr('disabled') ? 'addClass' : 'removeClass']('__selected-disabled')
		}

		$el.on('change.uiselect', _changed);
		_changed();
		_self = {
			refresh: function(isResize) {
				if ($('body').find($el).length < 1) {
					_self.destroy();
					return;
				}
				$el.selectmenu("instance").button.css("width", "")
				if(!isResize){
					$el.selectmenu("refresh")
				}
				$el.selectmenu("instance")._resizeButton();
			},
			destroy: function() {
				App.onResize.remove(_resizeEvent);
				if ($('body').find($el).length < 1) {
					return;
				}
				$el.selectmenu("destroy");
				$wrapper.remove();
				$el.off('resetfix')
				$el.off('.uiselect')
			}
		};
		$el.off('resetfix').on('resetfix', _self.refresh);
		return _self;
	},
	refresh: function($el, methods) {
		if (typeof methods['refresh'] !== 'function') {
			return;
		}
		methods['refresh']();
	},
	destroy: function($el, methods) {
		if (typeof methods['destroy'] !== 'function') {
			return;
		}
		methods['destroy']();
	}
});