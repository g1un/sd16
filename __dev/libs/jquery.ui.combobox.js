$.widget("custom.combobox", {
	options: {
		invalidLabel: "didn't match any item",
		toggleTitle: "Show All Items",
		removeIfInvalid: true,
		hideDelay: 5000,
		placeholderOnDisabled: true
	},
	_create: function() {
		this.wrapper = $("<div>")
			.addClass("custom-combobox")
			.insertAfter(this.element);

		this.element.hide();
		this._createAutocomplete();
		this._createShowAllButton();
		this._resize();
	},

	_resize: function(){
		// this.wrapper.outerWidth( this.element.show().outerWidth() );
		// this.element.hide();
	},

	_createAutocomplete: function() {
		var selected = this.element.children(":selected"),
			value = selected.val() ? selected.text() : "";

		var _this = this;

		this.input = $("<input>")
			.attr('type', 'text')
			.appendTo(this.wrapper)
			.val(value)
			.attr("title", "")
			.addClass("custom-combobox-input ui-widget ui-widget-content ui-state-default ui-corner-left")
			.autocomplete({
				delay: 0,
				minLength: 0,
				source: $.proxy(this, "_source"),
				open: function(){
					_this.input.trigger('comboboxopen');
				},
				close: function(){
					_this.input.trigger('comboboxclose');
				}
			})
			.tooltip({
				tooltipClass: "ui-state-highlight"
			});
		
		this._checkDisabled();

		this.autocompleteInstance = this.input.autocomplete("instance")

		this._on(this.input, {
			autocompleteselect: function(event, ui) {
				ui.item.option.selected = true;
				this._trigger("select", event, {
					item: ui.item.option
				});
				setTimeout($.proxy(this, "_checkDisabled"), 10);
			},

			autocompletechange: "_removeIfInvalid"
		});
	},
	_checkDisabled: function(){
		var selected = this.element.children(":selected");
		if(selected.is(':disabled')){
			this.wrapper.addClass('selected-disabled');
			if( this.options.placeholderOnDisabled ){
				this.input.attr("placeholder", selected.text()).val("");
			}
		} else {
			this.wrapper.removeClass('selected-disabled');
			if( this.options.placeholderOnDisabled ){
				// this.input.attr("placeholder", "");
			}
		}
	},
	_createShowAllButton: function() {
		var input = this.input,
			wasOpen = false;

		this.showAllButton = $("<a>")
			.attr("tabIndex", -1)
			.attr("title", this.options.toggleTitle)
			.tooltip()
			.appendTo(this.wrapper)
			.button({
				icons: {
					primary: "ui-icon-triangle-1-s"
				},
				text: false
			})
			.removeClass("ui-corner-all")
			.addClass("custom-combobox-toggle ui-corner-right")
			.mousedown(function() {
				wasOpen = input.autocomplete("widget").is(":visible");
			})
			.click(function() {
				input.focus();

				// Close if already visible
				if (wasOpen) {
					return;
				}

				// Pass empty string as value to search for, displaying all results
				input.autocomplete("search", "");
			});
		var _this = this;
		input.on('comboboxopen', function(){
			_this.wrapper.addClass('__expaned')
		})
		input.on('comboboxclose', function(){
			_this.wrapper.removeClass('__expaned')
		})
	},

	_source: function(request, response) {
		var matcher = new RegExp($.ui.autocomplete.escapeRegex(request.term), "i");
		response(this.element.children("option").map(function() {
			var text = $(this).text();
			if (this.value && (!request.term || matcher.test(text)))
				return {
					label: text,
					value: text,
					option: this
				};
		}));
	},

	_removeIfInvalid: function(event, ui) {
		this._checkDisabled();
		// Selected an item, nothing to do
		if (ui.item) {
			return;
		}

		// Search for a match (case-insensitive)
		var value = this.input.val(),
			valueLowerCase = value.toLowerCase(),
			valid = false;
		this.element.children("option").each(function() {
			if ($(this).text().toLowerCase() === valueLowerCase) {
				this.selected = valid = true;
				return false;
			}
		});

		// Found a match, nothing to do
		if (valid) {
			return;
		}

		// Remove invalid value
		if(this.options.removeIfInvalid){
			this.input.val("");
			this.element.val("");
		}
		this.input
			.attr("title", "«" + value + "»" + " " + this.options.invalidLabel)
			.tooltip("open");
		this._delay(function() {
			this.input.tooltip("close").attr("title", "");
		}, this.options.hideDelay);
		this.input.autocomplete("instance").term = "";
	},

	refresh: function(){
		this._resize();
	},

	_destroy: function() {
		this.wrapper.remove();
		this.element.show();
	}
});