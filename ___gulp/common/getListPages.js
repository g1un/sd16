'use strict';
var fs = require('fs');

module.exports = function($, _){
	return function(){
		var files = []
		var dirs = fs.readdirSync(_.paths.web);

		dirs.forEach(function(file){
			if( (file.indexOf('.html') + 1) && !( file.indexOf('index') + 1 ) ){
				files.push({ file: (file.replace('.html', '')), name: $.getDesc(file)})
			}
		});
		return files
	}
}