'use strict';
var concat = require('gulp-concat');
var autoprefixer = require('gulp-autoprefixer');
var stylus = require('gulp-stylus');
var rename = require('gulp-rename');
var cssbeautify = require('gulp-cssbeautify');

module.exports = function(gulp, $, _){
	return function(cb){
		var _raw = {}
		_raw[ _.variablesName ] = $.getVariables();
		gulp.src(_['stylus'].from)
		.pipe(concat('00_production.styl'))
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

				style.define(_.variablesName + "_ADD", function(arg1, arg2){
					$.getVariables.addValue(arg1['val'] ? arg1['val'] : arg1['vals'] , arg2['val'] ? arg2['val'] : arg2['vals'])
				});
			}
		}).on('error', $.showErr))
		.pipe(autoprefixer({browsers: ['last 50 version']}).on('error', $.showErr))
		.pipe(cssbeautify({
			indent: '\t'
		}))
		.pipe(rename('template_styles.css'))
		.pipe(gulp.dest(_['stylus'].to))
		.on('end', function(){ cb(); })
	}
}