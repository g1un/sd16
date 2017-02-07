App.onLiveClick('.js-about-item-inner', function(e){
	e.preventDefault();
	var $this = $(this).toggleClass('__open').trigger('resize');
	if($this.hasClass('__open')){
		$this.css('min-height', $this.find('.about-item-content').outerHeight());
	} else {
		$this.css('min-height', '');
	}
})