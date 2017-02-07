'use strict';
var path = require('path');
// var coffee = require('gulp-coffee');
var jsprettify = require('gulp-jsbeautifier');
var Stream = require("stream");
var wrap = require("gulp-wrap");
var strip = require('gulp-strip-comments');
var fs = require('fs')

var lastCountScripts = 0;

module.exports = function(gulp, $, _){
	return function (cb) {
		var _jsFiles = []
		$.deleteFolderRecursive(_.scripts.to);
	
		var controlScrips = function(){
			var streamScript = new Stream.Transform({objectMode: true});

			var parsePath = function(file){
				var extname = path.extname(file);
				return {
					dirname: path.dirname(file),
					basename: path.basename(file, extname),
					extname: extname
				};
			}

			streamScript._transform = function (file, unused, callback){
				var _parsed = parsePath(file.path);

				var reg = /[0-9]+[_]+.+/;
				var removeReg = /[0-9]+[_]+/;

				if(reg.test(_parsed.basename)){
					_parsed.basename  = _parsed.basename.replace(removeReg, '')
				}

				file.path = _parsed.dirname + '\\' + _parsed.basename + _parsed.extname;

				return callback(null, file);
			}
			return streamScript;
		}

		gulp.src(_.scripts.from)
			.pipe(wrap('(function(){\r\n"use strict";\r\n<%= contents %>\r\n})();'))
			.pipe(gulp.dest(_.scripts.temp))
			// .pipe(coffee())
			// .on('error', $.showErr)
			.pipe(strip({ignore: /\/\*\*\s*\n([^\*]*(\*[^\/])?)*\*\//g}))
			.pipe(jsprettify({indent_size: 1, indent_char: '\t'}))
			.pipe(controlScrips())
			.pipe(gulp.dest(_.scripts.to))
			.on('data', function(data){
				var _file = path.basename(data.history[ data.history.length - 1 ]);
				_jsFiles.push(_file);
			})
			.on('end', function(){
				if( _.jadeLocals.scriptFiles == null ){
					_.jadeLocals.scriptFiles = _jsFiles;
				} else {
					_jsFiles.forEach(function(script){
						if( _.jadeLocals.scriptFiles.indexOf(script) != -1 ) return;
						_.jadeLocals.scriptFiles.push(script);
					})
				}
				if(lastCountScripts != _jsFiles.length){
					lastCountScripts = _jsFiles.length;
					fs.writeFileSync(_.scripts.triggerJade, ('trigger' + Date.now()));
				}
				cb();
			});
	}
}