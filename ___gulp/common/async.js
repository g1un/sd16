'use strict';
module.exports = function($, _){
	return function( handler){
		$.delay(1, handler);
	}
}