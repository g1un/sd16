App.gui.add({
	_name: 'gallery-slider',
	selector: '.js-gallery-slider',
	build: function($el){
		$el.slick({
			arrows: true,
			dots: false,
			prevArrow: '<button type="button" class="slick-prev"></button>',
			nextArrow: '<button type="button" class="slick-next"></button>',
			fade: true,
		})
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
})


App.gui.add({
	_name: 'gallery-page',
	selector: '.js-gallery-page .js-gallery-slider',
	build: function($el){
		$el.on('init.gallery-page afterChange.gallery-page', function(e, slick){
			setTimeout(function(){
				var currentSlideIndex = slick.getCurrent();
				var $slide = slick.$slides.eq(currentSlideIndex);
				var $img = $slide.find('img');
				var data = {
					url: $img.get(0).src,
					title: $img.attr('title') || $('title').text() || '',
					description: $img.attr('data-description') || $('meta[name="description"]').attr('content') || '',
					image: $img.get(0).src
				}
				$el.closest('.js-gallery-page').find('.js-share').trigger('update-share', [data])
			}, 10);
		});
		return {
			destroy: function(){
				$el.off('.gallery-page')
			}
		}
	},
	destroy: function($el, methods){
		if(methods && typeof methods['destroy'] == 'function'){
			methods['destroy']();
		}
	}
})