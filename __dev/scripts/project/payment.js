App.gui.add({
	_name: 'payment-content',
	selector: '.js-payment-content',
	build: function($el){
		$el.on('refresh-height.js-payment-content', function(){
			App.uniformHeight( $(this), '.js-payment-aside-content-inner,.js-payment-aside-block-inner' );
		}).trigger('refresh-height');

		return {
			destroy: function(){
				$el.off('refresh-height.js-payment-content');
			}
		}
	},
	destroy: function($el, methods){
		if(methods && typeof methods['destroy'] == 'function'){
			methods['destroy']();
		}
	}
});

App.onResize(function(){ $('.js-payment-content').trigger('refresh-height'); });

App.onLiveClick('.js-payment-table-toggle', function(e){
	e.preventDefault();
	$('.js-payment-table-toggle').not(this).each(function(){ $(this).parent().removeClass('__open'); });
	$(this).parent().toggleClass('__open');
});

// App.onReady(function(){
// 	$('.js-payment-content').on('refresh-height', function(){
// 		App.uniformHeight( $(this), '.js-payment-aside-content-inner,.js-payment-aside-block-inner' );
// 	}).trigger('refresh-height');

// 	App.onResize(function(){ $('.js-payment-content').trigger('refresh-height'); });
// });