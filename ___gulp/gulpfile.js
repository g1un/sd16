process.stdout.write('\033c');
(function(){
	'use strict';
	var startTime = Date.now();

	var gulp = require('gulp')
	var fs = require('fs')
	var path = require('path')
	var _ = require('underscore');

	var fileName = function(file){
		return path.basename(file, path.extname(file));
	}

	var argsPrefix = '--gp-'
	var args = {
		'debug': 'debug',
		'auto-snapshot': 'autosnapshot'
	}

	var $ = {} // common
	var config = {} // config
	config.__ = {}

	config._ = _;

	_.each(args, function(argName, argKey){
		var _tmp = argsPrefix + argKey;
		_tmp = process.argv.indexOf(_tmp);
		if(_tmp == -1){
			_tmp = false;
		}
		config.__[argName] = _tmp;
	})

	// config.__.debug = (process.argv.indexOf('--debug-this') != -1)
	// config.__.autosnapshot = process.argv.indexOf('--auto-snapshot')
	if(config.__.autosnapshot !== false){
		if(config.__.autosnapshot + 1 < process.argv.length && parseInt(process.argv[config.__.autosnapshot + 1]) > 0){
			config.__.autosnapshot = parseInt(process.argv[config.__.autosnapshot + 1]) * 1000;
		} else {
			config.__.autosnapshot = 20000;
		}
	} else {
		config.__.autosnapshot = false;
	}

	var timeValueFormat = function (val){ if(val < 10) return "0" + val; return val; }

	var _startTime = new Date()
	_startTime = timeValueFormat(_startTime.getHours()) + ':' + timeValueFormat(_startTime.getMinutes()) + ':' + timeValueFormat(_startTime.getSeconds());

	console.log('\t\t\t\t  ' + _startTime)
	console.log('\n');

	_.each(config.__, function(val, key){
		console.log(key + ': ' + (val !== false))
	})

	// console.log('Is debug: ' + (config.__.debug !== false))
	// console.log('Auto snapshot: ' + (config.__.autosnapshot !== false))
	console.log('\n');

	if(config.__.debug)
		console.log('Loading common')


	$.runSequence = require('run-sequence').use(gulp);

	var commonFiles = fs.readdirSync('common').sort();
	var commonFiles_length = commonFiles.length;
	commonFiles.forEach(function(file, index){
		if(config.__.debug) {
			var _text = 'Loading common: ' + (Math.round( ((index)*100)/commonFiles_length ) + '% ' ) + file;
			if($['log']){
				$.log(_text)
			} else {
				console.log(_text);
			}	
		}
		$[ fileName(file) ] = require( path.join(__dirname, './common', file) )($, config);
	});

	require('./tasks/_config')(config, __dirname, $);

	$.log.end('Loading common');


	// $.profiler.startProfiling('Start', true);

	config.jadeLocals = {
		scriptFiles: []
	}


	var tasks = fs.readdirSync(config.paths.tasks).sort();

	$.log.start('Loading tasks');

	tasks.forEach(function(file, index) {
		if (file == '_config.js') return;

		var _fName = fileName(file);
		_fName = _fName.replace(/--/g, ': ');

		if(config.__.debug) {
			var _text = 'Loading tasks: ' + $.percentValueFormat(Math.round( ((index)*100)/tasks.length) ) + '% ' + ' [' + _fName + '] '  + file;
			$.log(_text)
		}

		gulp.task(_fName, require( $.getPath(config.paths.tasks, file) )(gulp, $, config));
	});

	$.log.end('Loading tasks');

	$.log.start('Default');

	gulp.task('default', [
		'build: dev'
	], function(){
		$.log.start('After-default');
		$.runSequence('after-default', function(){
			$.async(function(){
				if(config.__.autosnapshot){
					setInterval(function(){
						$.snapshot();
					}, config.__.autosnapshot);
				}
				$.log.end('After-default');
				$.log.end( 'Default' );
			})
		});
	});


})();