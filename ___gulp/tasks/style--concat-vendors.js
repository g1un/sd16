'use strict';
var concat = require('gulp-concat');
var autoprefixer = require('gulp-autoprefixer');
var minifyCSS = require('gulp-minify-css');


module.exports = function(gulp, $, _) {
	return function(cb) {
		gulp.src(_['style-vendors'].from)
		.pipe(concat('vendors.css'))
		.pipe(autoprefixer({browsers: ['last 20 version']}).on('error', $.showErr))
		.pipe(minifyCSS({keepSpecialComments: 0}).on('error', $.showErr))
		.pipe(gulp.dest(_['style-vendors'].to))
		.on('end', function(){ cb(); })
	}
}