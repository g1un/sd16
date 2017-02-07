'use strict';
module.exports = function(gulp, $, _){
	return function(cb){

		$.deleteFolderRecursive(_.libs.to)

		$.copyDir(_.libs.from, _.libs.to, { clobber: true }, cb);

		return true
	}
}