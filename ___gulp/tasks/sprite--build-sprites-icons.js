'use strict';
var spritesmith = require("gulp.spritesmith");
var path = require('path')


module.exports = function(gulp, $, _) {
	var moduleConfig = _['sprites-icons'];
	return function(cb) {
		var done = (function(count){
			return function(){
				count--;
				if(count <= 0){
					console.log('gone')
					cb();
				}
			}
		})(2);
		var spriteData =
			gulp.src(moduleConfig.from) // путь, откуда берем картинки для спрайта
				.pipe(spritesmith({
					imgName: moduleConfig.fileName,
					cssName: moduleConfig.cssName,
					cssFormat: 'stylus',
					imgPath: moduleConfig.pathImage.replace(/\\/g, '/'),

					//retinaSrcFilter: [path.src.spriteRetina + '*-2x.png'],
					//retinaImgName: 'sprite-2x.png',
					//retinaImgPath: 'sprite-2x.png',

					algorithm: 'binary-tree',
					padding: 20,
					cssTemplate: moduleConfig.template,
					cssVarMap: function(sprite) {
						sprite.name = 's-' + sprite.name
					}
				}))
				.on('error', $.showErr)

		spriteData.img.pipe(gulp.dest(moduleConfig.imageTo)).on('error', $.showErr).on('end', done); // путь, куда сохраняем картинку
		spriteData.css.pipe(gulp.dest(moduleConfig.stylusTo)).on('error', $.showErr).on('end', done); // путь, куда сохраняем стили
	}
}