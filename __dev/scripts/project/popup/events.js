_proto.events = function(){
	this.off();

	this.on(this.getEventName('opening'), function(){
		this.off('mousedown touchstart mouseup touchend', {global: true}, null)
		this.on('mousedown touchstart', {global: true}, function(e){
			var isRelative = this.isRelative();

			if( isRelative ){
				if( $( e.target ).closest( this.$popup.get(0) ).length > 0 ) return;
			} else {
				if( !$( e.target ).is( this.$popup.get(0) ) ) return;
			}

			this.one('mouseup touchend', {global: true}, function(e){
				if(isRelative){
					if( $( e.target ).closest( this.$popup.get(0) ).length > 0 ) return;
				} else {
					if( !$( e.target ).is( this.$popup.get(0) ) ) return;
				}
				this.setState('before-close');
				_.delay( _.bind(function(){

					if( this.isState('before-close')){
						this.close();
					}
				}, this), 5);
			})
		})
	});

	this.on(this.getEventName('closed'), function(){
		if(this.request){
			this.request.abort();
			delete this.request;
		}
	});

	// this.on(this.getEventName('closed'), function(){
	// 	this.off();
	// 	this.off(null, {global: true}, null);
	// })
}