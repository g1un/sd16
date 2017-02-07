App.gui.add({
	_name: 'input-autocomplete',
	selector: 'input[data-autocomplete]',
	build: function($el) {
		var _options, attrs;
		_options = {
			response: function(event, ui) {
				var curVal, item, j, len, ref;
				curVal = $(event.target).val();
				ref = ui.content;
				for (j = 0, len = ref.length; j < len; j++) {
					item = ref[j];
					item.label = item.label.replace(new RegExp(curVal, 'g'), "<b>" + curVal + "</b>");
				}
			}
		};
		attrs = App.getAttrs($el, 'autocomplete').getAll()._self;
		attrs = App.parseValueString(attrs);
		if (typeof attrs === 'function') {
			attrs = attrs($el);
		}
		_options = $.extend({}, _options, attrs);
		$el.autocomplete(_options);


		var instance = $el.selectmenu("instance")

		return {
			destroy: function() {
				return $el.autocomplete("destroy");
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

App.gui.add({
	_name: 'select-autocomplete',
	selector: 'select[data-select-custom="autocomplete"]',
	build: function($el) {
		var $wrapper = $('<div class="select-autocomplete"></div>');
		$wrapper.insertAfter($el);
		$wrapper.append($el);
		var $input = $('<input type="text" class="select-autocomplete-input" />');
		$wrapper.append($input);

		var _options, attrs;
		_options = {
			response: function(event, ui) {
				var curVal, item, j, len, ref;
				curVal = $(event.target).val();
				ref = ui.content;
				for (j = 0, len = ref.length; j < len; j++) {
					item = ref[j];
					item.label = item.label.replace(new RegExp(curVal, 'g'), "<b>" + curVal + "</b>");
				}
			}
		};
		attrs = App.getAttrs($el, 'autocomplete').getAll()._self;
		attrs = App.parseValueString(attrs);
		if (typeof attrs === 'function') {
			attrs = attrs($el);
		}
		_options = $.extend({}, _options, attrs);
		_options.source = $el.find('option').map(function(){
			return $.trim( $(this).text() );
		}).toArray();
		$input.autocomplete(_options);


		var instance = $input.autocomplete("instance");
		$wrapper.append(instance.menu.element);

		$input.on('input.select-autocomplete change.select-autocomplete autocompletechange.select-autocomplete autocompleteselect.select-autocomplete', function(){
			var $this = $(this);
			setTimeout(function(){
				var val = $.trim( $this.val() );
				var $result = $el.find('option:contains("' + val + '")');
				if($result.length == 1 && val == $.trim($result.text()) ){
					$el.val( $result.val() );
					$el.trigger('change');
				} else {
					$el.val( null );
				}
			}, 10)
		})

		return {
			destroy: function() {
				$input.off('.select-autocomplete');
				$el.insertAfter($wrapper);
				$input.autocomplete("destroy");
				$wrapper.remove();
			}
		};
	},
	destroy: function($el, methods) {
		if (typeof methods['destroy'] !== 'function') {
			return;
		}
		methods['destroy']();
	}
})