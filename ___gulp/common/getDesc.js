'use strict';
var fs = require('fs');

module.exports = function($, _){
	return function(txt){
		var dict = fs.readFileSync(_.dictionary, 'utf-8')
		dict = JSON.parse(dict)

		for(var key in dict){
			var value = dict[key]
			if(key == txt) return value;
		}
		return txt;
	}
}