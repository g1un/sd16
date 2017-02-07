var profiler = require('v8-profiler');
var fs = require('fs');
module.exports = function($, _){
	var startTime = Date.now();
	var count = 0;
	return function(){
		count++;
		var snapshot2 = profiler.takeSnapshot();
		$.log.start('Take snapshot');
		snapshot2.export()
		.pipe(fs.createWriteStream('debug/snapshot/' + startTime + '-' + count + '.heapsnapshot'))
		.on('finish', function(){
			snapshot2.delete();
			$.log.end('Take snapshot');
		});
	}
}