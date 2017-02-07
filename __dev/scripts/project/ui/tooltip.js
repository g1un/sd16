App.gui.add({
	_name: 'tooltip',
	selector: 'main',
	build: function($el) {
		var _id = App.counter();
		var _defaults = {
			items: '[data-ui-tooltip]',
			show: 100,
			hide: 100,
			position: {
				my: "left bottom",
				at: "right top",
				using: function( position, feedback ) {
					$( this ).css( position ).attr('data-position', feedback.vertical + " " +feedback.horizontal)
					$( "<div>" )
						.addClass( "ui-tooltip-arrow" )
						.appendTo( this );
				}
			},
			content: function(){
				var $el = $(this);
				return $el.attr('data-ui-tooltip') || $el.attr('title') || $el.attr('data-title') || ''
			},
			open: function(e, ui) {
				$el.tooltip("instance").liveRegion.empty();
			}
		}
		$el.tooltip(_defaults);
		$el.on('ui-tooltip.changed.ui-tooltip-' + _id, function(e){
			$(e.target).trigger('mouseleave').trigger('mouseenter');;
		});
		return {
			destroy: function() {
				$el.tooltip("destroy");
				$el.off('.ui-tooltip-' + _id);
			}
		}
	},
	destroy: function($el, methods) {
		if (typeof methods['destroy'] !== 'function') {
			return;
		}
		methods['destroy']();
	}
})
