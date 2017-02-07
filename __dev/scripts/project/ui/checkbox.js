// App.gui.add({
// 	_name: 'checkbox',
// 	selector: 'input[type="checkbox"]',
// 	build: function($el) {
// 		var $label = $el.closest('label')
// 		if ($label.length > 0) {
// 			if (!$el.hasAttr('id')) {
// 				$el.uniqueId()
// 			}
// 			if (!$label.hasAttr('for')) {
// 				$label.attr('for', $el.attr('id'))
// 			}
// 		}
// 		return $el.button().button("widget").addClass('ui-type-checkbox');
// 	},
// 	refresh: function($el) {
// 		$el.button("refresh");
// 		return true;
// 	},
// 	destroy: function($el) {
// 		$el.button("widget").removeClass('ui-type-checkbox');
// 		$el.button("destroy");
// 		return true;
// 	}
// });