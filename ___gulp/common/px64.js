'use strict';
var deasync = require('deasync');
module.exports = function($, _) {
	return function(color){
		console.log(color);
		var result;
		$.createPixelPng(color, function(data){
			$.pngBase64(data, function(res){
				result = res;
			})
		})
		while(result === undefined) {
			require('deasync').runLoopOnce();
		}
		return result;
	}
}