_proto.debug = function(){
	if( !this.options.enableLogging ) return this;
	var type = 'debug';
	var args = ['[Popup]', '[' + this.id + ']' + '[' + this.getName() + ']'];

	var enableTypes = {
		'log': 'log',
		'warning': 'warn',
		'debug': 'debug',
		'error': 'error',
		'info': 'info'
	}

	var checkArg = function(arg){
		if(arg == null) return;
		if(_.isString(arg)){
			args.push(arg);
		} else if(_.isArray(arg)) {
			_.each(arg, function(item){ checkArg(item); });
		} else {
			args.push(arg);
		}
	}

	switch(arguments.length){
		case 1:
			if( _.isArray( arguments[0] ) ){
				_.each(arguments[0], function(arg){ args.push(arg) })
			} else {
				args.push(arguments[0]);
			}
		break;
		case 2:
			type = arguments[0];
			checkArg(arguments[1]);
		break;
	}

	if( !enableTypes[type] ) type = 'debug';

	console[ enableTypes[type] ].apply(console, args);

	this.$popup.trigger('popup-debug', {
		type: type,
		args: args,
		popup: this
	})
	return this;
}