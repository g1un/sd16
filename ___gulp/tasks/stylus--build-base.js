'use strict';
var concat = require('gulp-concat');
var autoprefixer = require('gulp-autoprefixer');
var stylus = require('gulp-stylus');
var rename = require('gulp-rename');

module.exports = function(gulp, $, _){
	return function(cb){
		var _raw = {}
		_raw[ _.variablesName ] = $.getVariables();
		gulp.src(_['stylus-base'].from)
		.pipe(concat('00_base.styl'))
		.pipe(gulp.dest(_.paths.temp))
		.pipe(stylus({
			rawDefine: _raw,
			use: function(style){
				style.define('__px64', function(r, g, b, a){
					var _color = [r,g,b];
					if(a) _color.push(a);
					_color.forEach(function(item, index, arr){
						arr[index] = item.val;
					})
					return 'url(' + $.px64(_color) + ') center repeat;';
				});
			}
		}).on('error', $.showErr))
		.pipe(autoprefixer({browsers: ['last 50 version']}).on('error', $.showErr))
		.pipe(rename('00_base.css'))
		.pipe(gulp.dest(_['stylus-base'].to))
		.on('end', function(){ cb(); })
	}
}