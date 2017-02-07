'use strict';

var PNG = require('pngjs').PNG;

var Stream = require('stream');

module.exports = function($, _) {
	return function(color, cb) {


		var ws = new Stream;
		ws.writable = true;
		ws.buffer = [];

		ws.write = function(buf) {
			ws.buffer.push(buf);
		}
		ws.end = function(buf) {
			if (arguments.length) ws.write(buf);
			ws.writable = false;
			cb( Buffer.concat(ws.buffer) );
		}

		new PNG({
			width: 1,
			height: 1,
			inputHasAlpha: true,
			filterType: 4,
			bgColor: {
				red: 255 - color[0],
				green: 255 - color[1],
				blue: 255 - color[2],
				alpha: color[3]
			}
		}).pack().pipe(ws);
	}
}
