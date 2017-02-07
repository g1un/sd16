(function(){
"use strict";
window.App = window.App || {}

App.__timestamp = (function(){
	var self = {};
	self.__init = Date.now();
	$(document).ready(function(){ self.__ready = Date.now(); });
	$(document).ready(function(){
		var _start = Date.now();
		setTimeout(function(){ self.__allready = Date.now() - 100; }, 100);
	});
	$(window).load(function(){ self.__loaded = Date.now(); });
	self.getResult = function(){
		return {
			ready: (self.__ready - self.__init),
			allready: (self.__allready - self.__init),
			loaded: (self.__loaded - self.__init)
		}
	}
	return self;
})();

$(window).load(function(){
	setTimeout(function(){
		if( !App.isFrontDev() ) return;
		var results = App.__timestamp.getResult();
		console.info("[ Ready    ] " + results.ready + "ms.");
		console.info("[ AllReady ] " + results.allready + "ms.");
		console.info("[ Loaded   ] " + results.loaded + "ms.");
	}, 100);
});

$('html').removeClass('no-js').addClass('js')
$('html').addClass('__not-ready')
$(document).ready(function () {
	setTimeout(function () {
		$('html')
			.removeClass('__not-ready')
			.addClass('__ready')
	}, 100);
});

if (window.console == null) {
	window.console = function () {
	}
}
if (window.console.log == null) {
	window.console.log = function () {
	}
}
if (window.console.info == null) {
	window.console.info = window.console.log
}
if (window.console.debug == null) {
	window.console.debug = window.console.log
}
if (window.console.error == null) {
	window.console.error = window.console.log
}

$.fn.hasAttr = function (name) {
	return (this.attr(name) != undefined && this.attr != false)
}
$.fn.throwTo = function (handler) {
	var args = [];
	for (var i = 1, _len = arguments.length; i < _len; i++) {
		args.push(arguments[i]);
	}
	args.unshift(this);
	handler.apply(this, args);
	return this;
}
$.fn.eachThrowTo = function (handler) {
	var args = [];
	for (var i = 1, _len = arguments.length; i < _len; i++) {
		args.push(arguments[i]);
	}
	this.each(function () {
		var _args = args.slice(0);
		_args.unshift(handler);
		$.fn.throwTo.apply($(this), _args);
	})
	return this;
}
$.fn.cleanWhitespace = function () {
	if (this.length > 1) {
		this.each(function () {
			$(this).cleanWhitespace();
		})
		return this;
	} else if (this.length < 1) {
		return this;
	}
	this.contents().filter(function () {
		return (this.nodeType == 3 && !/\S/.test(this.nodeValue));
	}).remove();
	return this;
}

App.run = function (handler) {
	return handler();
}

App.DoList = function (params) {
	// var _list = {};
	var _list = [];
	var _onAddNewListeners = []
	if (params == null) params = {};

	var _addNewListener = function (func, oneCall, prepend) {
		if (oneCall == null) oneCall = false;
		var id = _.random(1, 999999)
		while (_list[id] != null) {
			id = _.random(1, 999999)
		}
		var _item = {
			handler: func,
			isOneCall: oneCall,
			id: id
		}
		if(prepend){
			_list.unshift(_item);
		} else {
			_list.push(_item);
		}
		// _list[id] = func
		// _list[id].isOneCall = oneCall
		// _list[id].idEvent = id
		_.each(_onAddNewListeners, function (listener) {
			listener(_item);
		});
		return id;
	}

	var _callListener = function (listener, arg) {
		if (typeof listener.handler == 'function') {
			if (params['async']) {
				_.delay(function () {
					listener.handler.apply(_this, arg)
				}, 1);
			} else {
				listener.handler.apply(_this, arg)
			}
			if (listener.isOneCall) {
				_this.remove(listener.id)
			}
		}
		return this
	}
	var _sendToListeners = function (arg) {
		_.each(_list, function (fn) {
			// _callListener(fn, arg);
			_callListener(fn, arg);
		});
		return true
	}

	var _this = function (arg, oneCall) {
		if (oneCall == null) oneCall = false;

		if (typeof arg == 'function') {
			return _addNewListener(arg, oneCall)
		}
		else {
			if (!_.isArray(arg)) {
				arg = [arg]
			}
			return _sendToListeners(arg);
		}

	}
	_this.remove = function (idEvent) {
		_.each(function(item, index, arr){
			if(item.id == idEvent){
				arr.splice(index, 1);
			}
		})
		// if (_list[idEvent] != null) {
		// 	delete _list[idEvent]
		// }
	}
	_this.getList = function () {
		return list;
	}
	_this.callListener = _callListener
	_this.onAddNewListener = function (handler) {
		if (typeof handler == 'function') _onAddNewListeners.push(handler)
		return this
	}
	_this.prepend = function(arg, oneCall){
		return _addNewListener(arg, oneCall, true);
	}
	return _this
}

App.onReady = App.DoList({async: true})
App.onLoad = App.DoList({async: true})
App.onScroll = App.DoList()
App.onResize = App.DoList()
App.onChangeDOM = App.DoList()

App.onReady.onAddNewListener(function (listener) {
	if (App._isReady) {
		App.onReady.callListener(listener)
	}
})
App.onLoad.onAddNewListener(function (listener) {
	if (App._isLoad) {
		App.onLoad.callListener(listener);
	}
})

App.getWindowScroll = function () {
	return {top: $(window).scrollTop(), left: $(window).scrollLeft()}
}

App.getWindowSize = function () {
	return {width: $(window).width(), height: $(window).height()}
}

App.getPageSize = function () {
	return {width: $('body').outerWidth(true), height: $('body').outerHeight(true)}
}

$(document).ready(function (e) {
	App.onReady();
	App._isReady = true;
	App.onScroll([App.getWindowScroll(), e]);
	App.onResize([App.getWindowSize(), e]);
	return true;
})

$(window).scroll(function (e) {
	App.onScroll([App.getWindowScroll(), e]);
})

$(window).load(function (e) {
	App.onLoad();
	App._isLoad = true;
	App.onScroll([App.getWindowScroll(), e]);
	App.onResize([App.getWindowSize(), e]);
	return true
});
setTimeout(function(){
	$(window).resize(function (e) {
		App.onResize([App.getWindowSize(), e]);
	});
}, 100);
$(window).on('orientationchange', function (e) {
	App.onResize([App.getWindowSize(), e]);
})
$('html').on('DOMChanged', function (e) {
	App.onChangeDOM($(e.target));
})

App.onChangeDOM(function () {
	App.onResize([App.getWindowSize(), null]);
})

App.triggerResize = function () {
	$(window).trigger('resize')
};
App.triggerScroll = function () {
	$(window).trigger('scroll')
};

App.onReady(function () {
	_.delay(function () {
		App.onChangeDOM($('body'));
	}, 100)
});

App.calcBodyScroll = function () {
	return $('body').css('overflow', 'hidden').width() - $('body').css('overflow', '').width();
}

App.bodyPaddingScroll = function (enable) {
	$('body, .js-footer').css('padding-right', (enable ? App.calcBodyScroll() : ''));
}


App.saveMe = function (handler, errorHandler) {
	var e, error;
	if (errorHandler == null) {
		errorHandler = false;
	}
	try {
		return handler();
	} catch (error) {
		e = error;
		console.error(e);
		if (typeof errorHandler === 'function') {
			return App.saveMe(errorHandler);
		}
	}
};

App.parseValueString = function (val) {
	var _value;
	if (typeof val === 'string') {
		_value = null;
		App.saveMe(function () {
			_value = eval('[' + val + ']')[0];
		}, function () {
			_value = void 0;
		});
		return _value;
	} else {
		return val;
	}
};


App.getAttrs = function (el, attrFamily) {
	var _attrs, _name, _prefix;
	if (el.get != null) {
		el = el.get(0);
	}
	_prefix = 'data-';
	if (attrFamily.indexOf(_prefix) !== 0) {
		attrFamily = _prefix + attrFamily;
	}
	_attrs = (function () {
		var _addHandle, _getHandle, _list, _lockHandle, _self, _selfName;
		_list = {};
		_selfName = '_self';
		_getHandle = function (attr) {
			if (attr != null) {
				if (_list[attr]) {
					return _list[attr];
				}
				return null;
			} else {
				if (_list[_selfName]) {
					return _list[_selfName];
				}
				return null;
			}
		};
		_addHandle = function (attr, val) {
			if (val != null) {
				_list[attr] = val;
			} else {
				_list[_selfName] = attr;
			}
			return _self;
		};
		_lockHandle = function () {
			_self.add = null;
			_self.lock = null;
			return _self;
		};
		_self = _getHandle;
		_self.add = _addHandle;
		_self.lock = _lockHandle;
		_self.getAll = function () {
			return _list;
		};
		return _self;
	})();
	_name = '';
	$.each(el.attributes, function () {
		var _value;
		if (!this.specified) {
			return;
		}
		if (this.name.indexOf(attrFamily) !== 0) {
			return;
		}
		_name = this.name;
		_name = _name.substr((attrFamily + '-').length, _name.length);
		_value = null;
		if (this.value.indexOf('@') > -1) {
			_value = App.uiSettings.get(this.value.substr(this.value.indexOf('@') + 1));
		} else {
			_value = this.value;
		}
		if (_name === "") {
			_attrs.add(_value);
		} else {
			_attrs.add(_name, _value);
		}
	});
	_attrs.lock();
	return _attrs;
};

App.loadImage = function (url, callback) {
	if (typeof callback != 'function') callback = function () {
	}
	var img = new Image();
	img.onload = function () {
		callback.call(this, url);
	}
	img.src = url;
}

App.multiApply = function (funcs, _this, args) {
	if (!_.isArray(args)) {
		args = [args]
	}
	for (var i = 0, _len = funcs.length; i < _len; i++) {
		this._calledIndex = i;
		funcs[i].apply(_this, args);
	}
	this._calledIndex = undefined;
}
App.multiApply.getCalledIndex = function () {
	return this._calledIndex;
}


App.scrollTo = function (arg, offsetTop, params) {
	if (offsetTop == null) offsetTop = 0;
	if (typeof arg == 'string') {
		arg = $(arg)
	}
	if (arg instanceof jQuery) {
		arg = arg.offset().top
	}
	if (typeof arg != 'number') {
		return true
	}
	if (params == null) {
		params = {};
	}
	$("html,body").stop().addClass('__scrolling-to').animate({
		scrollTop: arg - offsetTop
	}, params['duration'] || 1000, function () {
		return $(this).removeClass('__scrolling-to')
	});
}

App.onClick = function () {
	var args = ['click']
	for (var i = 0, _len = arguments.length; i < _len; i++) {
		args.push(arguments[i]);
	}

	$.fn.on.apply($('html'), args);
}

App.scriptLoader = function (src) {
	var _loader, _onLoaded, _self, inProcess, isLoaded, loadListeners;
	inProcess = false;
	isLoaded = false;
	loadListeners = [];
	_loader = function () {
		var firstScriptTag, tag;
		if (inProcess) {
			return true;
		}
		inProcess = true;
		tag = document.createElement('script');
		tag.src = src;
		firstScriptTag = document.getElementsByTagName('script')[0];
		firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
		return true;
	};
	_onLoaded = function () {
		var callback, i, len;
		inProcess = false;
		isLoaded = true;
		for (i = 0, len = loadListeners.length; i < len; i++) {
			callback = loadListeners[i];
			_.defer(callback);
		}
		return true;
	};
	_self = function (cb) {
		if (!_.isFunction(cb)) {
			return true;
		}
		if (isLoaded) {
			_.defer(cb);
			return true;
		}
		loadListeners.push(cb);
		_.defer(_loader);
		return true;
	};
	_self.onLoaded = _onLoaded;
	return _self;
};

App.loadGoogleMap = (function () {
	var _loader;
	_loader = App.scriptLoader("https://maps.googleapis.com/maps/api/js?callback=onLoadedGoogleMap");
	window.onLoadedGoogleMap = _loader.onLoaded;
	return _loader;
})();

App.loadYandexMap = (function () {
	var _loader;
	_loader = App.scriptLoader("https://api-maps.yandex.ru/2.1/?lang=ru_RU&onload=onLoadedYandexMap");
	window.onLoadedYandexMap = _loader.onLoaded;
	return _loader;
})();


App.isTouchDevice = function () {
	return (('ontouchstart' in window) || (navigator.MaxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0));
}

App.isIOS = function () {
	return (!!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform));
}

$('html').addClass(App.isTouchDevice() ? 'touchdevice' : 'not-touchdevice');
$('html').addClass(App.isIOS() ? 'iOS' : 'not-iOS');

App.loopAsync = function (handler, args) {
	var self = {
		next: function () {
			handler.apply(self, args);
		}
	}
	self.next();
}

App.run(function () {
	App.ClassProto = function ClassProto(options) {
		if (options == null) {
			console.error('Please, use options');
			return;
		}
		if (options['namespace'] == null) {
			console.error('Please, set namespace');
			return;
		}
		this.namespace = options.namespace;
	}

	App.ClassProto.prototype = {
		getEventName: function (eventName) {
			return this.namespace + ( eventName ? '-' + eventName : '' );
		},
		getEventNamespace: function (eventName) {
			return (eventName ? eventName : '') + '.' + this.namespace;
		}
	}
});

App.timestamp = (function () {
	var getTick;

	return function () {
		if (getTick == null) {
			if (window['performance'] && window['performance']['now']) {
				getTick = function () {
					return performance.now();
				}
			} else {
				getTick = function () {
					return Date.now();
				}
			}
		}

		var _start = getTick();

		return function () {
			return Math.round((getTick() - _start) * 100) / 100;
		}

	}
})();


App.isFrontDev;
App.run(function () {
	var _hosts = {
		"html.test.lan": true,
		"localhost": true,
		"frontdev.realweb.ru": true,
		"frontdev.dev.lav": true
	}
	var result = _hosts[window.location.hostname];
	if (result) { console.log('isFrontDev'); }
	App.isFrontDev = function(){ return result; }
});

App.counter = (function () {
	var count = 0;
	return function () {
		return ++count;
	}
})();


App.openWindow = function (str) {
	var win = window.open("", "Title", "toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=yes, resizable=yes, width=1000, height=800, top=0, left=0");
	win.document.body.innerHTML = str;
}

App.delay = function (time, args, cb) {
	var _handler, _self, idTimeout;
	switch (arguments.length) {
		case 1:
			cb = time;
			time = 1;
			args = [];
			break;
		case 2:
			cb = args;
			args = [];
	}
	if (typeof cb !== 'function') {
		return;
	}
	if (!_.isArray(args)) {
		args = [args];
	}
	_handler = function () {
		cb.apply({}, args);
		return true;
	};
	idTimeout = setTimeout(_handler, time);
	_self = {
		id: idTimeout,
		clear: function () {
			return clearTimeout(idTimeout);
		}
	};
	return _self;
};

App.getUniqKey = (function(){
	var keys = {};

	var chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
	var getKey = function(){
		var key = '';
		while(key.length < 10) {
			key += chars[ Math.round(Math.random()*(chars.length - 1)) ];
		}
		return key;
	}

	return function(){
		var key;
		do {
			key = 'uniqkey' + getKey();
		} while( keys[key] );
		keys[key] = true;
		return key;
	}
})();


App.onLiveClick = (function(){
	var listeners = [];

	var self = function(){
		var selector, callback, once;
		switch(arguments.length){
			case 2:
				selector = arguments[0];
				callback = arguments[1];
			break;
			case 3:
				selector = arguments[0];
				once = arguments[1];
				callback = arguments[2];
			break;
			default:
				return;
			break;
		}
		var listener = {};
		listener.key = 'liveclick' + App.getUniqKey();
		listener.selector = selector;
		listener.callback = callback;
		listener.once = !!once;
		listeners.push(listener);
		self.refresh();
		return listener;
	}

	self.refresh = function() {
		_.each(listeners, function(listener){
			$( listener.selector ).each(function(){
				var $this = $(this);
				if( $this.data(listener.key) ) return;
				$this.data(listener.key, true);
				$this[ listener.once ? 'one' : 'on' ]("click." + listener.key, listener.callback);
			});
		});
	}

	return self;
})();

App.onReady(App.onLiveClick.refresh);
App.onLoad(App.onLiveClick.refresh);
App.onChangeDOM(App.onLiveClick.refresh);



/**
 * Выравнивание высот блоков
 * @name App.uniformHeight
 * @param  {jQueryElement} $parent Общий блок
 * @param  {String=} [childrenSelector=undefined] Селектор дочерних блоков
 * @param  {String=} [customElements=undefined] Селектор дочерних блоков childrenSelector
 * @return {jQueryElement}
 */
App.uniformHeight = function($parent, childrenSelector, customElements){
	if( $parent.length > 1 ){ return $parent.each(function(){ uniformHeight($parent, childrenSelector); }) }
	if( $parent.length < 1 ){ return $parent; }

	if( _.isString(customElements) ) customElements = [customElements];
	if( !_.isArray(customElements) ) customElements = [undefined];

	var rows = [];
	var _prevTop = -999;

	$parent[ childrenSelector ? 'find' : 'children' ]( childrenSelector || undefined ).each(function(){
		var $item = $(this);
		if( Math.abs($item.offset().top - _prevTop) > 1 ){
			rows.push([]);
			_prevTop = $item.offset().top;
		}
		rows[rows.length - 1].push($item);
	});

	var _eachCustomElements = function($item, handler){
		_.each(customElements, function(item, index, arr){
			if( item == null ){ item = $item; } else { item = $item.find(item); }
			handler(item, index, arr);
		});
	}

	_.each(rows, function(row){
		var heights = new Array( customElements.length )
		_.each(row, function($item){
			_eachCustomElements($item, function( $el, index ){
				$el.css('height', '');
				heights[index] = Math.max(heights[index] || 0, $el.outerHeight());
			});
		});
		_.each(row, function($item){
			_eachCustomElements($item, function( $el, index ){
				if( $el.outerHeight()  != heights[index]  ){ $el.css('height',  heights[index] ); } else { $el.css('height', ''); };
			});
		});
	});
}


App.SimpleEvents = App.run(function(){
	function SimpleEvents(){}
	SimpleEvents.prototype = {
		on: function(event, callback){
			if(this['__listeners'] == null) this.__listeners = {};
			if(this.__listeners[event] == null) this.__listeners[event] = [];
			this.__listeners[event].push(callback);
			return this;
		},
		trigger: function(event, args){
			if(this['__listeners'] == null) return;
			if(this.__listeners[event] == null) return;
			var _this = this;
			if(!_.isArray(args)) args = [args];
			_.each(this.__listeners[event], function(handler){ handler.apply(_this, args); });
			return this;
		}
	}
	return SimpleEvents;
});

App.extendPrototype = function (Child, Parent) {
	for(var key in Parent.prototype){
		Child.prototype[key] = Parent.prototype[key];
	}
}

if(navigator.userAgent.toLowerCase().indexOf('firefox') > -1){ $('html').attr('data-browser', 'firefox'); };
})();