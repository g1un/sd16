'use strict';
var path = require('path');
module.exports = function($, _){
	return function(){
		var list = [];

		var use = function(gulpTask){
			if(arguments.length > 1){
				gulpTask = Array.prototype.slice.call(arguments);
			}
			if(typeof gulpTask != 'function' && !Array.isArray(gulpTask)){
				gulpTask = [gulpTask]
			}
			var arr = [];
			var what = [];
			arr.push(what);
			arr.push(gulpTask);
			list.push(arr);
			return {
				for: function(val){
					val = path.relative(_.paths.__gulp, val);
					what.push(val);
					return this;
				},
				notFor: function(val){
					val = path.relative(_.paths.__gulp, val);
					what.push('!' + val);
					return this;
				},
				use: use
			}
		}

		return {
			get: function(){
				return list;
			},
			use: use
		}
	}
}