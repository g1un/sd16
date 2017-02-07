App.onReady(function(){
	if(App.isFrontDev){
		App.popup.setOptions({enableLogging: true});
	}	
})

App.onMEDIAReady = function(){
	if(App.isFrontDev){
		App.MEDIA.logging = true;
	}
}

$('html').on('popup-opening', function(e){
	if( App.popup.getVisible().filter(':not(.__relative)').length > 0 ){
		App.lockScroll.enable();
	}
	App.gui.refresh( $(e.target) );
})
$('html').on('popup-closed', function(){
	if( App.popup.getVisible().filter(':not(.__relative)').length == 0 ){
		App.lockScroll.disable();
	}
})

App.onClick('[data-scrollto]', function(e){
	e.preventDefault();
	var target = $(this).attr('data-scrollto');
	var top = 0;
	if( ((top = parseFloat(target)) + '') !=  target ){
		if( (target = $(target)).length == 1 ){
			top = target.offset().top;
		} else {
			top = false;
		}
	}

	if(top === false) return;
	App.scrollTo( top, $('.js-header').outerHeight(true) );
});

App.onReady(function(){
	if( !App.isIOS() ) return;
	$('html').on('focus', 'input, textarea', function(){
		_.delay(function(){
			$('html').addClass('__input-focus');
		}, 10);
	});
	$('html').on('blur', 'input, textarea', function(){
		$('html').removeClass('__input-focus');
	});
})

App.onResize(function(){
	$('body').css({
		'padding-bottom': $('.js-footer').outerHeight(true)
	})
	$('body').css({
		'padding-top': $('.js-header').outerHeight(true)
	})
});


if( window['BX'] && typeof BX.addCustomEvent == 'function' ){
	BX.addCustomEvent('onAjaxSuccess', function(){ App.onChangeDOM(); });
}

$('html').on('gui-event', function(e, guiEventName){
	var needEvent = ["builded", "refreshed"];
	if( _.indexOf(needEvent, guiEventName) == -1 ){ return; }
	App.onLiveClick.refresh();
});


App.run(function(){
	var $blackout;
	var _timeout;

	var trigger = function(eventName){
		var event = jQuery.Event( "blackout-" + eventName );
		$blackout.trigger(event);
		return event.isDefaultPrevented();
	}

	App.blackout = {
		show: function(blackoutName){
			if(trigger('before-show')) return this;
			trigger('show');
			if(_timeout){ clearTimeout(_timeout); }
			if( blackoutName ){
				$blackout.attr('data-blackout-name', blackoutName);
				$('html').attr('data-blackout', blackoutName);
			} else {
				$blackout.removeAttr('data-blackout-name');
				$('html').attr('data-blackout', '');
			}
			$blackout.addClass('__show');
			trigger('shown');
			return this;
		},
		hide: function(){
			if(trigger('before-hide')) return this;
			trigger('hide');
			if(_timeout){ clearTimeout(_timeout); }
			$blackout.removeClass('__show');
			_timeout = setTimeout(function(){ $blackout.removeAttr('data-blackout-name'); $('html').removeAttr('data-blackout'); trigger('hidden'); }, 300);
			return this;
		},
		on: function(eventName, callback){
			$blackout.on('blackout-' + eventName, callback);
			return this;
		},
		one: function(eventName, callback){
			$blackout.one('blackout-' + eventName, callback);
			return this;
		},
	}

	App.onReady(function(){
		$blackout = $('.blackout');
		if($blackout.length < 1){
			$blackout = $('<div class="blackout"></div>');
			$('main').append($blackout);	
		}
		$blackout.on('click', function(){
			if( trigger('click') ) return;
			App.blackout.hide();
		});
	});
});


App.movableContent = App.run(function(){
	var createPlaceId = (function(){
		var keys = [];
		var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
		var keyLength = 16;
		var getKey = function(){
			var key = "";
			var index;
			for(var i = 0; i < keyLength; i++){
				index = Math.round(Math.random()*(chars.length - 1));
				if(index > (chars.length-1)) index = (chars.length-1);
				key += chars[index];
			}
			return key;
		}
		return function(){
			var key;
			do { key = getKey(); } while ( _.indexOf( keys, key ) !== -1 );
			return key;
		}
	})();

	var ejectContent = function($content){
		if( $content.length < 1 ) return;
		if( $content.length > 1 ){ return $content.each(function(){ ejectContent( $(this) ); }); }
		var placeid = createPlaceId();
		var $place = $('<div/>', {
			css: {
				display: 'none'
			},
			'data-movable-content-place': placeid
		});
		$content.attr('data-movable-content-target-place', placeid);
		$place.insertAfter( $content );

		$content.attr('data-movable--old-style', $content.attr('style'));
		$content.detach();
		$content.removeAttr('style');

		return $content;
	}

	var restoreContent = function($content){
		if( $content.length < 1 ) return;
		if( $content.length > 1 ){ return $content.each(function(){ restoreContent( $(this) ); }); }
		var placeid = $content.attr('data-movable-content-target-place');
		if(!placeid) return $content;
		var $place = $('[data-movable-content-place="' + placeid + '"]');
		if(!$place.length) return $content;

		$content.insertAfter( $place );
		$content.removeAttr('data-movable-content-target-place');
		$place.remove();

		$content.attr('style', $content.attr('data-movable--old-style'));
		$content.removeAttr('data-movable--old-style');

		return $content;
	}

	return function($el){
		return {
			restore: function(){
				restoreContent($el);
			},
			eject: function(){
				ejectContent($el);
			}
		}
	}
});