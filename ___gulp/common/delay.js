'use strict';
module.exports = function(){
	return function(delay, handler){
		setTimeout(handler, delay)
	}
}