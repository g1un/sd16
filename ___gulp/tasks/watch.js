module.exports = function(gulp, $, _){
	return function(){
		_['watch'].get().forEach(function(item){
			gulp.watch(item[0],{
				interval: 1000, // default 100
				debounceDelay: 1000 // default 500
			}, item[1]).on('error', $.showErr);
		})
	}
}