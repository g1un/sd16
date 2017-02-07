'use strict';
var path = require('path');
var fs = require('fs');

module.exports = function ($, _) {
	return function (_path) {
		return fs.readdirSync(_path).filter(function (file) {
			if( file == '.' || file == '..' ) return false;
			return fs.statSync(path.join(_path,file)).isDirectory();
		});
	}
}