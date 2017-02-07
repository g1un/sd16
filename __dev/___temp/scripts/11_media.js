(function(){
"use strict";
var SCREENS = ["WIDE_DESKTOP", "DESKTOP", "SMALL_DESKTOP", "TABLET", "SMALL_TABLET", "PHONE", "SMALL_PHONE"];

var $element, $wrapperWidth, $screenWidth;

var getElement = function(){
	if($element == null){
		$element = $('<div class="MEDIA_SCREENS"></div>');

		$wrapperWidth = $('<div class="MEDIA_SCREENS-wrapper-width"></div>');
		$wrapperWidth.appendTo( $element );

		$screenWidth = $('<div class="MEDIA_SCREENS-screen-width"></div>');
		$screenWidth.appendTo( $element );

		$element.css({
			position: 'absolute',
			width: 0,
			height: 0,
			overflow: 'hidden',
			visibility: 'hidden',
			top: 0,
			left: 0
		});

		$('body').append($element);
	}
	return {
		$element: $element,
		$wrapperWidth: $wrapperWidth,
		$screenWidth: $screenWidth
	}
}
var getCurrent = function(){
	var el = getElement();

	var index = parseInt(el.$element.css('z-index'));

	return {
		index: index,
		type: SCREENS[index],
		wrapperWidth: el.$wrapperWidth.width(),
		screenWidth: el.$screenWidth.width()
	}
}
var getMediaIndex = function(val){
	return _.indexOf(SCREENS, val.toUpperCase());
}

var current = {};

var listeners = [];

var eachListeners = function(handler){
	_.each(listeners, handler);
}

App.MEDIA = {
	_getListeners: function(){
		listeners.toString = function(){
			var result = [];
			_.each(this, function(item){
				var _item = {}
				_.each(item, function(val, key){
					_item[key] = (val || 'undefined').toString();
				})
				result.push(_item);
			})
			return JSON.stringify(result, null, '\t');
		}
		return listeners;
	},
	logging: false,
	_log: function(arg){
		if(!this.logging) return;
		console.debug.apply(console, ['[MEDIA]', arg]);
	},
	getMediaIndex: getMediaIndex,
	getCurrent: getCurrent,
	on: function(){
		var type, callback, minMax, disabledCallback;
		minMax = false;
		type = false;
		switch(arguments.length) {
			case 1:
				callback = arguments[0];
			break;
			case 2:
				type = arguments[0].toUpperCase();
				callback = arguments[1];
			break;
			case 3:
			case 4:
				type = arguments[0].toUpperCase();
				minMax = arguments[1];
				callback = arguments[2];
				disabledCallback = arguments[3];
			break;
		}
		if( typeof callback !== 'function' ){
			console.error( "Callback is'not function:", callback );
			return;
		}
		var object = {
			disabledCallback: disabledCallback,
			callback: callback,
			type: type,
			minMax: minMax
		};
		listeners.push(object);
		return {
			remove: function(){
				var index = 0;
				while (index < listeners.length) {
					if( listeners[index] == object ){
						listeners.splice(index, 1);
					} else {
						index++;
					}
				}
			}
		}
	},
	onMin: function(type, callback, disabledCallback){
		return this.on(type, 'min', callback, disabledCallback);
	},
	onMax: function(type, callback, disabledCallback){
		return this.on(type, 'max', callback, disabledCallback);
	},
	is: function(type, minMax){
		var _current = getCurrent();
		type = type.toUpperCase();
		if(type === _current.type) return true;
		var typeIndex = getMediaIndex(type);
		switch(minMax) {
			case 'min':
				if( _current.index <= typeIndex ) return true;
			break;
			case 'max':
				if( _current.index >= typeIndex ) return true;
			break;
		}
		return false;
	},
	isMin: function(type){ return this.is(type, 'min'); },
	isMax: function(type){ return this.is(type, 'max'); },
}
if(App.onMEDIAReady){ App.onMEDIAReady(); }

App.onResize(function(){
	var _current = getCurrent();
	if( current.type == _current.type ) return;
	current = _current;
	var _start = Date.now();

	var activate = function(listener, forse){
		if( !forse && listener.active ) return;
		listener.active = true;
		listener.callback(current, listener);
	}

	var disactivate = function(listener){
		if( !listener.active ) return;
		listener.active = false;
		if( listener.disabledCallback ){
			listener.disabledCallback(current, listener);
		}
	}



	eachListeners(function(listener){
		if( listener.type === false ){ activate(listener, true); return; }
		if( listener.type === current.type ){ activate(listener); return; };
		if( listener.minMax === false ){
			return disactivate(listener);
		}

		var send = false;
		var typeIndex = getMediaIndex(listener.type);
		if( typeIndex === -1 ){
			return disactivate(listener);
		}

		switch(listener.minMax) {
			case 'min': if( current.index <= typeIndex ) send = true; break;
			case 'max': if( current.index >= typeIndex ) send = true; break;
		}
		if(send){
			activate(listener);
		} else {
			disactivate(listener);
		}
	});

	App.MEDIA._log( '[ ' + current.type + ' ] Changed in ' + (Date.now() - _start) + ' ms.' )
});
})();