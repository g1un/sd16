'use strict';
var colors = require('colors/safe');
module.exports = function($){
	var logsTime = {}
	var log = function(msg){
		if(!$.isDebug()) return;
		console.log(
			colors.bgCyan(
				colors.white(
					"[" + $.getCurrentTime() + "] " + msg
				)
			)
		);
	}
	log.start = function(msg){
		if(!$.isDebug()) return;

		logsTime[msg] = Date.now()
		console.log(
			'\n' +
			colors.yellow(
				"[" + $.getCurrentTime() + "] [ START ] " + msg
			)
			+ '\n'
		);
	}
	log.end = function(msg){
		if(!$.isDebug()) return;

		var gone = '';
		if(logsTime[msg])
			gone = '[ ' + $.getGoneTime(logsTime[msg]) + ' ]\n'

		console.log(
			'\n' +
			colors.green(
				gone +
				"[" + $.getCurrentTime() + "] [  END  ] " + msg
			)
			+ '\n'
		);

		logsTime[msg] = false;
	}
	log.error = function(msg){
		console.log(
			'\n' +
			colors.red(
				"\n[" + $.getCurrentTime() + "] [ ERROR ] " + msg + "\n"
			)
			+ '\n'
		);
	}
	return log;
}