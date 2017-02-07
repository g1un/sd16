(function(){
"use strict";
var Areas = function($area){
	if( $area.length !== 1 ){ console.error('Area length !== 1', $area); return false; }
	if( !(this instanceof Areas) ) return new Areas($area);
	this.__cache = {};
	this.$area = $area;
	return this;
}
App.areas = Areas;

Areas.prototype = {
	clearCache: function(){ this.__cache = {}; return this; },

	fromCache: function(variableName, handler){
		if( !this.__cache[variableName] ){ this.__cache[variableName] = handler.apply(this); }
		return this.__cache[variableName];
	},
	getAreaParents: function($area){
		return this.fromCache('areaParents', function(){
			var $image = $( '[usemap="#' + $area.closest('map').attr('id') + '"]' );
			var $parent = $image.offsetParent();
			return {
				$image: $image,
				$parent: $parent
			}
		});
	},
	getRelativePosition: function(){
		return this.fromCache('relativePosition', function(){
			var position = {};

			var parents = this.getAreaParents(this.$area);

			position = parents.$image.offset();
			var parentPosition = parents.$parent.offset()

			return {
				top: position.top - parentPosition.top,
				left: position.left - parentPosition.left,
			}
		});
	},
	getCoords: function(){
		return this.fromCache('coords', function(){
			var coords = this.$area.attr('coords').replace(/([^0-9^,])/g, '').split(',');
			var parsedCoords = new Array(Math.round(coords.length/2));

			_.each(coords, function(item, index){
				item = parseInt(item);
				if( index % 2 == 0 ){
					parsedCoords[index/2] = {x: item}
				} else {
					parsedCoords[Math.floor(index/2)].y = item;
				}
			});
			return parsedCoords;
		});
	},
	getCenter: function(fromParent){
		return this.fromCache('center' + (fromParent ? '-parent' : ''), function(){
			var points = this.getEndpoints();
			return {
				x: (points.maxX - points.minX)/2 + points.minX + ( fromParent ? this.getRelativePosition().left : 0 ),
				y: (points.maxY - points.minY)/2 + points.minY + ( fromParent ? this.getRelativePosition().top : 0 ),
			}
		})
	},
	getSize: function(){
		return this.fromCache('size', function(){
			var points = this.getEndpoints();
			return {
				width: points.minX + points.maxX,
				height: points.minX + points.maxX,
			}
		});
	},
	getEndpoints: function(fromParent){
		return this.fromCache('endpoints', function(){
			var point = {
				minX:  999999,
				minY:  999999,
				maxX: -999999,
				maxY: -999999,
			}
			var _this = this;
			_.each(this.getCoords(), function(coord){
				if( coord.x > point.maxX ){ point.maxX = coord.x + ( fromParent ? _this.getRelativePosition().left : 0 ); }
				if( coord.x < point.minX ){ point.minX = coord.x + ( fromParent ? _this.getRelativePosition().left : 0 ); }
				if( coord.y > point.maxY ){ point.maxY = coord.y + ( fromParent ? _this.getRelativePosition().top : 0 ); }
				if( coord.y < point.minY ){ point.minY = coord.y + ( fromParent ? _this.getRelativePosition().top : 0 ); }
			});
			return point;
		});
	},
	getRightCorners: function(fromParent){
		return this.fromCache('rightCorners', function(){
			var topPoint = { x: -999999, y: -999999 };
			var bottomPoint = { x: -999999, y: -999999 };

			var tmpPoint;

			var _this = this;
			_.each(this.getCoords(), function(point){
				var x = point.x + ( fromParent ? _this.getRelativePosition().left : 0 );
				var y = point.y + ( fromParent ? _this.getRelativePosition().top : 0 );

				if (!(x > topPoint.x || x > bottomPoint.x)) return;

				if (topPoint.x > bottomPoint.x) {
					tmpPoint = topPoint;
				} else {
					tmpPoint = bottomPoint;
				}

				if (y < tmpPoint.y) {
					topPoint = { x: x, y: y };
					bottomPoint = tmpPoint;
				} else {
					bottomPoint = { x: x, y: y };
					topPoint = tmpPoint;
				}
			});
			return {
				top: topPoint,
				bottom: bottomPoint
			}
		})
	},
	getLeftCorners: function(fromParent){
		return this.fromCache('leftCorners', function(){
			var topPoint = { x: 999999, y: 999999 };
			var bottomPoint = { x: 999999, y: 999999 };

			var tmpPoint;

			var _this = this;
			_.each(this.getCoords(), function(point){
				var x = point.x + ( fromParent ? _this.getRelativePosition().left : 0 );
				var y = point.y + ( fromParent ? _this.getRelativePosition().top : 0 );

				if (!(x < topPoint.x || x < bottomPoint.x)) return;

				if (topPoint.x < bottomPoint.x) {
					tmpPoint = topPoint;
				} else {
					tmpPoint = bottomPoint;
				}

				if (y < tmpPoint.y) {
					topPoint = { x: x, y: y };
					bottomPoint = tmpPoint;
				} else {
					bottomPoint = { x: x, y: y };
					topPoint = tmpPoint;
				}
			});
			return {
				top: topPoint,
				bottom: bottomPoint
			}
		});
	}
}
})();