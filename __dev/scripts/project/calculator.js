window.Calculator = Calculator;

function Calculator($el, type, values) {
	if (!(this instanceof Calculator)) {
		return new Calculator($el, type, values);
	}
	if ($el.data('instanceCalculator')) {
		return $el.data('instanceCalculator');
	}
	$el.data('instanceCalculator', this);

	this.$calculator = $el;
	this.type = type;
	this.destroyers = [];
	this.init = ["initAmount", "initPayment"]
	this.values = values;
	Calculator.types[type].apply(this);
	for (var i = 0; i < this.init.length; i++) {
		this[this.init[i]].apply(this);
	}

	var _delayHandler = function(delay, handler) {
		var _timeout;
		return function() {
			if (_timeout) {
				clearTimeout(_timeout);
			}
			var __this = this;
			var args = [];
			for (var i = 0; i < arguments.length; i++) {
				args.push(arguments[i])
			}
			_timeout = _this.setTimeout(function() {
				_timeout = undefined;
				handler.apply(__this, args);
			}, delay);
		}
	}

	var _this = this;

	this.$calculator.find('input[data-calculator-target]').on('keydown.calculator keyup.calculator', _delayHandler(1000, function() {
		$(this).trigger('change');
		_this.$calculator.find('[data-calculator-element="' + $(this).attr('data-calculator-target') + '"]').trigger('change');
	})).on('focusout', function() {
		if (!$(this).val()) $(this).val(0);
		$(this).trigger('change');
	})

	this.$calculator.on('submit.calculator', function(e) {
		e.preventDefault();

		_this.submitForm($(this));

		return false;
	});


	this.addDestroyer(function() {
		this.$calculator.off('.calculator');
		this.$calculator.find('input[data-calculator-target]').off('.calculator').off('.term').off('.amount').off('.payment');
		this.$calculator.removeData('instanceCalculator');

		var _this = this;

		this.addDestroyer(function() {
			for (var key in _this) {
				delete _this[key];
			}
		});
	});

	this.addDestroyer(function(){
		for(var timeoutId in this.__timeouts){ clearTimeout(timeoutId); }
	})

	this.refreshValue();
	return this;
}

Calculator.prototype = {
	setTimeout: function(handler, delay){
		if( this.__timeouts == null ) this.__timeouts = {};
		var _this = this;

		var timeoutId = setTimeout(function(){
			delete _this.__timeouts[ timeoutId ];
			handler.apply(this);
		}, delay);

		this.__timeouts[ timeoutId ] = true;
		return timeoutId;
	},
	initAmount: function() {
		var _this = this;
		this.$amount = this.$calculator.find('[data-calculator-element="amount"]').on('slide.calculator change.calculator', function() {
			_this.setTimeout(function() {
				_this.amountChanged(parseInt(_this.$amount.slider("value")) || 0);
			}, 10);
		});

		this.addDestroyer(function() {
			if( _this.$amount.hasClass('__inited') ){ _this.$amount.slider("destroy") }
			_this.$amount.off('.calculator').off('.amount').removeClass('__inited');
			_this.$calculator.find('input[data-calculator-target="amount"]').off('.amount')
		});

		this.$calculator.find('input[data-calculator-target="amount"]').off('.amount').on('input.amount change.amount', function() {
			var val = parseInt($(this).val().replace(/[^0-9]/g, ''));
			if (val != _this.$amount.slider("value")) {
				_this.$amount.slider("value", parseInt(val) || 0);
			}
		})
	},
	initPayment: function() {
		var _this = this;
		this.$payment = this.$calculator.find('[data-calculator-element="payment"]');

		this.addDestroyer(function() {
			if( _this.$payment.hasClass('__inited') ){ _this.$payment.slider("destroy") }
			_this.$payment.off('.calculator').off('.payment').removeClass('__inited');
		});

		this.$calculator.find('input[data-calculator-target="payment"]').off('.payment').on('input.payment change.payment', function() {
			var val = parseInt($(this).val().replace(/[^0-9]/g, ''));
			if (val != _this.$payment.slider("value")) {
				_this.$payment.slider("value", parseInt(val) || 0);
			}
		})
	},
	destroy: function() {
		for (var i = 0; (this.destroyers && i < this.destroyers.length); i++) {
			this.destroyers[i].apply(this);
		}
	},
	addInit: function(_name) {
		this.init.push(_name);
		return this;
	},
	addDestroyer: function(handler) {
		this.destroyers.push(handler);
		return this;
	},
	amountChanged: function(currentValue) {
		console.log(currentValue)
		var lastValue = this.$payment.data('lastValue');

		var min = Math.round((currentValue * this.currentValue.paymentMinRate) / 100);
		var max = Math.round((currentValue * this.currentValue.paymentMaxRate) / 100);
		var start = lastValue || min;
		var _this = this;

		var inited = this.$payment.hasClass('__inited');
		this.$payment.addClass('__inited').slider({
				value: start,
				step: 1,
				min: Math.min( min, max),
				max: Math.max( min, max)
			})
			.off('.payment').on('slide.payment change.payment', function(e) {
				var _$slider = $(this);
				_this.setTimeout(function() {
					var $input = _this.$calculator.find('input[data-calculator-target="payment"]');
					if( parseInt($input.val().replace(/[^0-9]/g, '')) !== _$slider.slider("value") ){
						$input.val(_$slider.slider("value")).trigger('change');
					}
					if (e.type == 'slide') {
						_$slider.data('lastValue', parseInt(_$slider.slider("value")));
					}
				}, 10);
			}).trigger('change');
	},
	refreshValue: function() {
		var lastValue = this.$amount.data('lastValue');
		var inited = this.$amount.hasClass('__inited');
		var _this = this;
		if (this.$amount.length > 0) {
			this.$amount.addClass('__inited').slider({
					value: lastValue || this.currentValue.amountValue,
					step: 1,
					min: Math.min(this.currentValue.amountMin, this.currentValue.amountMax),
					max: Math.max(this.currentValue.amountMin, this.currentValue.amountMax)
				})
				.off('.amount').on('slide.amount change.amount', function(e) {
					var _$slider = $(this);
					_this.setTimeout(function() {
						var $input = _this.$calculator.find('input[data-calculator-target="amount"]');
						if( parseInt($input.val().replace(/[^0-9]/g, '')) !== _$slider.slider("value") ){
							$input.val(_$slider.slider("value")).trigger('change');
						}
						if (e.type == 'slide') {
							_$slider.data('lastValue', parseInt(_$slider.slider("value")));
						}
					}, 10);
				}).trigger('change');
		} else {
			_this.amountChanged(parseInt(this.$calculator.find('[data-calculator-target="amount"]').val().replace(/ /g, '')) || 0);
		}
	},
	submitForm: function($form) {
		var _formData = $form.serializeArray();
		var url = $form.attr('action');
		var _this = this;

		var formData = {};
		for (var i = 0; i < _formData.length; i++) {
			formData[_formData[i].name] = _formData[i].value
		}

		$.ajax({
			url: url,
			type: "POST",
			data: formData,
			async: true,
			success: function(response) {
				_this.resultSubmitHandler(response);
			},
			dataType: 'html'
		});
	}
}

