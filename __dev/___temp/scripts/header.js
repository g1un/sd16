(function(){
"use strict";
App.onScroll(function(scrollPos){
	$('html')[ scrollPos.top > 50 ? 'addClass' : 'removeClass' ]('__scrolled');
});


App.run(function(){
	var hideListen = function(){
		$('html').off('.headerhidelisten').one('click.headerhidelisten', function(e){
			if( $(e.target).closest('.js-header,.js-header-nav-wrapper-content').length ){
				console.log('exist');
				return hideListen();
			}
			$('html').removeClass('__header-nav');
			App.blackout.hide();
		})
	}
	App.onClick('.js-header-nav-button', function(e){
		e.preventDefault();
		$('html').toggleClass('__header-nav');
		if( $('html').hasClass('__header-nav') ){
			App.blackout.show();
			hideListen();
		} else {
			App.blackout.hide();
		}
	});
})


App.run(function(){
	var multiCall = function(funcs, method){ _.each(funcs, function(func){ func[method](); }); }
	var $main;

	var $headerNav;
	var movableHeaderNav;

	var $header;

	var $headerNavWrapperContent;

	var $headerPhoneNumber;
	var movableHeaderPhoneNumber;

	var $headerGlavstr;
	var movableHeaderGlavstr;

	var $navButton;

	var init = function(){
		$main = $('main');

		$headerNav = $('.js-header-nav-wrapper');
		movableHeaderNav = App.movableContent($headerNav);

		$header = $('.js-header');

		$headerNavWrapperContent = $('.js-header-nav-wrapper-content');

		$headerPhoneNumber = $('.js-header-phone-number');
		movableHeaderPhoneNumber = App.movableContent( $headerPhoneNumber );

		$headerGlavstr = $('.js-header-glavstr');
		movableHeaderGlavstr = App.movableContent( $headerGlavstr );

		$navButton = $('.js-header-nav-button').clone();

		init = function(){};
	}


	// var setNotDesktop = function(){
	// 	init();
	// 	movableHeaderNav.restore();
	// }
	// var setDesktop = function(){
	// 	init();
	// 	movableHeaderNav.eject();
	// 	$main.append( $headerNav );
	// }

	var setTablet = function(){
		init();


		movableHeaderNav.eject();
		$main.append( $headerNav );

		multiCall( [movableHeaderPhoneNumber, movableHeaderGlavstr], 'eject' );			
		$headerNavWrapperContent.append( $headerPhoneNumber );
		$headerNavWrapperContent.append( $headerGlavstr );
	}

	var setNotTablet = function(){
		init();

		movableHeaderNav.restore();

		multiCall( [movableHeaderPhoneNumber, movableHeaderGlavstr], 'restore' );
	}

	var setPhone = function(){
		init();
		$headerNavWrapperContent.append( $navButton );
	}

	var setNotPhone = function(){
		init();
		$navButton.remove();
	}


	// App.MEDIA.onMax('DESKTOP', setDesktop, setNotDesktop);
	App.MEDIA.onMax('TABLET', setTablet, setNotTablet);
	App.MEDIA.onMax('PHONE', setPhone, setNotPhone);
});
})();