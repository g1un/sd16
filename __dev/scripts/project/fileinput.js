$(document).ready(function() {
	var calcFileSize = function(size){
		var labels = ['b', 'kb', 'mb', 'gb', 'tb'];
		var index = 0;
		while (size > 1024 && index < (labels.length - 1)) {
			size = Math.round((size*100)/1024)/100;
			index++;
		}
		return [size, labels[index]];
	}
	$('body').on('change', '.js-file-input input', function(e) {
		var file = false;
		console.log('change')
		if (this.files != null) {
			file = this.files.length > 0 ? this.files[0] : false;
		} else {
			file = $(this).val();
			if (file.length < 1) file = false;
			else {
				if (file.indexOf('/') > -1) {
					file = file.split('/').pop();
				} else if (file.indexOf('\\') > -1) {
					file = file.split('\\').pop();
				}
			}
		}
		if (file == false) {
			$(this).closest('.js-file-input').find('.js-file-input-button').removeAttr('data-file-name data-file-size data-file-size-label')
		} else {
			if (typeof file == 'string') {
				$(this).closest('.js-file-input').find('.js-file-input-button').attr({
					'data-file-name': file
				})
			} else {
				var size = calcFileSize(file.size);
				$(this).closest('.js-file-input').find('.js-file-input-button').attr({
					'data-file-name': file.name,
					'data-file-size': size[0],
					'data-file-size-label': size[1]
				})
			}
		}
	});

})
