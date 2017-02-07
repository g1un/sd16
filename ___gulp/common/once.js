'use strict';
module.exports = function($, _){
	return function(arg1, arg2){
		var delay = 100;
		var handler = null;
		if(arguments.length == 1){
			handler = arg1;
		} else {
			delay = arg1;
			handler = arg2;
		}
		var _timeout = null;
		var index = 0;
		return function(){
			console.log('delay')
			if(_timeout != null){
				console.log('reset')
				clearTimeout(_timeout);
				index++;
				$.log("Called " + index + " times")
			}
			_timeout = setTimeout(function(){
				console.log('start')
				_timeout = null;
				index = 0;
				handler();
			}, delay)
		}
	}
}