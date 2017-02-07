'use strict';
var fs = require('fs');
module.exports = function(gulp, $, _){
	return function () {
		var dirs = fs.readdirSync( _.popups.path );
		var tofile = _.popups.file;

		fs.writeFileSync(tofile, '')

		dirs.forEach(function(file){
			if( file.indexOf('.jade') + 1 ){
				fs.appendFileSync(tofile, 'include ' + _.popups.jadePath + file + '\n')
			}
		})
	}
}