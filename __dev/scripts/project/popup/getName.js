_proto.getName = function(){
	if(this._name){
		return this._name;
	}

	var _name = 'unknown';

	if(this.$popup.hasAttr('data-popup-name'))
		_name = this.$popup.attr('data-popup-name')
	else
		if(this.$popup.attr('id'))
			_name = this.$popup.attr('id');
		else
			if( /js\-popup-[\S]*/.test( this.$popup.attr('class') ) )
				_name = /js\-popup-[\S]*/.exec( this.$popup.attr('class') )[0]

	this._name = _name;

	return _name;
}