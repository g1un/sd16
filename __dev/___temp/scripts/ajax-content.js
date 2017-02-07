(function(){
"use strict";
App.gui.add({
	_name: 'ajax-content',
	selector: '[data-ajax-content]:not(.__inited)',
	build: function($el){
		$el.addClass('__inited');
		$el.on('loadcontent', function(){
			if($el.hasClass('__loading')) return;
			$el.addClass('__loading');
			$el.empty();
			var $preloaderWrapper = $('<div></div>');

			var $contentBuild = $('<div></div>');

			$preloaderWrapper.append($contentBuild);
			$preloaderWrapper.css({
				'width': 0,
				'height': 0,
				'overflow': 'hidden'
			})
			$el.append($preloaderWrapper);

			$.get($el.attr('data-ajax-content'), {ajax: true}, function(data){
				var $parent = $el.parent()

				$contentBuild.css({
					'width': $parent.width()
				})

				$contentBuild.html( data );

				var _loaded = (function(cb){ var gone = 0; return function(){ gone++; return function(){ setTimeout(function(){ gone--; if(gone<=0){ cb(); } }, 10); } } })(function(){
					App.gui.build( $contentBuild );
					$(window).resize();

					setTimeout(function(){
						$el.replaceWith( $contentBuild.children() );
					}, 20);
				});

				$contentBuild.find('img,iframe').each(function(){
					$(this).one('load', _loaded());
					if(this.complete) $(this).load();
				})
			}, 'text').fail(function(){
				$el.empty();
				$el.removeClass('__loading');
				$el.addClass('__fail');
				$el.append('<p>Ошибка загрузки</p>');
				var $loadButton = $('<a href="#" data-button="">Повторить снова</a>').on('click', function(e){
					e.preventDefault();
					$el.empty();
					$el.removeClass('__fail');
					$el.addClass('__loading');
					setTimeout(function(){
						$el.trigger('loadcontent');
					}, 100);
				});
				$el.append($loadButton);
			});
		});

		if($el.is(':visible')){
			$el.trigger('loadcontent');
		}
	},
	destroy: function(){}
})

App.onResize(function(){
	$('[data-ajax-content]:visible').trigger('loadcontent');
})
})();