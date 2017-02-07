'use strict';
var fs = require('fs');

module.exports = function(gulp, $, _){
	return function(cb){

		var _handler = function(index, e){
			if(index > 10){
				throw new Error(e);
			}
			setTimeout(function(){
				try {
					_deleteHandler();
					cb();
				} catch (e){
					console.error(e);
					console.log('try: ' + (index));
					_handler( index + 1, e);
				}
			}, 1000);
		}

		var _deleteHandler = function(){
			if(fs.existsSync(_.paths.web)) $.deleteFolderRecursive(_.paths.web);
			if(fs.existsSync(_.paths.temp)) $.deleteFolderRecursive(_.paths.temp);	
		}
		_handler(0);
	};
}