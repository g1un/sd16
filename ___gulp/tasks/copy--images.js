'use strict';
module.exports = function(gulp, $, _){
	return function (cb) {
		// $.deleteFolderRecursive(_.baseStyle.to)
		$.copyDir(_.images.from, _.images.to, { clobber: true }, cb);
	}
}