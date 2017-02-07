'use strict';
module.exports = function(gulp, $, _){
	return function (cb) {
		// $.deleteFolderRecursive(_.baseStyle.to)
		$.copyDir(_.baseStyle.from, _.baseStyle.to, { clobber: true }, cb);
	}
}