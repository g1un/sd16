var _resizeTimeout;

var update = function(){
	$('html').trigger('reset-height');
	$('[data-uniformheight]').each(function(){
		App.uniformHeight( $(this), $(this).attr('data-uniformheight') );
	});
	$('html').trigger('uniformheight-resized');
}

App.onResize(function(){
	clearTimeout(_resizeTimeout);
	_resizeTimeout = setTimeout(function(){
		update();
	}, 1);
})