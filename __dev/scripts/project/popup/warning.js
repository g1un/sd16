_proto.warning = function(){
	var args = [];

	for(var i = 0, _len = arguments.length; i < _len; i++){
		args.push(arguments[i]);
	}

	this.debug('warning', args);
}