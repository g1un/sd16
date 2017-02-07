$(document).ready(function(){
	function _loading(){
		$('body').addClass('__loading');
	}
	function _loaded(){
		$('body').removeClass('__loading');
	}

	var refresh = function(){
		setTimeout(function(){
			var $group = $('.pages .pages-group');
			if($group.length > 1){
				$group.not('.__current').addClass('__hidden');
			}
		}, 500);
	}

	function _on() {
		$('body').on.apply($('body'), arguments);
	}

	function _onClick(arg1, arg2){
		$('body').on('click,touchend', arg1, arg2);
	}

	var pages = (function(){
		return {
			show: function(){
				$('html').addClass('__pages-visible');
			},
			hide: function(){
				$('html').removeClass('__pages-visible');
			},
			toggle: function(){
				$('html').toggleClass('__pages-visible');
			}
		}
	})();

	_loading();

	_onClick('.pages-title', function(e){
		e.preventDefault();
		var isActive = $(this).closest('.pages-group').hasClass('__current');
		$('.pages-group').removeClass('__current').addClass('__hidden');
		if(!isActive){
			$(this).closest('.pages-group').addClass('__current').removeClass('__hidden');
		}
		$(window).trigger('resize');
	})

	_onClick('.pages-hide', function(e){
		e.preventDefault();
		pages.toggle();
	});

	_onClick('.pages-pin', function(e){
		e.preventDefault();
		$('html').toggleClass('__pages-attached');
		if($('html').hasClass('__pages-attached')){
			location.hash = 'pages-attached';
			$('.pages.js-ajax-disable .pages-item a').each(function(){
				var newHref = $(this).attr('href').split('#');
				newHref[newHref.length - 1] = 'pages-attached'
				$(this).attr('href', newHref.join('#'))
			})
		} else {
			location.hash = '';
			$('.pages.js-ajax-disable .pages-item a').each(function(){
				var newHref = $(this).attr('href').split('#');
				newHref[newHref.length - 1] = 'pages'
				$(this).attr('href', newHref.join('#'))
			})
		}
	});

	if(location.hash == '#pages-attached'){
		$('.pages.js-ajax-disable .pages-item a').each(function(){
			var newHref = $(this).attr('href').split('#');
			newHref[newHref.length - 1] = 'pages-attached'
			$(this).attr('href', newHref.join('#'))
		})
	} else {
		$('.pages.js-ajax-disable .pages-item a').each(function(){
			var newHref = $(this).attr('href').split('#');
			newHref[newHref.length - 1] = 'pages'
			$(this).attr('href', newHref.join('#'))
		})
	}

	var _onAllLoad = function($block, cb){
		var $images = $block.find('img');
		var count = $images.length;
		if(count < 1) {
			cb();
			return;
		}
		$images.one("load", function() {
			count--;
			if(count < 1){
				cb();
			}
		}).each(function() {
			if(this.complete){
				$(this).load();
			}
		});
	}

	var getBuffer = function(){
		var $buffer = $('.buffer');
		if($buffer.length < 1){
			$buffer = $('<div class="buffer"></div>').appendTo('body');
		}
		return $buffer;
	}

	_onClick('.pages:not(.js-ajax-disable) a[href]:not([href*="#"])', function(e){
		if(history.pushState == null) return;
		e.preventDefault();
		_loading();
		var url = this.href;
		history.pushState(null, null, url);
		$.get(url, function(data){
			data = data.split('<body>')[1];
			data = data.split('</body>')[0];
			data = $('<div></div>').html(data);

			_onAllLoad( getBuffer().html( data.find('.content').html() ) , function(){
				$('.content').empty().append( getBuffer().children() );
				$(window).trigger('resize');
				_loaded();
				refresh();
			});
		});
	});

	_onClick('.unfocus', function(e){e.preventDefault();});

	_onClick(function(e){
		if( $(e.target).closest('.pages').length > 0 ) return;
		pages.hide();
	});

	_onClick('.pages-head-selected', function(e){
		e.preventDefault();
		$('.pages-head-list').stop().fadeTo(300, 1);
		return;
	});

	_onClick('.pages-head-list a', function(e){
		e.preventDefault();
		$('.pages-head-list a').removeClass('__current');
		$(this).addClass('__current');
		$('.pages-head-list').stop().fadeOut(500);
		$('.pages-head-selected').html( $(this).text() );
		$('.pages-list').removeClass('__current').addClass('__hidden');
		$( $(this).attr('href') ).removeClass('__hidden').addClass('__current');
		return;
	});

	_on('mousemove', function(e){
		if($(e.target).closest('.pages').length > 0){
			pages.show();
			return;
		}
		if(e.pageX < 20) {
			pages.show();
		} else {
			pages.hide();
		}
	});

	$(window).on('load', function(){
		_loaded();
		refresh();
	});

	if(location.hash == '#pages-attached'){
		$('html').addClass('__pages-attached');
	} else if(location.hash != '#pages'){
		$('.pages').hide()
	}

	$(window).load(function(){
		$('.pages').addClass('__animation');
	})
});