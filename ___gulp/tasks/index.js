'use strict';
var jade = require('gulp-jade');
module.exports = function(gulp, $, _){
	return function(cb){
		var files = $.getListPages()
		gulp.src(_.index.from)
		.pipe(jade({pretty: true, locals: {'pages': files}}).on('error', $.showErr))
		.pipe(gulp.dest(_.index.to))
		.on('end', function(){ cb(); })
	}
}