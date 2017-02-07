'use strict';
var path = require('path');
var coffee = require('gulp-coffee');
var jsprettify = require('gulp-jsbeautifier');
var Stream = require("stream");

module.exports = function(gulp, $, _){
	return function (cb) {
		var _jsFiles = []
	
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

				file.path = _parsed.dirname + '/' + _parsed.basename + _parsed.extname;

				return callback(null, file);
			}
			return streamScript;
		}

		gulp.src(_.coffee.from)
		.pipe(coffee())
		.on('error', $.showErr)
		.pipe(jsprettify({indentSize: 1, indentChar: '\t'}))
		.pipe(controlScrips())
		.pipe(gulp.dest(_.coffee.to))
		.on('data', function(data){
			var _file = path.basename(data.history[ data.history.length - 1 ]);
			_jsFiles.push(_file);
		})
		.on('end', function(){
			_.jadeLocals.scriptFiles = _jsFiles;
			cb();
		});
	}
}