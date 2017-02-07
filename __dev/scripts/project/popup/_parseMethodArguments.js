_proto._parseMethodArguments = function(args, handler){
	var callback = _.noop;
	var options = {};
	for(var i = 0; i < 2; i++){
		if(args[i] != null){
			if( typeof args[i] == 'function' ){
				callback = args[i];
			} else if( typeof args[i] == 'object' ){
				options = args[i];
			}
		}
	}

	handler.apply(this, [options, callback]);
	return this;
}