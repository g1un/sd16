// App.gui.add({
// 	_name: 'choose-flat-slider',
// 	selector: '.js-choose-flat-slider',
// 	build: function($el){
// 		var $counter = $('.js-choose-flat-slider-counter');

// 		var lastCount = 0;
// 		var enableDots;

// 		var checkOptions = function(){
// 			var currentCount = parseInt($counter.css('z-index'));
// 			if(!currentCount || currentCount < 1) currentCount = 1;

// 			var _updateCount = currentCount !== lastCount;
// 			var _updateDots = (App.MEDIA.isMax("TABLET") !== enableDots);

// 			if(!_updateDots && !_updateCount) return false;

// 			if(_updateCount){ lastCount = currentCount; }
// 			if(_updateDots){ enableDots = App.MEDIA.isMax("TABLET"); }
// 			return true;
// 		}

// 		var getOptions = function(){
// 			return [ ["slidesToShow", lastCount], ["slidesToScroll", lastCount], ["dots", enableDots] ];
// 		}

// 		var updateOptions = function(){
// 			_.each(getOptions(), function(option, index, arr){
// 				$el.slick("slickSetOption", option[0], option[1], (index == (arr.length - 1)));
// 			});
// 		}

// 		var options = {
// 			prevArrow: '<button type="button" class="slick-prev"></button>',
// 			nextArrow: '<button type="button" class="slick-next"></button>',
// 			arrows: true,
// 			dots: false,
// 			customPaging: function(slider, i) { return $('<button type="button" data-role="none" role="button" tabindex="0" />').html('<span>' + (i + 1) + '</span>').get(0).outerHTML; },
// 			slidesToShow: 2,
// 			slidesToScroll: 2,
// 			infinite: false,
// 		}

// 		checkOptions();
// 		_.each(getOptions(), function(option){ options[option[0]] = option[1]; });

// 		$el.slick(options);

// 		var resizeListener = App.onResize(function(){
// 			if(!checkOptions()) return;
// 			updateOptions();
// 			setTimeout(function(){
// 				$(window).trigger('resize');
// 			}, 10);
// 		});

// 		return {
// 			destroy: function(){
// 				App.onResize.remove(resizeListener);
// 				$el.slick("unslick");
// 			}
// 		}
// 	},
// 	destroy: function($el, methods){
// 		if(methods && typeof methods['destroy'] == 'function') methods['destroy']();
// 	}
// })

App.gui.add({
	_name: 'choose-flat-slider',
	selector: '.js-choose-flat-slider',
	build: function($el){
		var $counter = $('.js-choose-flat-slider-counter');
		var slider = false;
		var lastCount = 0;

		var options = {
			prevArrow: '<button type="button" class="slick-prev"></button>',
			nextArrow: '<button type="button" class="slick-next"></button>',
			arrows: true,
			dots: false,
			customPaging: function(slider, i) { return $('<button type="button" data-role="none" role="button" tabindex="0" />').html('<span>' + (i + 1) + '</span>').get(0).outerHTML; },
			slidesToShow: 2,
			slidesToScroll: 2,
			infinite: false,
		}

		var checkOptions = function(){
			var currentCount = parseInt($counter.css('z-index'));
			if(!currentCount || currentCount < 1) currentCount = 1;

			var _updateCount = currentCount !== lastCount;

			if(!_updateCount) return false;

			if(_updateCount){ lastCount = currentCount; }
			return true;
		}

		var getOptions = function(){
			return [ ["slidesToShow", lastCount], ["slidesToScroll", lastCount] ];
		}

		var updateOptions = function(){
			_.each(getOptions(), function(option, index, arr){
				$el.slick("slickSetOption", option[0], option[1], (index == (arr.length - 1)));
			});
		}

		var mediaListener = App.MEDIA.onMax('TABLET', function(){
			console.log('tablet')
			var currentCount = parseInt($counter.css('z-index'));
			if(!currentCount || currentCount < 1) currentCount = 1;
			var _updateCount = currentCount !== lastCount;
			slider = true;

			checkOptions();
			_.each(getOptions(), function(option){ options[option[0]] = option[1]; });

			$el.slick(options);

		}, function(){

			console.log('not-tablet')
			if(!slider) return;
			slider = false;
			$el.slick("unslick");
		})

		var resizeListener = App.onResize(function(){
			if(!slider) return;
			if(!checkOptions()) return;
			updateOptions();
			setTimeout(function(){
				$(window).trigger('resize');
			}, 10);
		});

		return {
			destroy: function(){
				App.onResize.remove(resizeListener);
				if(slider){
					$el.slick("unslick");
				}
				mediaListener.remove();
			}
		}
	},
	destroy: function($el, methods){
		if(methods && typeof methods['destroy'] == 'function') methods['destroy']();
	}
})

App.onLiveClick('.js-choose-flat-filter-extend-button', function(e){
	e.preventDefault();
	var $filter = $(this).closest('.js-choose-flat-filter').toggleClass('__extended');
	if( $filter.hasClass('__extended') ){
		App.blackout.show('choose-flat-filter');
		App.blackout.one('hide', function(){ $filter.removeClass('__extended'); });
	} else {
		App.blackout.hide();
	}
	App.triggerResize();
});


App.run(function(){
	var __filterFixedClass = '__filter-fixed';

	var getVisibleFooterHeight = function(){
		var $footer = $('.js-footer');
		var windowHeight = $(window).height();
		var footerHeight = $footer.outerHeight();
		var footerOffsetTop = $footer.offset().top;
		var scrollTop = App.getWindowScroll().top;
		var result = scrollTop + windowHeight - footerOffsetTop;
		if(result < 0) result = 0;
		return result;
	}

	var handler = function(){
		$('html').removeClass(__filterFixedClass);
		if( !App.MEDIA.isMin('SMALL_DESKTOP') ) return;
		var $filter = $('.js-choose-flat-filter');
		$filter.css('margin-top', '');
		if($filter.length == 0) return;

		var scrollPos = App.getWindowScroll();
		var filterTopOffset = $filter.offset().top;
		var topOffset = $('.js-header').outerHeight() + 20;
		var filterHeight = $filter.outerHeight();
		if( filterHeight + topOffset > $(window).height() ) return;
		if(scrollPos.top + topOffset > filterTopOffset){
			$('html').addClass(__filterFixedClass);
		}
		$filter.css('margin-top', -getVisibleFooterHeight() || '');
	}

	App.onScroll(handler)
	App.onResize(handler)
})