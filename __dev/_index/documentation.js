// var openItem = function($item, toggle){
// 	var opened = $item.hasClass('__open');
// 	$('.doc-item-file.__open').removeClass('__open');
// 	if(!opened || toggle === false){
// 		$item.addClass('__open')
// 	}
// }

// $('.doc-item-file-title').on('click', function(e){
// 	e.preventDefault();
// 	openItem($(this).closest('.doc-item-file'));
// })

var $nav = $('<div class="nav"></div>').insertBefore('#content');

Object.keys(doccontents).forEach(function(namespace){
	var $namespace = $('<div class="nav-item-namespace"></div>');

	$('<div class="nav-item __title"><a href="#' + namespace + '" class="nav-item-link">' + namespace + '.js</a></div>').appendTo( $namespace );


	doccontents[namespace].forEach(function(item){

		$('<div class="nav-item"><a href="#' + item.target + '" class="nav-item-link">' + item.name + '</a></div>').appendTo( $namespace );
	})
	
	$nav.append( $namespace );
})


// $('.nav-item-link').on('click', function(){
// 	openItem( $($(this).attr('href')).closest('.doc-item-file'), false );
// });