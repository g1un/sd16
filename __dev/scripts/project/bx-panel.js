var resize = function(){
	if( !$('#bx-panel').length ) return;
	$('.js-header').css('padding-top', $('#bx-panel').outerHeight());
}

App.onReady(function(){
	if( !$('#bx-panel').length ) return;
	resize();
	App.onResize(resize);

	$('#bx-panel').on('click', resize);
});