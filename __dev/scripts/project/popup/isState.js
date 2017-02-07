_proto.isState = function(needState){
	return ( this.getState() === this.STATES[needState.toLowerCase()] )
}