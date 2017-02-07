'use strict';
module.exports = function($, _){
	return function(arr, handler, cb) {
		var currentIndex = 0;
		var self = {
			next: function(){
				if(currentIndex >= arr.length){
					$.async(cb);
					return;
				}
				;(function(currentIndex){
					$.async(function(){
						handler.apply(self, [arr[currentIndex], currentIndex, arr]);
					});
				})(currentIndex);
				currentIndex++;
			}
		}
		return self;
	}
}