Calculator.types = {
	credit: function() {
		this.initBanks = function() {
			var _this = this;
			this.$bank = this.$calculator.find('[data-calculator-element="bank"]');
			this.currentValue = this.values.banks[this.$bank.filter(':checked').val() || Object.keys(_this.values.banks)[0]];
			this.$bank.on('change.calculator', function() {
				_this.currentValue = _this.values.banks[_this.$bank.filter(':checked').val() || Object.keys(_this.values.banks)[0]];
				_this.refreshValue();
			});
			this.addDestroyer(function() {
				_this.$bank.off('.calculator');
			});
		}
		this.initTerm = function() {
			var _this = this;
			this.$term = this.$calculator.find('[data-calculator-element="term"]');

			this.addDestroyer(function() {
				if( _this.$term.hasClass('__inited') ){ _this.$term.slider("destroy") }
				_this.$term.off('.calculator').off('.term').removeClass('__inited');
			});
		}
		this.addInit("initBanks");
		this.addInit("initTerm");

		var _refreshValue = this.refreshValue;
		this.refreshValue = function() {
			_refreshValue.apply(this);

			var inited = this.$term.hasClass('__inited');
			var _this = this;
			this.$term.addClass('__inited').slider({
					value: this.currentValue.minTime + Math.round((this.currentValue.maxTime - this.currentValue.minTime) / 2),
					step: 1,
					min: Math.min(this.currentValue.minTime, this.currentValue.maxTime),
					max: Math.max(this.currentValue.minTime, this.currentValue.maxTime)
				})
				.off('.term').on('slide.term change.term', function(e) {
					var _$slider = $(this);
					_this.setTimeout(function() {
						var $input = _this.$calculator.find('input[data-calculator-target="term"]');
						if( parseInt($input.val().replace(/[^0-9]/g, '')) !== _$slider.slider("value") ){
							$input.val(_$slider.slider("value")).trigger('change');
						}
						if (e.type == 'slide') {
							_$slider.data('lastValue', parseInt(_$slider.slider("value")));
						}
					}, 10);
				}).trigger('change');


			this.$calculator.find('input[data-calculator-target="term"]').off('.term').on('input.term change.term', function() {
				var val = parseInt($(this).val().replace(/[^0-9]/g, ''));
				if (val != _this.$term.slider("value")) {
					_this.$term.slider("value", parseInt(val) || 0);
				}
			})
		}

		this.resultSubmitHandler = function(response) {
			response = jQuery.parseJSON(response);
			if (response.result == '1') {
				var $popup = $('.js-popup-calculator-result-credit');
				$popup.find('.bank-name').text(response.name);
				$popup.find('.summ-result').text(response.summ_result);
				$popup.find('.time-result').text(response.time_result);
				$popup.find('.pay-result').text(response.pay_result);
				$popup.find('.summ-month-result').text(response.summ_month_result);
				$popup.find('.pay-more-result').text(response.pay_more_result);
				$popup.find('.effect-result').text(response.effect);
				$popup.find('.time-year').text(response.time_year);
				$popup.find('.js-first_pay_word').text(response.first_pay_word);

				App.popup($popup).open();
			}
		}
	},
	installment: function() {
		var _this = this;
		this._objectsRefresh = function() {
			_this.$objects.empty();

			var objects = _this.values.queues[_this.$queue.val()]

			for (var id in objects) {
				var _object = objects[id];

				var option = '<option value="' + _object.value + '"' + (_object.selected ? ' selected="selected"' : '') + '>' + _object.text + ' КОРПУС</option>';

				_this.$objects.append(option);

			}

			App.gui.rebuild(_this.$objects.parent());
			_this.$objects.trigger('refresh');
			_this.$objects.trigger('change');
		}
		this.initQueue = function() {
			var _this = this;
			this.$queue = this.$calculator.find('[data-calculator-element="queue"]');

			this.$queue.on('change.calculator selectmenuchange.calculator', this._objectsRefresh);

			this.addDestroyer(function() {
				_this.$queue.off('.calculator');
			});
		}
		this.initObjects = function() {
			var _this = this;
			this.$objects = this.$calculator.find('[data-calculator-element="objects"]');
			this._objectsRefresh();

			this.currentValue = this.values.queues[this.$queue.val()][this.$objects.val()];

			this.$objects.on('change.calculator selectmenuchange.calculator', function() {
				_this.currentValue = _this.values.queues[_this.$queue.val()][_this.$objects.val()];
				_this.refreshValue();
			});
			this.addDestroyer(function() {
				_this.$objects.off('.calculator');
			});
		}

		this.addInit("initQueue");
		this.addInit("initObjects");

		this.resultSubmitHandler = function(response) {
			try {
				response = jQuery.parseJSON(response);
				if (response.result == 0) {
					$('#initial-slider-input').trigger('change');
					$('.js-queue').trigger('change');
				}
			} catch (e) {
				$('.js-installment-result').html(response);
				App.popup('.js-popup-calculator-result-installment').open();
			}
		}
	}
}


