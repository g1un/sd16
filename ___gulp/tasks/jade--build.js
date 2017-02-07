'use strict';
var path = require('path')
var jadeEngine = require('jade')
var prettify = require('gulp-prettify')
var jade = require('gulp-jade')
var fs = require('fs');

module.exports = function(gulp, $, _){
	var _breakJade = null;

	return function(cb){
		if(typeof _breakJade == 'function'){
			_breakJade()
		}

		var _started = Date.now()
		var _lastData = _started
		var _lastRead = _started
		var _countFinish = 0
		var _break = false
		var _breakJade = function(){ _break = true; _breakJade = null; }

		var jadeFiles = fs.readdirSync( _.jade.from ).filter(function(fileName){
			return (path.extname(fileName) == '.jade')
		});

		var _totalFiles = jadeFiles.length;
		var _locals = {}

		for(var key in _.jadeLocals){
			_locals[key] = _.jadeLocals[key];
		}

		var dirVal = _.jade.variables
		var dirs = fs.readdirSync(dirVal)

		dirs.forEach(function(file){
			if( path.extname(file).toLowerCase() == '.json' ){
				_locals[ path.basename( file, path.extname(file) ) ] = JSON.parse( fs.readFileSync( path.join(dirVal, file) ))
			}
		});

		_locals.__STATIC_DIR = path.relative(_.paths.web, _.paths.template) + '/';

		_locals[ _.variablesName ] = $.getVariables();

		_locals.sha1 = require('sha1')

		_locals.PAGES = $.getListPages()
		_locals.JADE_COMPILE_FILE = function(){
			var args = Array.prototype.slice.call(arguments);
			return jadeEngine.compileFile.apply(jadeEngine, args);
		}

		var _jadeCompile = jade({
			locals: _locals,
			cache: false
		});

		var _currentIndex = 0

		var _end = function(){
			cb();
		}


		var _next = function(){
			if(_currentIndex == _totalFiles) return _end();
			var _file =  path.join(_.jade.from, jadeFiles[_currentIndex])
			_locals.CURRENT_FILE = jadeFiles[_currentIndex].split('.')
			_locals.CURRENT_FILE.pop()
			_locals.CURRENT_FILE = _locals.CURRENT_FILE.join('.')
			_currentIndex++
			gulp.src(_file)
			.pipe(jade({
				locals: _locals,
				cache: false
			}))
			.on('error', $.showErr)
			.pipe(prettify({
				indent_size: 1,
				indent_char: '\t',
				unformatted: ['span']
			}))
			.pipe(gulp.dest(_.jade.to))
			.on('end', function(){
				if(_break) return
				_countFinish++;
				var _logMes = '[' + _countFinish + ' / ' + _totalFiles + ' (' + $.percentValueFormat(Math.round((_countFinish*100)/_totalFiles)) + '%)'+ ']'
				_logMes += ' File (' + jadeFiles[_currentIndex - 1] + ') complete '
				_logMes += '[' + Math.round(((Date.now() - _lastData)/1000)*100)/100 + ' сек.]'
				$.log(_logMes)

				_lastData = Date.now()
				$.async(_next)
			})
		};
		_next();
	}
}