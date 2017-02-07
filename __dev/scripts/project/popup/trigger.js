_proto.trigger = function(eventName, forse){
	var _handler = _.bind(function(){
		this.info('[EVENT]', eventName);
		this.$popup.trigger( this.getEventName(eventName), this );
	}, this);


	if( forse ){
		_handler();
	} else {
		_.delay( _handler, 10 );
	}
	return this;
}