'use strict';
var ncp = require('ncp').ncp;
ncp.limit = 30;
var nodeFs = require('node-fs');

module.exports = function($, _){
	return function(fromPath, toPath, params, done){

		$.log.start('Копирование \n        ' + fromPath + '\n      в ' + toPath);

		ncp.limit = 30;

		nodeFs.mkdirSync(toPath, null, true);

		ncp(fromPath, toPath, params, function(err){
			if(err){ $.log.error(err); }
			else { $.log.end('Копирование \n        ' + fromPath + '\n      в ' + toPath) }
			done();
		});
	}
}