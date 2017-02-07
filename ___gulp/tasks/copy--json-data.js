'use strict';
module.exports = function(gulp, $, _){
	return function(cb){

		$.deleteFolderRecursive(_.jsondata.to)

		$.copyDir(_.jsondata.from, _.jsondata.to, { clobber: true }, cb);

		return true
	}
}