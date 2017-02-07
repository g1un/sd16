(function(){
"use strict";
App.onReady(function(){
	var check = function(){
		App.uniformHeight($('.js-flatcard-top'), '.js-flatcard-gallery-preview,.js-flatcard-gallery-big,.js-floor-info,.js-flatcard-detail-content');
		setTimeout(function(){
			App.uniformHeight($('.js-flatcard-top'), '.js-flatcard-gallery-preview,.js-flatcard-gallery-big,.js-floor-info,.js-flatcard-detail-content');
		}, 10);
	}
	App.gui.add({
		_name: 'flatcardUniformHeight',
		selector: 'body',
		build: check,
		destroy: function(){}
	});

	App.onResize(check);
	check();
});

App.gui.add({
	_name: 'flatcard-gallery-big-list',
	selector: '.js-flatcard-gallery-big-list',
	build: function($list){
		if($list.hasClass('__inited-flatcard-gallery-big-list')) return;
		$list.addClass('__inited-flatcard-gallery-big-list');
		var $list = $('.js-flatcard-gallery-big-list');
		var startIndex = $list.children('.__current').index();
		if(!(startIndex>=0)) startIndex = 0;
		var slick = $list.slick({
			prevArrow: '<button type="button" class="slick-prev __aside"></button>',
			nextArrow: '<button type="button" class="slick-next __aside"></button>',
			arrows: true,
			dots: true,
			initialSlide: startIndex,
			customPaging: function(slider, i) {
				return $('<button type="button" data-role="none" role="button" tabindex="0" />').html('<span>' + (i + 1) + '</span>').get(0).outerHTML;
			}
		}).slick('getSlick');
		$list.on('afterChange.slicklist', function(e, slick, currentSlide){
			$('.js-flatcard-gallery-preview-link[href="' + slick.$slides.eq(currentSlide).find('img').attr('src') + '"]').trigger('gallerychanged');
		});
	},
	destroy: function(){

	}
})

// App.MEDIA.onMax('TABLET', function(){
// 	var $list = $('.js-flatcard-gallery-big-list');
// 	var startIndex = $list.children('.__current').index();
// 	if(!(startIndex>=0)) startIndex = 0;
// 	var slick = $list.slick({
// 		arrows: false,
// 		dots: true,
// 		initialSlide: startIndex,
// 		customPaging: function(slider, i) {
// 			return $('<button type="button" data-role="none" role="button" tabindex="0" />').html('<span>' + (i + 1) + '</span>').get(0).outerHTML;
// 		}
// 	}).slick('getSlick');
// 	$list.on('afterChange.slicklist', function(e, slick, currentSlide){
// 		$('.js-flatcard-gallery-preview-link[href="' + slick.$slides.eq(currentSlide).find('img').attr('src') + '"]').trigger('gallerychanged');
// 	});
// }, function(){
// 	$('.js-flatcard-gallery-big-list').slick('unslick').off('.slicklist');
// })

// App.gui.add({
// 	_name: 'flatcard-gallery',
// 	selector: '.js-flatcard-gallery-preview-link',
// 	build: function($el){
// 		$el.on('click.flatcard-gallery gallerychanged.flatcard-gallery', function(e){
// 			e.preventDefault();
// 			var $link = $(this);
// 			var $item = $link.closest('.js-flatcard-gallery-preview-item')
// 			if($item.hasClass('__current')) return;
// 			$('.js-flatcard-gallery-preview-item').removeClass('__current');
// 			$item.addClass('__current');

// 			$('.js-flatcard-gallery-big-item').removeClass('__current').filter(function(){
// 				return ($(this).find('img[src="' + $link.attr('href') + '"]').length !== 0);
// 			}).addClass('__current');

// 		})
// 	},
// 	destroy: function($el){
// 		$el.off('.flatcard-gallery');
// 	}
// });
})();