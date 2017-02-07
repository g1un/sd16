_proto.bindDelegation = function(method, args){
	var methods = ["on", "off", "one"];
	if( _.indexOf(methods, method) == -1 ){ throw new Error('method need be: ' + methods.join(' ')); }

	var eventName = '';
	var params = {local: true}
	var handler = undefined;
	switch(args.length){
		case 1:
			eventName = args[0];
		break;
		case 2:
			eventName = args[0];
			handler = args[1];
		break;
		case 3:
			eventName = args[0];
			params = _.defaultsDeep(args[1], params);
			handler = args[2];
		break;
	}
	var needHandler = ["on", "one"]

	if(_.indexOf(needHandler, method) !== -1 && !_.isFunction(handler)){
		throw new Error('handler not a function');
	}

	var _event = eventName || '';

	if( _event.indexOf(' ') > -1 ){
		_event = _event.split(' ');
	} else {
		_event = [_event];
	}

	if(params['local']){
		var _this = this;
		_.each(_event, function(ev, index, arr){
			arr[index] += '.popupid' + _this.id;
		})
	}

	_event = _event.join(' ');

	if(handler){
		handler = _.bind(handler, this);
	}

	this.info('[' + method.toUpperCase() + ']', _event, params);

	( params['global'] ? $('html') : this.$popup )[method](_event, handler);
}