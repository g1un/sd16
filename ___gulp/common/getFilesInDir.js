'use strict';
var fs = require('fs');
var path = require('path');

module.exports = function ($, _) {
	return function (dir, ext) {
		if (ext == null) { ext = false; }
		var files = fs.readdirSync(dir)
		files.filter(function (  file){
			if (fs.lstatSync( path.join(dir, file) ).isDirectory()) { return false }
			if (!ext) { return true }
			return ( path.extname(file).toLowerCase() == ext )
		})
		return files
	}
}