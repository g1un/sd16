'use strict';
module.exports = function($, _){
	return function (err) {
		var message = '';

		message += "\nPlugin: " + err.plugin + "\n"
		message += "----------\nStack: \n\n" + err.stack + "\n----------\n"

		if(err.message){
			message += ("Message: \n\n" + err.message)
		}
		else {
			message += (err)
		}

		$.log.error(message)

		this.emit('end')
		return
	}
}