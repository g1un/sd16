var createEvent = function(method, isTrigger){
	return ( method ? 'accordion-' + method : '' ) + ( isTrigger ? '' : '.accordion' )
}
var isOpen = function($el){ return $el.hasClass('__open'); }
var setOpen = function($el){ return $el.addClass('__open'); }
var unsetOpen = function($el){ return $el.removeClass('__open'); }

App.gui.add({
	_name: 'accordion',
	selector: '[data-accordion]',
	build: function($el){
		var group = $el.attr('data-accordion');
		var $head = $el.find('[data-accordion-head]');
		var $content = $el.find('[data-accordion-content]');

		$el.on(createEvent('activate'), function(e){
			if( isOpen($el) ) return;
			$('[data-accordion="' + group + '"]').not($el.get(0)).trigger( createEvent('deactivate', true) );
			setOpen($el);
			$content.stop().slideDown(300, function(){
				$el.trigger( createEvent('activated', true) )
			});
		});

		$el.on(createEvent('deactivate'), function(e){
			if( !isOpen($el) ) return;
			unsetOpen($el);
			$content.stop().slideUp(300, function(){
				$el.trigger( createEvent('deactivated', true) )
			});
		});

		$head.on('click' + createEvent(), function(e){
			e.preventDefault();
			if( isOpen($el) ){
				$el.trigger( createEvent('deactivate', true) );
			} else {
				$el.trigger( createEvent('activate', true) );
			}
		});

		return {
			destroy: function(){
				$head.off( createEvent() );
				$el.off( createEvent() );
			}
		}
	},
	destroy: function($el, methods) {
		if (methods && typeof methods['destroy'] === 'function') { methods['destroy'](); }
	}
})