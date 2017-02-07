if ($['ui']) {
	if ($.ui['autocomplete'])
		$.ui.autocomplete.prototype._renderItem = function(ul, item) {
			return $("<li>").html(item.label).appendTo(ul);
		}
	if ($.ui['selectmenu'])
		$.ui.selectmenu.prototype._resizeMenu = function() {
			this.menu.outerWidth(this.button.outerWidth());
		}

	if ($.ui['autocomplete'])
		$.ui.autocomplete.prototype.refresh = function() {
			this._resizeMenu();
		}
	if ($.ui['autocomplete'])
		$.ui.autocomplete.prototype._resizeMenu = function() {
			var ul = this.menu.element;
			ul.outerWidth(this.element.outerWidth());
		}
}
// if (window['Slick']) {
// 	window.Slick.prototype.resize = function() {
// 		console.log('custom resize')
// 		var _ = this;
// 		if ($(window).width() !== _.windowWidth || true) {
// 			console.log('resize Slick')
// 			clearTimeout(_.windowDelay);
// 			_.windowDelay = window.setTimeout(function() {
// 				_.windowWidth = $(window).width();
// 				_.checkResponsive();
// 				if (!_.unslicked) { _.setPosition(); }
// 			}, 50);
// 		}
// 	};
// }
if (window['Slick'] != null) {
	Slick.prototype.resize = function() {
		var _ = this;
		clearTimeout(_.windowDelay);
		// _.windowDelay = window.setTimeout(function() {
			_.windowWidth = $(window).width();
			_.checkResponsive();
			if (!_.unslicked) _.setPosition();
			return
		// }, 1);
	}
}
App.onReady(function() {
	$('body').on('click', 'form [type="reset"]', function() {
		var $form = $(this).closest('form');
		_.delay(function() {
			$form.find('.ui-slider, select').trigger('resetfix');
		}, 10);
	})
});
