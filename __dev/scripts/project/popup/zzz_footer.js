App.popup = Popup;
App.popup._proto = _proto;

var _methods = ['open', 'close'];

_.each(_methods, function(_method){
	$('html').on('click', '[data-popup-' + _method + ']', function(e){
		var _timestamp = App.timestamp();

		e.preventDefault();
		var $this = $(this);

		var popup = App.popup($this.attr('data-popup-' + _method), {clickTarget: $this});
		if(!popup) return;

		var popupOptions = {};

		App.saveMe(function(){
			if( $this.hasAttr('data-popup-options') ){
				popupOptions = $this.attr('data-popup-options');
				popupOptions = eval( '[' + popupOptions + ']' )[0];
				if( !(popupOptions && typeof popupOptions == 'object') ){
					popupOptions = {};
				}
			}
		}, function(){
			popupOptions = {};
		});

		popupOptions = $.extend({
			clicked: true,
			$clickTarget: $this
		}, popupOptions);

		popup[_method](false, popupOptions);

		console.debug(_timestamp());
	})
})
App.onResize(function(){
	Popup.getVisible().each(function(){
		var _popup = $(this).data('uipopup')
		_popup.refreshSize();
		if(_popup.isRelative()){
			_popup.calcRelativePosition();
		}
	})
})