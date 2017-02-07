'use strict';
var concat = require('gulp-concat');
var marked = require('gulp-marked');
var markdox = require("gulp-markdox");
var fs = require('fs');
var path = require('path');
var wrap = require("gulp-wrap");
module.exports = function(gulp, $, _){
	return function (cb) {
		var resultFile = path.join(_['jsdoc'].to, '--dev--documentation.html')
		try {
			fs.unlinkSync(resultFile);
			// Do something
		} catch (e) {
			// It isn't accessible
		}
		return gulp.src( _['jsdoc'].from)
			.on('error', $.showErr)
			.pipe(markdox({
				template: _['jsdoc'].template
			}))
			.on('error', $.showErr)
			.pipe(concat('--dev--documentation.html'))
			.on('error', $.showErr)
			// .pipe(gulp.dest(_['jsdoc'].scripts))
			// .pipe(marked({
				
			// }).on('error', $.showErr))
			// .on('error', $.showErr)
			.pipe(wrap('<!DOCTYPE html><html lang="ru"><head><meta charset="UTF-8"><title>Documentation</title><link rel="stylesheet" href="_index/documentation.css"><link rel="stylesheet" href="_index/highlight/styles/monokai.css"><script src="_index/highlight/highlight.pack.js"></script><script>hljs.initHighlightingOnLoad();</script><script src="https://code.jquery.com/jquery-1.12.3.min.js"></script></head><body><div id="content"><%= contents %></div><script src="_index/documentation.js"></script></body></html>'))
			.on('error', $.showErr)
			.pipe(gulp.dest(_['jsdoc'].to));
	}
}