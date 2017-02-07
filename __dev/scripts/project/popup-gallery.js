// var getLinkImageSize = function($el, callback){
// 	if(typeof callback != 'function') callback = function(){};

// 	if( $el.hasAttr('data-image-size') ){
// 		var size = $el.attr('data-image-size').split('x');
// 		callback(parseInt(size[0]), parseInt(size[1]));
// 	}
// 	_.delay(function(){
// 		App.loadImage($el.attr('href'), function(){
// 			var image = this;
// 			$el.attr('data-image-size', this.width + 'x' + this.height);
// 			callback(this.width, this.height);
// 		})
// 	}, 10)
// }

// App.onReady(function(){
// 	$('a[href][data-gallery]').eachThrowTo(getLinkImageSize);

// 	$('.js-gallery img').throwTo( App.imageAspectRatio );
// });

// $('html').on('click', 'a[href][data-gallery]', function(e){
// 	e.preventDefault();
// 	var $this = $(this);

// 	var group = $this.attr('data-gallery');
// 	var currentIndex = 0;

// 	var asyncHandler = false;
// 	var wait = 0;

// 	var items = $('a[href][data-gallery="' + group + '"]').map(function(index){
// 		var _$this = $(this);
// 		var url = _$this.attr('href');

// 		if( _$this.is($this) ){
// 			currentIndex = index;
// 		}

// 		var self = {
// 			src: url
// 		}

// 		if(_$this.hasAttr('title')){
// 			self.title = _$this.attr('title');
// 		}
// 		if(_$this.hasAttr('data-description')){
// 			var descr = _$this.attr('data-description');
// 			if(descr[0] == '@'){
// 				descr = descr.replace('@', '');
// 				self.title = $(descr).html() || undefined;
// 			} else {
// 				self.title = descr;
// 			}
// 		}

// 		wait++;
// 		getLinkImageSize(_$this, function(width, height){
// 			wait--;
// 			self.w = width;
// 			self.h = height;
// 			if(wait <= 0 && typeof asyncHandler == 'function'){
// 				asyncHandler();
// 			}
// 		})
// 		return self;
// 	});

// 	var _handler = function(){
// 		var pswpElement = $('.pswp').get(0);
// 		var options = {
// 			// optionName: 'option value'
// 			// for example:
// 			index: currentIndex // start at first slide
// 		};
// 		// Initializes and opens PhotoSwipe
// 		var gallery = new PhotoSwipe( pswpElement, PhotoSwipeUI_Default, items, options);
// 		gallery.init();
// 	}
// 	if(wait > 0){
// 		asyncHandler = _handler;
// 	} else {
// 		console.log('_handler')
// 		_handler();
// 	}
// })


App.onReady(function(){
	lightbox.option({
		albumLabel: "Изображение %1 из %2",
		alwaysShowNavOnTouchDevices: false,
		disableScrolling: false,
		fadeDuration: 500,
		fitImagesInViewport: true,
		positionFromTop: 100,
		resizeDuration: 700,
		showImageNumberLabel: true,
		wrapAround: false,
	})
	if( $('#lightbox').length == 0 ){
		lightbox.init();
	}
})