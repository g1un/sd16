'use strict';
var path = require('path');

module.exports = function(config, mainPath, $){
	var helper = function(folder){
		return function(){
			var args = Array.prototype.slice.call(arguments);
			args.unshift($.usePath(folder));
			return $.getPath.apply($, args);
		}
	}
	var dev = helper('dev');
	var web = helper('web');
	var template = helper('template');
	var styles = helper('styles');
	var stylus = helper('stylus');
	var scripts = helper('scripts');
	var views = helper('views');
	var images = helper('images');
	var temp = helper('temp');

	config.variablesName = 'VARS';

	config.paths = {};

	config.paths['__gulp'] = mainPath;
	config.paths['__dirname'] = path.join(mainPath, '../');

	config.paths['dev'] = $.getPath('__dev');

	config.paths['web'] = $.getPath('web');
	config.paths['template'] = web('template');

	config.paths['styles'] = dev('styles');
	config.paths['stylus'] = styles('stylus');

	config.paths['scripts'] = dev('scripts');

	config.paths['views'] = dev('views');

	config.paths['temp'] = dev('___temp');
	
	config.paths['tasks'] = path.join(mainPath, 'tasks');

	config.paths['images'] = dev('images');
	config.paths['temp'] = dev('___temp');


	config['dictionary'] = dev('dictionary.json');


	config['copy-index'] = {
		from: dev('_index'),
		to:  web('_index')
	};
	config['libs'] = {
		from: dev('libs'),
		to:  template('libs')
	};
	config['baseStyle'] = {
		from: styles('base'),
		to:  template('styles')
	};
	config['baseScript'] = {
		from: scripts('base'),
		to:  template('scripts')
	};
	config['jsondata'] = {
		from: dev('views', 'data'),
		to:  web('data')
	};
	// config['images'] = {
	// 	from: images(),
	// 	to:  template('images')
	// }
	config['images'] = {
		from: images('**', '*'),
		to:  template('images')
	};

	config['popups'] = {
		path: views('modules', 'pops'),
		file: views('modules', 'pops.jade'),
		jadePath: 'pops/'
	};

	config['coffee'] = {
		from: [
			scripts('coffee', 'base', '*.coffee'),
			scripts('coffee', 'project', '*.coffee')
		],
		to: template('scripts')
	}

	config['scripts'] = {
		from: [
			scripts('project', '*.js'),
			'!' + scripts('project', '_*.js')
		],
		to: template('scripts'),
		triggerJade: dev('___temp/triggerJade.txt'),
		temp: temp('scripts')
	}

	config['scripts-modules'] = {
		from: scripts('project'),
		to: template('scripts')
	}

	config['script-vendors'] = {
		from: [
			scripts('vendors', '*.js')
		],
		to: template('libs')
	}

	config['style-vendors'] = {
		from: [
			styles('vendors', '*.css')
		],
		to: template('styles')
	}

	config['stylus-base'] = {
		from: [
			stylus('global', '*.styl'),
			stylus('base', '*.styl'),
			stylus('base', '**', '*.styl')
		],
		to: styles('vendors')
	}

	config['stylus'] = {
		from: [
			stylus('global', '*.styl'),
			'!' + stylus('base', '*.styl'),
			'!' + stylus('base', '**', '*.styl'),
			stylus('*.styl'),
			stylus('**', '*.styl')
		],
		to: template()
	}

	config['index'] = {
		from: dev('_index', 'index.jade'),
		to: web()
	}

	config['jade'] = {
		from: views(),
		to: web(),
		variables: views('variables')
	}

	config['jade-mixins'] = {
		base: views('modules/mixins/base'),
		project: views('modules/mixins/project'),
		mixinFile: views('modules/__mixins.jade'),
		mixinPath: '../modules/mixins/'
	}

	config['jsdoc'] = {
		from: [
			template('scripts', '*.js')
		],
		to: web(),
		template: path.join(mainPath, 'jsdoc-template.ejs'),
		scripts: template('scripts')
	}

	config['watch'] = $.watch()

	config['sprites'] = {
		from: images('sprites', '*.*'),
		imageTo: template('images', 'sprites'),
		cssName: '00_sprite.styl',
		stylusTo: stylus('global'),
		template: path.join(mainPath, 'sprites.template.mustache'),
		fileName: '__sprite.png',
		pathImage: path.relative(config['stylus'].to, template('images', 'sprites', '__sprite.png'))
	}

	config['sprites-icons'] = {
		from: images('icons', '*.*'),
		imageTo: template('images', 'icons'),
		cssName: '00_icons.styl',
		stylusTo: stylus('global'),
		// template: function(data){
		// 	var result = '';
		// 	result += '$iconsCount = ' + data.items.length;
		// 	result += '\r\n';
		// 	result += '$$icons = {'

		// 	for(var i = 0, _len = data.items.length; i < _len; i++){
		// 		var item = data.items[i]
		// 		result += item.name + ': '
		// 		result += item.px.x + ' '
		// 		result += item.px.y + ' '
		// 		result += item.px.offset_x + ' '
		// 		result += item.px.offset_y + ' '
		// 		result += item.px.width + ' '
		// 		result += item.px.height + ' '
		// 		result += item.px.total_width + ' '
		// 		result += item.px.total_height + ' '
		// 		result += item.px.x + ' '

		// 		':'
		// 		'{{name}}': {{px.x}} {{px.y}} {{px.offset_x}} {{px.offset_y}} {{px.width}} {{px.height}} {{px.total_width}} {{px.total_height}} '{{{escaped_image}}}' '{{source_image}}'
		// 	}

		// 	return += '}'

		// 	return result;
		// },
		template: path.join(mainPath, 'icons-sprites.template.mustache'),
		fileName: '__sprite.png',
		pathImage: path.relative(config['stylus'].to, template('images', 'icons', '__sprite.png'))
	}

	config['watch']
		.use(function(){
			$.runSequence('copy: libs', $.reload())
		})
			.for(dev('libs', '*'))
			.for(dev('libs', '**'))

		.use(function(){
			$.runSequence('copy: json-data', $.reload())
		})
			.for(dev('views', 'data', '*.json'))

		.use(function(){
			$.runSequence('copy: index', $.reload())
		})
			.for(dev('_index', '*'))
			.notFor(dev('_index', 'index.jade'))

		.use(function(){
			$.runSequence('jade: build', 'index', $.reload())
		})
			.for(dev('___temp/triggerJade.txt'))
			.for(views('*.jade'))
			.for(views('**', '*.jade'))
			.notFor(views('modules', 'pops', '*.jade'))

		.use(function(){
			$.runSequence('index')
		})
			.for(dev('_index', 'index.jade'))

		.use(function(){
			$.runSequence('stylus: build', $.reload("template_styles.css"))
		})
			.for(stylus('global', '*.styl'))
			.notFor(stylus('base', '*.styl'))
			.notFor(stylus('base', '*', '*.styl'))
			.for(stylus('*.styl'))
			.for(stylus('**', '*.styl'))
			.for(stylus('**', '**', '*.styl'))
			.for(stylus('**', '**', '**', '*.styl'))
			.notFor(stylus('00_production.styl'))
		
		.use(function(){
			$.runSequence('script: concat-vendors', $.reload())
		})
			.for(scripts('vendors', '*.js'))

		.use(function(){
			$.runSequence('script: build', 'jsdoc: build', $.reload())
		})
			.for(scripts('project', '*.js'))
			.notFor(scripts('project', '_*.js'))


		.use(function(){
			$.runSequence('script: build-module', 'jsdoc: build', $.reload())
		})
			.for(scripts('project', '**', '*.js'))
			.notFor(scripts('project', '**', '_*.js'))

		// .use(function(){
		// 	$.runSequence('coffee: build', $.reload())
		// })
		// 	.for(scripts('coffee', '*.coffee'))
		// 	.for(scripts('coffee', 'base', '*.coffee'))
		// 	.for(scripts('coffee', 'base', '**', '*.coffee'))
		// 	.for(scripts('coffee','project', '*.coffee'))
		// 	.for(scripts('coffee','project', '**', '*.coffee'))
		// 	.for(scripts('coffee','project', '**', '**', '*.coffee'))

		.use(function(){
			$.runSequence('style: concat-vendors', $.reload("vendors.css"))
		})
			.for(styles('vendors', '*.css'))


		.use(function(){
			$.runSequence('stylus: build-base', $.reload("vendors.css"))
		})
			.for(stylus('global', '*.styl'))
			.for(stylus('base', '*.styl'))
			.for(stylus('base', '**', '*.styl'))
			.for(stylus('base', '**', '**', '*.styl'))

		.use(function(){
			$.runSequence('index', $.reload())
		})
			.for(config['dictionary'])

		.use(function(){
			$.runSequence('jade: popups', 'jade: build', $.reload())
		})
			.for(views('modules', 'pops', '*.jade'))

		.use(function(){
			$.runSequence('jade: concat-mixins')
		})
			.for(views('modules', 'mixins', 'base', '*.jade'))
			.for(views('modules', 'mixins', 'project', '*.jade'))




		.use($.once(1000, function(){
			// $.runSequence('copy: images');
			$.runSequence('image: min');
		}))
			.for(images('*.*'))
			.for(images('**', '*.*'))
			.for(images('**', '**', '*.*'))
			.notFor( config['sprites'].from )
			.notFor( config['sprites-icons'].from )

		.use(function(){
			$.runSequence('copy: base-css', $.reload())
		})
			.for(styles('base', '*.*'))
			.for(styles('base', '**', '*.*'))
			.for(styles('base', '**', '**', '*.*'))

		.use(function(){
			// $.runSequence('copy: images', 'sprite: build');
			$.runSequence('image: min', 'sprite: build-sprites');
		})
			.for( config['sprites'].from )

		.use(function(){
			// $.runSequence('copy: images', 'sprite: build');
			$.runSequence('image: min', 'sprite: build-sprites-icons');
		})
			.for( config['sprites-icons'].from )


		.use(function(){
			$.getVariables(true);
			$.runSequence('stylus: build-base', 'stylus: build', 'script: build-module', 'script: build', 'jade: popups', 'jade: build', $.reload());
		})
			.for( dev('_variables', '*.json') )

	return config;
}