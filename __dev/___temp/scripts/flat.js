(function(){
"use strict";
App.run(function(){
	var check = function($flat){
		var $flat = $flat || $('.js-flat');
		$flat.find('.js-flat-content-inner,.js-flat-inner').css('min-height', '');
		App.uniformHeight($('.js-flats-list'), '.js-flat', '.js-flat-inner');

		$flat.each(function(){
			var $flat = $(this);
			var $contentInner = $flat.find('.js-flat-content-inner').css('min-height', '');
			var $content = $flat.find('.js-flat-content');

			var contentInnerHeight = $contentInner.outerHeight();
			var contentHeight = $content.height();

			if( contentInnerHeight == contentHeight ) return;

			$contentInner.css('min-height', contentHeight);
		});
	}
	App.gui.add({
		_name: 'flat-content--height',
		selector: '.js-flat',
		build: check,
		destroy: function(){}
	});

	App.onResize.prepend(function(){
		$('.js-flat').find('.js-flat-content-inner').css('min-height', '');
	});

	$('html').on('reset-height', function(){
		$('.js-flat').find('.js-flat-content-inner').css('min-height', '');
	});


	$('html').on('uniformheight-resized', function(){
		check();
	})

	App.onReady(function(){
		var _timeout;
		setTimeout(function(){
			App.onResize(function(){
				check();
			});
		}, 100);
		setTimeout(function(){
			check();
		}, 10);
	})


	App.onLiveClick('.js-flat-info-toggle-link', function(e){
		e.preventDefault();
		$(this).closest('.js-flat').toggleClass('__show-info').trigger('resize');
	});
});
})();