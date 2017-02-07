'use strict';
var ncp = require('ncp').ncp
module.exports = function(gulp, $, _){
	return function(cb){
		$.copyDir(_['copy-index'].from, _['copy-index'].to, {
			clobber: true,
			filter: '.jade'
		}, cb);
	}
}