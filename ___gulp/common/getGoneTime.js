'use strict';
module.exports = function(){
	return function(start) {
		var gone = Date.now() - start;
		if(gone < 1000){
			return gone + ' ms'
		}
		if(gone < 60000){
			return (Math.round(gone/10))/100 + ' s'
		}
		var tmp = Math.round(gone/60000)

		return tmp + ' m ' + (Math.round(gone/1000) - tmp*60) + ' s'
	}
}