App.run(function(){
	var _imageCheck = function(){
		var $img = $(this);
		var $parent = $img.parent();
		$img.attr('data-cover-image', '');
		if($parent.width() > $img.width() || $parent.height() > $img.height()){
			$img.attr('data-cover-image', 'not-fill');
		} else {
			$img.attr('data-cover-image', 'fill');
		}
	}
	var _handler = function(){
		$('img[data-cover-image]').each(_imageCheck)
	}

	App.onReady(_handler);
	App.onLoad(_handler);
	App.onResize(_.debounce(_handler, 0));

	App.gui.add({
		_name: 'cover-image',
		selector: 'img[data-cover-image]',
		build: function($img){
			$img.each(_imageCheck).one('load', _imageCheck);
		},
		destroy: function(){}
	});
});