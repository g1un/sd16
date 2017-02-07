(function(){
"use strict";
(function($) {
	var defaults, equals;
	defaults = {
		CLICK: function($area) {},
		ENTER: function($area) {},
		LEAVE: function($area) {},
		classStyle: {
			'state-selected': {
				fill: 'rgba(0, 0, 255, 0.5)',
				stroke: {
					style: 'rgba(0, 0, 255, 0.8)',
					width: 1
				}
			},
			'state-hover': {
				fill: 'rgba(255, 0, 0, 0.5)',
				stroke: {
					style: 'rgba(255, 0, 0, 0.8)',
					width: 1
				}
			}
		}
	};
	equals = function(array, array2) {
		var i, j, ref;
		if (!array || !array2) {
			return false;
		}
		if (array2.length !== array.length) {
			return false;
		}
		for (i = j = 0, ref = array2.length - 1; 0 <= ref ? j <= ref : j >= ref; i = 0 <= ref ? ++j : --j) {
			if (array2[i] instanceof Array && array[i] instanceof Array) {
				if (!equals(array[i], array2[i])) {
					return false;
				}
			} else if (array2[i] !== array[i]) {
				return false;
			}
		}
		return true;
	};
	$.fn.maplight = function(options) {
		var $areas, $bgImage, $canvas, $img, _$this, _calcArea, _calcCoord, _checkAreaStyle, _clear, _generate, _generateID, _getCTX, _getParams, _init, _refreshCanvas, _renderArea, _renderAreas, _resizeHandler, _showHover, ctx, hoveredAreas, selectedAreas, settings;
		if (this.length < 1) {
			return this;
		}
		if (this.length > 1) {
			this.each(function() {
				return $(this).maplight(options);
			});
			return this;
		}
		if (this.data('IsMapLighted') === true) {
			_$this.data('self-maplight');
			return;
		}
		this.data({
			'IsMapLighted': true
		});
		_$this = this;
		settings = null;
		$canvas = null;
		$bgImage = null;
		$img = null;
		$areas = null;
		selectedAreas = [];
		hoveredAreas = [];
		ctx = null;
		_generateID = function() {
			var _id;
			_id = _.random(1000000, 9999999);
			while ($('map[data-mapid="' + _id + '"]').length > 0) {
				_id = _.random(1000000, 9999999);
			}
			return _id;
		};
		_init = function() {
			settings = $.extend({}, defaults, options);
			return _generate();
		};
		_clear = function() {
			var thisID;
			if ($canvas != null) {
				$canvas.remove();
				$canvas = null;
			}
			if ($bgImage != null) {
				$bgImage.remove();
				$bgImage = null;
			}
			if (!thisID) {
				if (!_$this.hasAttr('data-mapid')) {
					return _$this;
				}
				thisID = _$this.attr('data-mapid');
			}
			$('canvas[data-mapid="' + thisID + '"]').remove();
			$('.maplight-background[data-mapid="' + thisID + '"]').remove();
			$img.css({
				'opacity': ''
			});
			return _$this;
		};
		_showHover = function(_$area) {
			return !(_$area.hasClass('no-hover') || (settings.selectedNoHover && _$area.hasClass('state-selected')));
		};
		_getCTX = function() {
			if (typeof G_vmlCanvasManager !== "undefined" && G_vmlCanvasManager !== null) {
				return G_vmlCanvasManager.initElement($canvas.get(0)).getContext('2d');
			} else {
				return $canvas.get(0).getContext('2d');
			}
		};
		_generate = function() {
			var thisID;
			_clear();
			thisID = _generateID();
			_$this.attr({
				'data-mapid': thisID
			});
			$canvas = $('<canvas class="maplight-canvas"></canvas>');
			$canvas.attr({
				'data-mapid': thisID,
				'id': 'canvas-' + thisID
			});
			$img = $('[usemap="#' + _$this.attr('id') + '"]');
			$img.attr({
				'data-mapid': thisID,
				'id': 'image-' + thisID
			});
			$bgImage = $('<img class="maplight-background" src="' + $img.attr('src') + '" alt="">');
			$bgImage.attr({
				'data-mapid': thisID,
				'id': 'bgimage-' + thisID
			});
			$img.css({
				'opacity': 0
			});

			$([]).add($bgImage).add($canvas).css({
				'position': 'absolute',
				'top': 0,
				'left': 0,
				'display': 'none'
			})

			$img.before($bgImage);
			$img.before($canvas);
			$areas = _$this.find('area');
			ctx = _getCTX();
			_calcArea(true);

			var enterTime = 0;
			var $lastEnter = null;
			var cancelled = false;
			$areas.not('.state-static').each(function() {
				var _$area;
				_$area = $(this);
				_$area.on('mouseenter', function(e) {
					if(cancelled){
						enterTime = 0;
						$lastEnter.trigger('vmouseleave');
					}
					$lastEnter = $(this);
					cancelled = false;
					enterTime = Date.now();
					_$area.addClass('state-hover');
					_refreshCanvas();
					settings.ENTER(e, _$area);
				});
				_$area.on('mouseleave vmouseleave', function(e) {
					// if( (Date.now() - enterTime) < 500 ){
					// 	cancelled = true;
					// 	return;
					// }
					_$area.removeClass('state-hover');
					_refreshCanvas();
					settings.LEAVE(e, _$area);
				});
				_$area.on('click', function(e) {
					settings.CLICK(e, _$area);
				});
			});
			$(window).on('resize', _resizeHandler);
			$img.one('load', _resizeHandler)
			_resizeHandler();
			return _$this;
		};
		_resizeHandler = function() {
			setTimeout(function() {
				_calcArea();
				_refreshCanvas();
			}, 0);
		};
		_getParams = function() {
			var imageOriginalSize = {
				width: parseInt($img.attr('data-width')),
				height: parseInt($img.attr('data-height')),
			}
			if( !imageOriginalSize.width || !imageOriginalSize.height ){
				var tmpImage = new Image();
				tmpImage.src = $img.attr('src');
				imageOriginalSize.width = tmpImage.width;
				imageOriginalSize.height = tmpImage.height;
			}
			return {
				origWidth: imageOriginalSize.width,
				origHeight: imageOriginalSize.height,
				width: $img.width(),
				height: $img.height(),
				top: $img.offset().top - $img.parent().offset().top,
				left: $img.offset().left - $img.parent().offset().left
			};
		};
		_calcCoord = function(array, param) {
			return [Math.round((array[0] / param.origWidth) * param.width), Math.round((array[1] / param.origHeight) * param.height)];
		};
		_refreshCanvas = function() {
			var canvas, params;
			params = _getParams();
			$([]).add($bgImage).add($canvas).css({
				'display': '',
				'width': params.width,
				'height': params.height,
				'position': 'absolute',
				'top': params.top,
				'left': params.left,
				'bottom': 'auto',
				'right': 'auto',
				'margin': 0
			});
			canvas = $canvas.get(0);
			canvas.width = params.width;
			canvas.height = params.height;
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			_renderAreas();
		};
		_renderArea = function(_coords, color, stroke) {
			var i, j, ref;
			if (stroke == null) {
				stroke = false;
			}
			ctx.fillStyle = color;
			if (stroke !== false) {
				ctx.strokeStyle = stroke.style;
				ctx.lineWidth = stroke.width;
			}
			ctx.beginPath();
			ctx.moveTo(_coords[0][0], _coords[0][1]);
			for (i = j = 1, ref = _coords.length - 1; 1 <= ref ? j <= ref : j >= ref; i = 1 <= ref ? ++j : --j) {
				ctx.lineTo(_coords[i][0], _coords[i][1]);
			}
			ctx.closePath();
			ctx.fill();
			if (stroke !== false) {
				return ctx.stroke();
			}
		};
		_calcArea = function(isInit) {
			if (isInit == null) {
				isInit = false;
			}
			return _$this.find('area').each(function() {
				var $area, coords, i, j, newCoords, oldCoords, param, ref;
				$area = $(this);
				if (isInit) {
					coords = $area.attr('coords');
					coords = coords.replace(/ /g, '');
					coords = coords.split(',');
					i = 0;
					while (i < coords.length - 1) {
						coords[i] = parseInt(coords[i]);
						coords[i + 1] = parseInt(coords[i + 1]);
						coords[i] = [coords[i], coords[i + 1]];
						coords.splice(i + 1, 1);
						i++;
					}
					$area.data({
						'default_coords': coords
					});
				}
				param = _getParams($img);
				oldCoords = $area.data('default_coords');
				newCoords = [];
				for (i = j = 0, ref = oldCoords.length - 1; 0 <= ref ? j <= ref : j >= ref; i = 0 <= ref ? ++j : --j) {
					newCoords[i] = _calcCoord(oldCoords[i], param);
				}
				$area.data({
					'currentCoords': newCoords
				});
				$area.attr({
					'coords': newCoords.join(',')
				});
			});
		};
		_checkAreaStyle = function(_$area, _className, _params) {
			var exClass, j, len, ref;
			if (_$area.hasClass(_className)) {
				if (_params.without != null) {
					ref = _params.without;
					for (j = 0, len = ref.length; j < len; j++) {
						exClass = ref[j];
						if (_$area.is(exClass)) {
							return false;
						}
					}
				}
				return true;
			}
			return false;
		};
		_renderAreas = function() {
			_$this.find('area').each(function() {
				var _$area, key, ref, value;
				_$area = $(this);
				ref = settings.classStyle;
				for (key in ref) {
					value = ref[key];
					if (_checkAreaStyle(_$area, key, value) === true) {
						_renderArea(_$area.data('currentCoords'), value.fill, value.stroke);
					}
				}
			});
		};
		_init();
		_$this.refreshMap = function() {
			return _refreshCanvas();
		};
		_$this.getMaplightObjects = function(){
			return {
				$canvas: $canvas,
				$bgImage: $bgImage,
				$image: $img,
				$areas: $areas
			}
		}
		_$this.data('self-maplight', _$this);
		return _$this;
	};
})(jQuery);
})();