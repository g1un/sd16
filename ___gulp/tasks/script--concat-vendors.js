'use strict';
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');


module.exports = function(gulp, $, _) {
	return function(cb) {
		gulp.src(_['script-vendors'].from)
		.pipe(uglify({
			preserveComments: 'some'
		}).on('error', $.showErr))
		.pipe(concat('vendors.js').on('error', $.showErr))
		.on('error', $.showErr)
		.pipe(gulp.dest(_['script-vendors'].to))
		.on('end', function(){
			cb();
		})
	}
}