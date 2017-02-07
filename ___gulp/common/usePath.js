module.exports = function($, _){
	return function(pathName){
		return _['paths'][pathName];
	}
}