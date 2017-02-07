_proto.setContent = function(html){
	this.getContent().html(html);
	this.refreshSize(true);
	if(this.isRelative()){
		this.calcRelativePosition();
	}
	return this;
}