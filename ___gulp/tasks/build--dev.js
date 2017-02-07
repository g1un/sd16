module.exports = function(gulp, $, _){
	return function(cb){
		$.runSequence(
			'clear-all',
			'create-structure',
			// 'copy: images',
			'image: min',
			'sprite: build-sprites',
			'sprite: build-sprites-icons',
			'copy: base-css',
			// 'copy: base-js',
			'copy: index',
			'copy: libs',
			'copy: json-data',
			'jade: popups',
			'script: concat-vendors',
			// 'coffee: build',
			'script: build',
			'script: build-module',
			'style: concat-vendors',
			'stylus: build-base',
			'stylus: build',
			'jsdoc: build',
			cb
		)
	}
}