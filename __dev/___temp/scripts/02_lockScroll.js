(function(){
"use strict";
App.lockScroll = (function(){
	var lastTop = null;
	var isLocked = false;
	var elements = [];

	return {
		onEnable: App.DoList(),
		onDisable: App.DoList(),
		onBeforeEnable: App.DoList(),
		onBeforeDisable: App.DoList(),
		setScrollPaddingForElement: function(el){
			elements.push( $(el) )
			return this;
		},
		enable: function(){
			if(isLocked) return this;
			if(this.onBeforeEnable() === false) return;
			isLocked = true;
			lastTop = $(window).scrollTop();
			$('.js-popup-margin').remove();
			var scrollWidth = $('body').width();
			$('<div class="js-popup-margin" style="height: 1px; width: 100%; display: block;"></div>').prependTo( $('body') ).show().css('margin-top', -(lastTop + 1));
			$('html').css({
				'overflow-y': 'scroll',
				'overflow-x': 'hidden',
				'height': '100%'
			});
			$('body').css({
				'overflow': 'hidden',
				'height': '100%'
			});
			scrollWidth = $('body').width() - scrollWidth;
			$('body').css({
				'padding-right': scrollWidth
			})
			_.each(elements, function($el){
				$el.css({
					'padding-right': scrollWidth
				})
			})
			this.onEnable([lastTop, scrollWidth]);
			return this;
		},
		disable: function(){
			if(!isLocked) return this;
			if(this.onBeforeDisable() === false) return;
			isLocked = false;
			$('html,body').css({
				'overflow': '',
				'height': '',
				'padding-right': ''
			});
			$('.js-popup-margin').remove();
			if(lastTop != null){
				$('html, body').scrollTop(lastTop);
				lastTop = null;
			}
			_.each(elements, function($el){
				$el.css({
					'padding-right': ''
				})
			})
			this.onDisable();
			return this;
		}
	}
})()
})();