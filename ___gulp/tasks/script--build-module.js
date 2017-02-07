'use strict';
var concat = require('gulp-concat');
var path = require('path');
var jsprettify = require('gulp-jsbeautifier');
var wrap = require("gulp-wrap");
var strip = require('gulp-strip-comments');

module.exports = function(gulp, $, _) {
	return function(cb) {
		var fromFolder = _['scripts-modules'].from;

		$.eachAsync($.getDirectories(fromFolder), function(moduleName) {
			var _loop = this;
			var moduleFiles = [
				path.join(fromFolder, moduleName, '*.js'),
				'!' + path.join(fromFolder, moduleName, '__*.js')
			];

			$.log.start('[js module] ' + moduleName);

			if (_.jadeLocals.scriptFiles == null) {
				_.jadeLocals.scriptFiles = [];
			}

			if (_.jadeLocals.scriptFiles.indexOf(moduleName + '.js') == -1) {
				_.jadeLocals.scriptFiles.push(moduleName + '.js');
			}

			gulp.src(moduleFiles)
				.pipe(concat(moduleName + '.js', {newLine: '\r\n\r\n'}).on('error', $.showErr))
				.pipe(wrap('(function(){\r\n"use strict";\r\n<%= contents %>\r\n})();'))
				.pipe(strip({safe: true, ignore: /\/\*\*\s*\n([^\*]*(\*[^\/])?)*\*\//g}))
				.pipe(jsprettify({indent_size: 1, indent_char: '\t'}))
				.pipe(gulp.dest(_['scripts-modules'].to))
				.on('end', function() {

					$.log.end('[js module] ' + moduleName)
					_loop.next();
				})
		}, cb).next();
	}
}
