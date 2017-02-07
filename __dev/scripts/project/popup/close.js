_proto.close = function(arg1, arg2){
	this._parseMethodArguments([arg1, arg2], function(options, callback){
		this.$popup.off( this.getEventNamespace('click') );
		this.closeOptions = options;
		this.setState('closing');

		this.animation('close', options, function(){
			this.$popup.css({
				left: '',
				top: ''
			}).removeClass('__relative').removeAttr('data-relative-position');

			this.setState('closed');
			this.trigger('closed', true);

			callback.apply(this);
		});
	})
}