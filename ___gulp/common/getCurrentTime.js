'use strict';
module.exports = function($){
	var timeValueFormat = function (val){ if(val < 10) return "0" + val; return val; }
	return function(){
		var nowDate = new Date();
		return timeValueFormat(nowDate.getHours()) + ':' + timeValueFormat(nowDate.getMinutes()) + ':' + timeValueFormat(nowDate.getSeconds());
	}
}