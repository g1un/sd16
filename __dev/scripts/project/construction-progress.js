App.gui.add({
	_name: 'construction-progress-slider',
	selector: '.js-construction-progress-slider',
	build: function($el){
		var options = {
			prevArrow: '<button type="button" class="slick-prev"></button>',
			nextArrow: '<button type="button" class="slick-next"></button>',
			arrows: true,
			dots: false,
			fade: true,
			customPaging: function(slider, i) {
				return $('<button type="button" data-role="none" role="button" tabindex="0" />').html('<span>' + (i + 1) + '</span>').get(0).outerHTML;
			},
			slidesToShow: 1,
			slidesToScroll: 1
		};

		$el.slick(options);
		return {
			destroy: function(){
				$el.slick("unslick");
			}
		}
	},
	destroy: function($el, methods){
		if(methods && typeof methods['destroy'] == 'function') methods['destroy']();
	}
});