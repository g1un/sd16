'use strict';
var fs = require('fs');
module.exports = function($){
	return function(path, inner){
		var files = []
		if( fs.existsSync(path) ) {
			if(inner !== true){
				$.log.start( 'REMOVING ' + path);
			}

			files = fs.readdirSync(path, function (er){ $.log.error(er); });

			files.forEach( function (file,index){
				var curPath = path + "/" + file;
				if( fs.lstatSync(curPath).isDirectory() ){ $.deleteFolderRecursive(curPath, true) }
				else { fs.unlinkSync(curPath, function(er){ $.log.error(er) }); }
			});
			fs.rmdirSync(path, function (er){ $.log.error(er); });

			if(inner !== true){
				$.log.end( 'REMOVING ' + path );
			}
		}
		// else { $.log.error( path + ' NOT EXISTS '); }
	}
}