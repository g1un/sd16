_proto.refreshSize = function(forse){
	if( !forse && !this.$popup.is(':visible') ) return;

	var wasVisible = this.$popup.is(':visible');

	if(!wasVisible) this.$popup.show();

	var $box = this.$popup.find('.popup-box')
	.css({
		'right': 'auto',
		'bottom': 'auto',
		'top': '0',
		'left': '0',
		'width': '',
		'height': ''
	})


	$box.css({
		'right': '',
		'bottom': '',
		'top': '',
		'left': '',
		'width': $box.outerWidth() + 1,
		'height': $box.outerHeight() + 1
	})

	if(!wasVisible) this.$popup.hide();
}