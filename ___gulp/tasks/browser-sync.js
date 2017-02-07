'use strict';
var browserSync	= require('browser-sync')
module.exports = function(gulp, $, _){
	var isRun = false;
	return function(){
		if(isRun){
			$.log.error('BrowserSync is already running');
			return;
		}
		browserSync({
			server:{
				baseDir: _.paths.web
			},
			ghostMode: false
		})
	}
}