Calculator.parseData = function(data) {
	var calculatorData = { banks: {}, queues: {} };

	for (var bank in data.banks) {

		calculatorData.banks[bank] = {
			amountValue: data.min + Math.round((data.max - data.min) / 2),
			amountMin: data.min,
			amountMax: data.max,
			paymentMinRate: data.banks[bank]['FEE'],
			paymentMaxRate: 99,
			minTime: 1,
			maxTime: data.banks[bank]['MAX_TIME']
		}
	}

	for (var queue in data.QUEUE) {
		calculatorData['queues'][queue] = {}
		for (var obj in data.QUEUE[queue]['OBJECTS']) {
			var _val = data.QUEUE[queue]['OBJECTS'][obj];
			var _min = _val.MIN; // || data.min;
			var _max = _val.MAX; // || data.max;
			var _amountValue = _min + Math.round((_max - _min) / 2);

			calculatorData['queues'][queue][obj] = {
				amountValue: _amountValue,
				amountMin: _min,
				amountMax: _max,
				paymentMinRate: 10,
				paymentMaxRate: 99,
				id: _val.ID,
				value: obj,
				text: _val.NUMBER,
				selected: _val.SELECTED
			}
		}
	}
	return calculatorData;
}


App.gui.add({
	_name: 'calculator',
	selector: '.js-calculator',
	build: function($el) {
		var type = $el.attr('data-calculator-type');
		var data = $el.attr('data-calculator-use-data');
		if( window[data] ){
			data = window[data];
		} else {
			data = window.calculatorData;
		}

		var calculator = new Calculator($el, type, Calculator.parseData( data ));

		$el.find( 'input[data-value-formatter="price"]' ).on('input.js-calculator change.js-calculator', function(){
			var $input = $(this);
			var val = $input.val();
			val = val.replace(/[^0-9]/g, '');
			val = val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
			$input.val(val);
			setTimeout(function(){
				var val = $input.val();
				val = val.replace(/[^0-9]/g, '');
				val = val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
				$input.val(val);
			}, 15);
		})
		return {
			destroy: function() {
				$el.find( 'input[data-value-formatter="price"]' ).off('input.js-calculator change.js-calculator');
				calculator.destroy();
			}
		}
	},
	destroy: function($el, methods) {
		if (methods && typeof methods['destroy'] == 'function') {
			methods['destroy']();
		}
	}
});
