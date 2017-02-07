'use strict';
var newer = require('gulp-newer');
var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');
var cache = require('gulp-cached');
module.exports = function(gulp, $, _){
	return function (cb) {
		gulp.src(_.images.from)
			.pipe(cache('images'))
			.pipe(imagemin({
				progressive: true,
				svgoPlugins: [{removeViewBox: false}],
				use: [pngquant()]
			}))
			.pipe(gulp.dest(_.images.to))
			.on('end', cb);
	}
}