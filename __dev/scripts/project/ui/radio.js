// App.gui.add({
// 	_name: 'radio',
// 	selector: 'input[type="radio"]',
// 	build: function($el) {
// 		var $inputWrapper, $label, _changed, _checkHandler, _getLabel;
// 		_getLabel = function(_$el) {
// 			var _$label;
// 			_$label = _$el.closest('label');
// 			if (_$label.length < 1) {
// 				_$label = $('label[for="' + _$el.attr('id') + '"]');
// 			}
// 			if (_$label.length < 1) {
// 				return false;
// 			}
// 			return _$label;
// 		};
// 		$label = _getLabel($el);
// 		if (!$label) {
// 			return false;
// 		}
// 		$inputWrapper = $('<span class="uiradio-input-wrapper"></span>');
// 		$inputWrapper.insertBefore($el).append($el);
// 		$label.addClass('uiradio-label').addClass('ui-type-radio').wrapInner('<div class="ui-button-text"></div>');
// 		$el.addClass('uiradio-input');
// 		_checkHandler = function() {
// 			var _$label, isChecked, uiradioData;
// 			isChecked = this.checked;
// 			uiradioData = $(this).data('uiradio');
// 			_$label = _getLabel($(this));
// 			if (!_$label) {
// 				return;
// 			}
// 			if (isChecked) {
// 				$(this).addClass('state-checked').addClass('ui-state-active');
// 				_$label.addClass('state-checked').addClass('ui-state-active');
// 			} else {
// 				$(this).removeClass('state-checked').removeClass('ui-state-active');
// 				_$label.removeClass('state-checked').removeClass('ui-state-active');
// 			}
// 		};
// 		_changed = false;
// 		$label.on('click.uiradioevents', function() {
// 			this.checked = true;
// 			_.delay(function() {
// 				if (_changed) {
// 					return;
// 				}
// 				_changed = false;
// 				$el.trigger('change');
// 			}, 10);
// 			return true;
// 		});
// 		$el.on('change.uiradioevents', function() {
// 			_changed = true;
// 			$('[name="' + $(this).attr('name') + '"]').each(_checkHandler);
// 		});
// 		_checkHandler.call($el.get(0));
// 		return function() {
// 			$el.insertAfter($inputWrapper);
// 			$inputWrapper.remove();
// 			$el.off('.uiradioevents').removeClass('state-checked').removeClass('ui-state-active').removeClass('uiradio-input');
// 			$label.removeClass('state-checked').removeClass('ui-state-active').removeClass('uiradio-label').removeClass('ui-type-radio');
// 			$label.find('.ui-button-text').parent().append($label.find('.ui-button-text').contents());
// 			$label.find('.ui-button-text').remove();
// 		};
// 	},
// 	destroy: function($el, destroy) {
// 		if (!destroy) {
// 			return;
// 		}
// 		destroy();
// 		return true;
// 	}
// });