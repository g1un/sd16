_proto.open = function(arg1, arg2){
	this._parseMethodArguments([arg1, arg2], function(options, callback){
		this.$popup.appendTo( $('main') );//.on( this.getEventNamespace('click'), _.bind(this.clickSelfCloseHandler, this) );

		if( !options['$relativeTarget'] && options['relative'] && options['$clickTarget'] ){
			options['$relativeTarget'] = options['$clickTarget'];
		}
		if( options['$relativeTarget'] ){
			options.relative = true;
		}

		this.openOptions = options;

		this.setState('before-open');

		this[ (options.relative ? 'openRelative' : 'openAbsolute') ](options, function(){
			this.setState('opened');
			this.trigger('opened');
			callback.apply(this);
		});
	})
	return this;
}