'use strict';
var fs = require('fs');
module.exports = function(gulp, $, _){
	return function(){
		if(!fs.existsSync(_.paths.web)){
			fs.mkdirSync(_.paths.web)
		}

		if(!fs.existsSync(_.paths.template)){
			fs.mkdirSync(_.paths.template)
		}

		if(!fs.existsSync(_.paths.temp)){
			fs.mkdirSync(_.paths.temp)
		}
	}
}