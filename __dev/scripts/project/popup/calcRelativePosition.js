_proto.calcRelativePosition = function(){
	var wasVisible = this.$popup.is(':visible');
	var hasClass = this.$popup.hasClass('__relative');
	if(!wasVisible){
		this.$popup.show();
	}

	if(!hasClass){
		this.$popup.addClass('__relative');
	}

	this.$popup.css({
		left: '',
		top: ''
	});

	var popupSize = { width: this.$popup.outerWidth(), height: this.$popup.outerHeight() }
	var windowSize = { width: $(window).width(), height: $(window).height() }

	var targetOffset = this.openOptions.$relativeTarget.offset();
	var targetSize = { width: this.openOptions.$relativeTarget.outerWidth(), height: this.openOptions.$relativeTarget.outerHeight() }

	var position = {
		top: targetOffset.top - popupSize.height,
		left: targetOffset.left
	}

	var fromTop = true;
	var fromLeft = true;

	if(position.top < 0){
		position.top = targetOffset.top + targetSize.height;
		fromTop = false;
	}

	if(position.left + popupSize.width > windowSize.width){
		position.left = targetOffset.left - ( popupSize.width - targetSize.width );
		fromLeft = false;
	}

	if(position.left < 0){
		position.left = 0;
	}

	this.$popup.css(position);

	if(!wasVisible){
		this.$popup.hide();
	}
	if(!hasClass){
		this.$popup.removeClass('__relative');
	}

	this.$popup.attr('data-relative-position', ( fromLeft ? 'left' : 'right' ) + ' ' + ( fromTop ? 'top' : 'bottom' ) )
	return this;
}