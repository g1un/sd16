module.exports = function(gulp, $, _){
	return function(callback){
		$.runSequence(
			'jade: concat-mixins',
			'jade: build',
			'index',
			'browser-sync',
			'watch',
			callback
		)
	}
}