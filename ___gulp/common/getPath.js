'use strict';
var path = require('path');

module.exports = function($, _){
	return function(){
		var args = Array.prototype.slice.call(arguments);
		if(args.length < 1) return args;

		if(args[0].indexOf(_.paths.__dirname) == -1){
			args.unshift(_.paths.__dirname);
		}
		return path.join.apply(path, args);
	}
}