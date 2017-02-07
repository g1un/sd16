'use strict';
module.exports = function($, _){
	return function(val) {
		if (val < 10) { return "  " + val; }
		if (val < 100) { return " " + val; }
		return val;
	}
}