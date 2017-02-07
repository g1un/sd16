App.gui.add({
	_name: 'maparea',
	selector: '[data-usemaparea]:not(.__maparea-inited)',
	build: function($el){
		$el.addClass('__maparea-inited');
		var _maparea = maparea($el, {
			image: $el.attr('data-usemaparea')
		});

		$el.on('map-highlight', function(e){
			_maparea.preventDisable()
			setTimeout(function(){
				var $highlight = $(e.target).find('.highlight');
				if( $highlight.length < 1 ){ return; }
				_maparea.centeringArea($highlight);
				_maparea.enable();
				_maparea.cancelPreventDisable();
			}, 50)
		});
		$el.on('mapareacall', function(e, methodName, args){
			if( _maparea[methodName] ){
				if( !_.isArray(args) ) args = [args];
				_maparea[methodName].apply(_maparea, args)
			}
		})
	},
	destroy: function(){}
})


var maparea = function($el, options){
	return new Maparea($el, options);
}

var Maparea = function($el, options){
	if($el.length < 1) return;
	$el.addClass('maparea');
	this.$element = $el;
	this.$image = $el.find(options.image);

	this.$image.addClass('maparea-move');

	this.$close = $('<a href="#" class="maparea-close"></a>').appendTo( $el );
	this.$overlay = $('<a href="#" class="maparea-overlay"></a>').appendTo( $el );


	this.init();
	return this;
}

