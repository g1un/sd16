App.gui.add({
	_name: 'carusel',
	selector: '[data-carusel]',
	build: function($el){
		var options = App.gui.getOption($el, "carusel");
		if(!options){ options = {} }

		var _default = {
			prevArrow: '<button type="button" class="slick-prev"></button>',
			nextArrow: '<button type="button" class="slick-next"></button>',
			arrows: true,
			dots: true,
			customPaging: function(slider, i) {
				return $('<button type="button" data-role="none" role="button" tabindex="0" />').html('<span>' + (i + 1) + '</span>').get(0).outerHTML;
			}
		};

		options = $.extend({}, _default, options);

		$el.slick(options);

		return {
			destroy: function(){
				$el.slick("unslick");
			}
		}
	},
	destroy: function($el, methods){
		if(methods && typeof methods['destroy'] == 'function'){
			methods['destroy']();
		}
	}
});