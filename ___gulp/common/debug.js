'use strict';
module.exports = function($, _){
	return function(obj) {
		console.log('\n' + JSON.stringify(obj, null, 4));
	}
}