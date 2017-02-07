_proto.animation = function(method, options, callback){
	if(method != "open" && method != "close"){
		console.error( method, "need be 'open' or 'close'" );
		return;
	}

	this.setState( 'before-' + method + '-animation' );

	var isOpen = (method == "open");
	if( this.isOpen() == isOpen ){
		this.warning( "Already " + method + "ed: ", this );
		this.setState( 'fail-' + method + '-animation' );
		_.delay( _.bind(function(){
			this.setState( 'fail-' + method + '-animation' );
		}, this), 2)
		return;
	}

	this._isopen = isOpen;

	if(isOpen){
		this.trigger('opening');
	} else {
		this.trigger('closing');
	}

	this.$popup.stop();

	_.delay( _.bind(function(){
		this.animation[ method ].apply(this, [options, callback]);
	}, this), 1 );
	return this;
}

_proto.animation.handler = function(method, options, callback){
	this.setState( method + '-start' );

	var isOpen = (method == "open");
	var duration = isOpen ? this.options.durationOpen : this.options.durationClose;

	var _callback = _.bind(function(){
		this._isopen = isOpen;
		this.setState( method + '-end' );
		this.trigger('animation-' + method + '-end', true);
		callback.apply(this);
	}, this);

	this.trigger('animation-' + method + '-start', true);

	if(isOpen){
		this.$popup.fadeTo(duration, 1, _callback);
	} else {
		this.$popup.fadeOut(duration, _callback);
	}
}

_proto.animation.open = function(options, callback){
	this.animation.handler.apply(this, ["open", options, callback]);
	return this;
}
_proto.animation.close = function(options, callback){
	this.animation.handler.apply(this, ["close", options, callback]);
	return this;
}