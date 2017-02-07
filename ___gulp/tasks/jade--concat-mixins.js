'use strict';
var fs = require('fs');
module.exports = function(gulp, commons, config){
	return function (cb) {
		var opt = config['jade-mixins'];

		var base = commons.getFilesInDir( opt.base, '.jade' );
		var project = commons.getFilesInDir( opt.project, '.jade' );

		var result = [];
		base.forEach(function(item){
			result.push( 'include ' + opt.mixinPath + 'base/' + item );
		});
		project.forEach(function(item){
			result.push( 'include ' + opt.mixinPath + 'project/' + item );
		});

		result = result.join('\r\n');

		fs.writeFileSync(opt.mixinFile, result, 'utf8');
		cb();
	}
}