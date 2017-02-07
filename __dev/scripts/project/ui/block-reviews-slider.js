App.gui.add({
	_name: 'block-review-sslider',
	selector: '[data-ui-block-reviews-slider]',
	build: function($el){

		$el.slick({
			arrows: true,
			dots: false,
			adaptiveHeight: true,
			prevArrow: $el.closest('.js-block-reviews-slider').find('.js-block-reviews-slider-prev'),
			nextArrow: $el.closest('.js-block-reviews-slider').find('.js-block-reviews-slider-next'),
			fade: true
		})

		return {
			destroy: function(){
				$el.slick('unslick');
			}
		}
	},
	destroy: function($el, methods){
		if (typeof methods['destroy'] !== 'function') return;
		methods['destroy']();
	}
})