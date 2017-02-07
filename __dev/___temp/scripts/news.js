(function(){
"use strict";
var check = function(){
	App.uniformHeight($('.news-list'), '.news-item', ['.news-item-title', '.news-item-text']);
}

App.gui.add({
	_name: 'news',
	selector: 'body',
	build: check,
	destroy: function(){}
});

App.onResize(check);


App.gui.add({
	_name: 'news-mobile-slider',
	selector: '.js-news-block.__mobile-slider .js-news-list',
	build: function($el){
		var enableSlider;

		var mediaListener = App.MEDIA.on(function(){
			update();
		});

		var update = function(){
			var _enableSlider = App.MEDIA.isMax('SMALL_TABLET');
			if( enableSlider === _enableSlider) return;
			if( enableSlider ){
				$el.slick("unslick");
			}
			if(_enableSlider){
				$el.slick({
					prevArrow: '<button type="button" class="slick-prev"></button>',
					nextArrow: '<button type="button" class="slick-next"></button>',
					arrows: false,
					dots: true,
					customPaging: function(slider, i) {
						return $('<button type="button" data-role="none" role="button" tabindex="0" />').html('<span>' + (i + 1) + '</span>').get(0).outerHTML;
					},
					slidesToShow: 1,
					slidesToScroll: 1
				})
			}
			enableSlider = _enableSlider;
		}

		update();

		return {
			destroy: function(){
				mediaListener.remove();
				if( enableSlider ){ $el.slick("unslick"); }
			}
		}
	},
	destroy: function($el, methods){
		if(methods && typeof methods['destroy'] == 'function') methods['destroy']();
	}
})
})();