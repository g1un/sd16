App.gui.add({
	_name: 'banners',
	selector: '.js-banners-list',
	build: function($el){
		var options = {
			prevArrow: '<button type="button" class="slick-prev"></button>',
			nextArrow: '<button type="button" class="slick-next"></button>',
			arrows: false,
			dots: true,
			customPaging: function(slider, i) {
				return $('<button type="button" data-role="none" role="button" tabindex="0" />').html('<span>' + (i + 1) + '</span>').get(0).outerHTML;
			},
			slidesToShow: 2,
			slidesToScroll: 2
		};

		var getCurrentMode = function(){
			if( App.MEDIA.isMin('WIDE_DESKTOP') ){
				return 3;
			}
			if( App.MEDIA.isMin('TABLET') ){
				return 2;
			}
			return 1;
		}

		var currentMode = getCurrentMode();//App.MEDIA.isMin('TABLET');

		var getOption = function(){
			if( App.MEDIA.isMin('WIDE_DESKTOP') ){
				return [ ["slidesToShow", 3], ["slidesToScroll", 3] ];
			}
			if( App.MEDIA.isMin('TABLET') ){
				return [ ["slidesToShow", 2], ["slidesToScroll", 2] ];
			}
			return [ ["slidesToShow", 1], ["slidesToScroll", 1] ];
		}

		_.each(getOption(), function(option){
			options[option[0]] = option[1];
		})

		$el.slick(options);

		var mediaListener = App.MEDIA.on(function(){
			updateOptions();
		});

		var updateOptions = function(){
			var _currentMode = getCurrentMode();
			if( currentMode == _currentMode ) return;
			currentMode = _currentMode;

			_.each(getOption(), function(option, index, arr){
				$el.slick("slickSetOption", option[0], option[1], (index == (arr.length - 1)));
			})
		}


		return {
			destroy: function(){
				mediaListener.remove();
				$el.slick("unslick");
			}
		}
	},
	destroy: function($el, methods){
		if(methods && typeof methods['destroy'] == 'function') methods['destroy']();
	}
});