Maparea.prototype = {
	init: function(){
		this.enableEvents();
	},
	centeringArea: function($areas){
		var blockOffset = this.$element.offset()

		var minX = null;
		var maxX = null;
		var minY = null;
		var maxY = null;

		var _self = this;

		var stocksOffset = $areas.each(function() {
			var offset = _self._areaOffset($(this));
			var size = _self._areaSize($(this));
			if (minX == null || offset.left < minX) {
				minX = offset.left;
			}
			if (minY == null || offset.top < minY) {
				minY = offset.top;
			}
			if (maxX == null || (offset.left + size.width) > maxX) {
				maxX = (offset.left + size.width);
			}
			if (maxY == null || (offset.top + size.height) > maxY) {
				maxY = (offset.top + size.height);
			}
		})

		stocksOffset = {
			top: minY - blockOffset.top,
			left: minX - blockOffset.left
		}

		var stocksSize = {
			width: maxX - minX,
			height: maxY - minY
		}

		var currentOffset = _self._getCurrentOffset();

		var left = stocksOffset.left - (currentOffset.x + ((this.$element.width() - stocksSize.width) / 2));
		var top = stocksOffset.top - (currentOffset.y + ((this.$element.height() - stocksSize.height) / 2));


		_self._setPosition((-left), (-top));
		return this;
	},
	_areaOffset: function($area){
		var $image = $('[usemap="#' + ( $area.closest('map').attr('id') ) + '"]');
		var imageOffset = $image.offset();
		var vals = { minX: 999999999, maxX: 0, minY: 999999999, maxY: 0 }
		_.each($area.attr('coords').split(','), function(item, index){
			var selector = (index%2 == 0 ? 'X' : 'Y');
			item = parseInt(item)
			if( item < vals['min' + selector] ){ vals['min' + selector] = item; }
			if( item > vals['max' + selector] ){ vals['max' + selector] = item; }
		});
		return { left: imageOffset.left + vals.minX, top: imageOffset.top + vals.minY }
	},
	_areaSize: function($area){
		var vals = { minX: 999999999, maxX: 0, minY: 999999999, maxY: 0 }
		_.each($area.attr('coords').split(','), function(item, index){
			var selector = (index%2 == 0 ? 'X' : 'Y');
			item = parseInt(item)
			if( item < vals['min' + selector] ){ vals['min' + selector] = item; }
			if( item > vals['max' + selector] ){ vals['max' + selector] = item; }
		});
		return { width: (vals.maxX - vals.minX), height: (vals.maxY - vals.minY) }
	},
	enable: function(params) {
		if (this.isEnabled) return this;
		if(params == null) params = {};
		this.isEnable = true;
		this.$element.addClass('__enable');
		if(params['disableScrollTop'] !== true){
			$('html,body').scrollTop(this.$element.offset().top - $('.js-header').outerHeight());
		}
		this.enableTouchEvents();
		this.closeEvent();
		return this;
	},
	closeEvent: function(){
		if(!this.isEnable) return this;
		if(this.isCloseEventEnable) return this;
		var _this = this;
		this.isCloseEventEnable = true;
		$('body').one('click', function(e){
			_this.isCloseEventEnable = false;
			if ($(e.target).closest(_this.$element).length || _this.isPreventDisable) {
				_this.closeEvent();
				return
			}
			_this.disable();
		});
		return this;
	},
	enableEvents: function(){
		if(this.isEnabledEvents) return;
		this.isEnabledEvents = true;
		var _this = this;
		this.$overlay.on('click.maparea', function(e){
			e.preventDefault();
			_this.enable();
		});
		this.$close.on('click.maparea', function(e){
			e.preventDefault();
			_this.disable();
		});
		return this;
	},
	preventDisable: function(){
		this.isPreventDisable = true;
		return this;
	},
	cancelPreventDisable: function(){
		this.isPreventDisable = false;
		return this;
	},
	disable: function(){
		if(!this.isEnable) return this;
		this.isEnable = false;
		this.$element.removeClass('__enable');
		this.disableTouchEvents();
		this.$element.find('area.highlight,area.blackout').removeClass('highlight blackout');
		this.$element.find('map').trigger('refreshMap');
		return this;
	},
	disableEvents: function(){
		if(!this.isEnabledEvents) return;
		this.isEnabledEvents = false;
		this.$overlay.off('click.maparea');
		this.$close.off('click.maparea');
		return this;
	},
	_touchStart: function(e){
		// e.preventDefault();
		if(this.isStarted) return this;
		this.startTouches = [];
		this.isStarted = true;
		this.startEvent = e;
		this.startPosition = this._getEventPosition(e);
		this.startOffset = this._getCurrentOffset();
		return this;
	},
	_touchMove: function(e){
		if(!this.isStarted) return this;
		e.preventDefault();
		this.moveEvent = e;
		this.movePosition = this._getEventPosition(e);
		this.refreshPosition();

		this._checkTouchZoom(e);

		return this;
	},
	_touchEnd: function(e){
		// e.preventDefault();
		this.isStarted = false;
		return this;
	},
	_selfCall: function(handler){
		var _this = this;
		return function(event){
			var args = [event, $(this)];
			for(var i = 1, _len = arguments.length; i < _len; i++){ args.push(arguments[i]); }
			handler.apply(_this, args);
			return this;
		}
	},
	enableTouchEvents: function(){
		var startEv = ['pointerDown', 'MSPointerDown', 'touchstart', 'mousedown'];
		var moveEv = ['pointerMove', 'MSPointerMove', 'touchmove', 'mousemove'];
		var endEv = ['pointerUp', 'MSPointerUp', 'touchend', 'mouseup'];

		startEv = startEv.join('.maparea ') + '.maparea'
		moveEv = moveEv.join('.maparea ') + '.maparea'
		endEv = endEv.join('.maparea ') + '.maparea'

		this.$image.get(0).style.msTouchAction = "none";

		this.$image.on( startEv, this._selfCall(this._touchStart));
		this.$image.on( moveEv , this._selfCall(this._touchMove));
		$('body').on( endEv , this._selfCall(this._touchEnd));
		return this;
	},
	disableTouchEvents: function(){
		var startEv = ['pointerDown', 'MSPointerDown', 'touchstart', 'mousedown'];
		var moveEv = ['pointerMove', 'MSPointerMove', 'touchmove', 'mousemove'];
		var endEv = ['pointerUp', 'MSPointerUp', 'touchend', 'mouseup'];

		startEv = startEv.join('.maparea ') + '.maparea'
		moveEv = moveEv.join('.maparea ') + '.maparea'
		endEv = endEv.join('.maparea ') + '.maparea'

		this.$image.off(startEv);
		this.$image.off(moveEv);
		$('body').off(endEv);
		return this;
	},
	_getEventPosition: function(event){
		var _e = (event.originalEvent['touches'] ? event.originalEvent.touches[0] : event.originalEvent );
		return {
			x: _e.pageX,
			y: _e.pageY
		}
	},
	refreshPosition: function(){
		var xOffset = (this.movePosition.x - this.startPosition.x) + this.startOffset.x;
		var yOffset = (this.movePosition.y - this.startPosition.y) + this.startOffset.y;
		this._setPosition(xOffset, yOffset);
		return this;
	},
	_setPosition: function(xOffset, yOffset){
		var imageSize = {width: this.$image.width(), height: this.$image.height()}
		var blockSize = {width: this.$element.width(), height: this.$element.height()}

		var currentZoom = this.getZoom();

		imageSize.width = imageSize.width*currentZoom;
		imageSize.height = imageSize.height*currentZoom;

		var maxX = (imageSize.width - blockSize.width)/2;
		var minX = -maxX;

		var maxY = (imageSize.height - blockSize.height)/2;
		var minY = -maxY;


		if(xOffset > maxX){ xOffset = maxX; }
		if(xOffset < minX){ xOffset = minX; }

		if(yOffset > maxY){ yOffset = maxY; }
		if(yOffset < minY){ yOffset = minY;}

		if( imageSize.width <= blockSize.width )
			xOffset = 0

		if( imageSize.height <= blockSize.height )
			yOffset = 0

		this._updateTransform(this.$image, {x: xOffset, y: yOffset});
		return this;
	},
	_getTransform: function($element){
		var currentMatrix = /matrix\((.*)\)/.exec($element.css('transform'));
		if(currentMatrix == null || currentMatrix.length != 2){
			currentMatrix = [1, 0, 0, 1, 0, 0]
		} else {
			currentMatrix = currentMatrix[1]

			currentMatrix = currentMatrix.replace(/[ ]/g, '').split(',');
			if(currentMatrix.length != 6) return false;
		}
		var values = {
			scaleX: 0,
			scaleY: 3,
			skewY: 1,
			skewX: 2,
			x: 4,
			y: 5
		}
		_.each(values, function(index, keyName){
			values[keyName] = parseFloat(currentMatrix[index]);
		});

		return values;
	},
	_updateTransform: function($element, params){
		var currentMatrix = this._getTransform($element);

		var keys = {
			scaleX: 0,
			scaleY: 3,
			skewY: 1,
			skewX: 2,
			x: 4,
			y: 5
		}

		currentMatrix = $.extend({}, currentMatrix, params);

		var result = [0, 0, 0, 0, 0, 0];

		_.each(currentMatrix, function(val, key){
			if( keys[key] == null ) return;
			result[ keys[key] ] = val;
		})

		result = 'matrix(' + result.join(', ') + ')';
		$element.css('transform', result);
	},
	_getCurrentOffset: function(){
		var lastMatrix = this.$image.css('transform');
		var lastOffsetX = 0;
		var lastOffsetY = 0;
		if(lastMatrix != null && lastMatrix != 'none' && lastMatrix.indexOf('matrix') > -1 ){
			lastMatrix = lastMatrix.replace(/.+\(/, '').replace(/\).*/, '').split(',').map(function(item){
				return parseInt(_.trim(item));
			});
			lastOffsetX = lastMatrix[4];
			lastOffsetY = lastMatrix[5];
		}
		return {
			x: lastOffsetX,
			y: lastOffsetY
		}
	},
	_calcDistance: function(coords){
		var _x = Math.pow(coords[0][0] - coords[1][0], 2);
		var _y = Math.pow(coords[1][1] - coords[1][1], 2);

		return Math.round(Math.sqrt( _x + _y )*100)/100;
	},
	_checkTouchZoom: function(e){
		var touches = e.originalEvent['touches'];
		if(touches == null || touches.length !== 2) return this;
		var touches = [ [touches[0].pageX, touches[0].pageY], [touches[1].pageX, touches[1].pageY] ];
		var distance = this._calcDistance(touches);
		// debug(touches);
		// debug(distance);
		if(this.startTouches.length == 0){
			this.startTouches = touches;
			this.startTouchesDistance = distance;
			return this;
		}

		var currentZoom = this.getZoom();

		var zoomRatio = 0.0005;
		zoomRatio = zoomRatio * (96/App.getDpi());

		currentZoom += Math.round(distance - this.startTouchesDistance)*zoomRatio;

		this.setZoom(currentZoom);
	},
	getZoom: function(){
		return this._getTransform(this.$image).scaleY;
	},
	setZoom: function(val){
		var maxZoom = 3;
		var minZoom = 0.5;
		if(val < minZoom) val = minZoom;
		if(val > maxZoom) val = maxZoom;

		this._updateTransform(this.$image, {scaleX: val, scaleY: val});
	}
}

App.extendPrototype(Maparea, App.SimpleEvents);