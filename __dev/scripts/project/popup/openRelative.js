_proto.openRelative = function(options, callback){
	this.$popup.addClass('__relative');
	this.refreshSize(true);
	this.calcRelativePosition();
	this.animation('open', options, callback);
}