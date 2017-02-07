'use strict';
const imagemin = require('imagemin');
const imageminPngquant = require('imagemin-pngquant');

module.exports = function($, _) {
	return function(buffer, cb){
		var data = "data:image/png;base64," + (buffer.toString('base64'));
		cb(data);
	}
}