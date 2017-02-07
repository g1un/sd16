'use strict';
var fs = require('fs');
module.exports = function(commons, config){
	var result;
	var _self = function(refresh) {
		if(refresh !== true && result != null) return result;
		if(result == null){
			result = {}
		}
		var _path = commons.getPath(config.paths['dev'], '_variables');

		var variables = fs.readdirSync(_path).sort();

		variables.forEach(function(file, index) {
			var _key = file.split('.');
			_key.pop();
			_key = _key.join('.');
			var json = fs.readFileSync( commons.getPath(_path, file) , 'utf8');
			json = JSON.parse(json);
			result[_key] = json;
		});

		result.addValue = function(_name, _val){
			result[_name] = _val;
		}

		return result;
	}

	_self.addValue = function(_name, _val){
		if(result == null){
			result = {}
		}
		result[_name] = _val;
	}

	return _self;
}