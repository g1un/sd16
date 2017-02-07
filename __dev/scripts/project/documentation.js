App.gui.add({
	_name: 'documentation-height',
	selector: '.js-documentation',
	build: function($el){
		var $contentHeight = $el.find('.js-documentation-content-height');
		var getContentHeight = function(){ return parseInt($contentHeight.css('z-index')) || 0; }

		var $list = $el.find('.js-documentation-list')
		var $items = $list.find('.js-documents')


		var refreshHeight = function(){
			var height = getContentHeight();
			$items.each(function(){
				var $this = $(this);
				var $content = $this.find('.js-documents-content')
				var contentOffsetTop = $content.offset().top;
				var hasHidden = false;
				$this.removeClass('__hasHidden');
				$content
					.children().each(function(){
						var $item = $(this);
						$item.removeClass('_hidden');
						var itemOffsetTop = $item.offset().top;
						var itemHeight = $item.outerHeight();
						if( (itemOffsetTop - contentOffsetTop) + itemHeight > height ){
							$item.addClass('_hidden');
							hasHidden = true;
						}
					})
				if( hasHidden ){
					$this.addClass('__hasHidden');
				}
			});
		}

		$el.on('click.js-documentation', '.js-documents-more-button', function(e){
			e.preventDefault();
			var $item = $(this).closest('.__hasHidden')
			if( $item.hasClass('__open') || $item.hasClass('__accordion-open') ){
				$item.removeClass('__open').removeClass('__accordion-open');
			} else {
				$item.addClass('__open')
			}
		});

		$el.on('accordion-activate.js-documentation accordion-deactivated.js-documentation', function(e){
			if( $el.find('.accordion.__open').length ){
				$(e.target).closest('.__hasHidden').addClass('__accordion-open');
			} else {
				$(e.target).closest('.__hasHidden').removeClass('__accordion-open');
				refreshHeight();
			}
		});

		refreshHeight();

		var resizeHandlerId = App.onResize(refreshHeight);

		return {
			destroy: function(){
				App.onResize.remove(resizeHandlerId);
				$el.off('.js-documentation');
			}
		}
	},
	destroy: function($el, methods){
		if(methods && typeof methods['destroy'] == 'function') methods['destroy']();
	}
})