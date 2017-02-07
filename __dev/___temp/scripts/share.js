(function(){
"use strict";
App.gui.add({
	_name: 'share',
	selector: '.js-share',
	build: function($el){
		$el.on('click.js-share', '.js-share-label', function(e){
			e.preventDefault();
			$el.toggleClass("__open")
		});
		var share;

		var _build = function(data){
			_destroy();
			if(data == null){
				data = {
					title: $('title').text() || '',
					description: $('meta[name="description"]').attr('content') || '',
					url: window.location.href
				}
			}
			share = Ya.share2($el.find('.js-share-links').get(0), {
				content: data,
				theme: {
					services: 'vkontakte,facebook,odnoklassniki,moimir,gplus,pinterest,twitter',
					/* services: 'vkontakte,facebook,odnoklassniki,moimir,gplus,pinterest,twitter,collections,blogger,delicious,digg,reddit,evernote,linkedin,lj,pocket,qzone,renren,sinaWeibo,surfingbird,tencentWeibo,tumblr,viber,whatsapp,skype,telegram', */
					counter: true,
					lang: 'ru',
					limit: 999
				}
			});
		}
		var _destroy = function(){
			if(share) share.destroy();
		}
		_build();
		$el.on('update-share.js-share', function(e, data){
			_build(data);
		});
		return {
			destroy: function(){
				$el.off('.js-share');
				_destroy();
			}
		}
	},
	destroy: function($el, methods){
		if(methods && typeof methods['destroy'] == 'function') methods['destroy']();
	}
})
})();