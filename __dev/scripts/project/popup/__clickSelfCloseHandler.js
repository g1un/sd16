_proto.clickSelfCloseHandler = function(e){
	if( !$(e.target).is(this.$popup.get(0)) ) return;
	this.close();
}