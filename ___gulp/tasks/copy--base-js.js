'use strict';
module.exports = function(gulp, $, _){
	return function (cb) {
		// $.deleteFolderRecursive(_.baseStyle.to)
		$.copyDir(_.baseScript.from, _.baseScript.to, { clobber: true }, cb);
	}
}