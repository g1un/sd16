module.exports = function($, _){
	var bs = require('browser-sync');

	var _reload = _._.debounce(function(args){
		$.log('Reloading')
		bs.reload.apply(bs, args);
	}, 1000);

	return function() {
		var args = Array.prototype.slice.call(arguments);
		return _._.bind(_reload, this, args);
	}
}