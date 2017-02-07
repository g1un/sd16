_proto.setState = function(newStatus){
	var statusKey = this.STATES[newStatus.toLowerCase()];
	if(statusKey){
		this.info('[STATE]', '[' + statusKey + '] ' + newStatus);
		this.state = statusKey;
		return statusKey
	} else {
		this.info('[STATE]')
	}
	return;
}