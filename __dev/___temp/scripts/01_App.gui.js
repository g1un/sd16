(function(){
"use strict";
 App.gui = (function() {
	var _buildItemHandler, _destroyItemHandler, _eachElements, _getElements, _getResultGui, _groupEl, _gui, _guiList, _idBuild, _isInitedElement, _rebuildItem, _refreshItem, _refreshItemHandler, _variables, addHandler, buildHandler, destroyHandler, rebuildHandler, refreshHandler, removeHandler;
	_guiList = [];
	_groupEl = false;
	_variables = {};
	_idBuild = null;
	addHandler = function(obj) {
		if (!(obj.selector != null)) {
			throw new Error('has not attribute "selector"');
		}
		if (!(obj.build != null)) {
			throw new Error('has not method "build"');
		}
		if (!(obj.destroy != null)) {
			throw new Error('has not method "destroy"');
		}
		if (typeof obj.build !== 'function') {
			throw new Error('method "build" is not a function');
		}
		if (typeof obj.destroy !== 'function') {
			throw new Error('method "destroy" is not a function');
		}
		if (!(obj._name != null)) {
			throw new Error('has not attribute _name');
		}
		obj.selector = obj.selector;
		_guiList.push(obj);
		return _gui;
	};
	_getElements = function(selector, parent) {
		if (parent == null) {
			parent = false;
		}
		if (!(parent instanceof jQuery)) {
			if (typeof parent !== 'string' || parent === false) {
				parent = 'main';
			}
			parent = $(parent);
		}
		return parent.find(selector).not('[data-gui-native]');
	};
	_isInitedElement = function(gui, $el) {
		if (!($el.data('app-gui') != null) || typeof $el.data('app-gui') !== 'object') {
			$el.data('app-gui', {});
		}
		if ($el.data('app-gui')["gui--" + gui._name] === 'inited') {
			return true;
		}
		return false;
	};
	_eachElements = function(action, parent) {
		var el, guiEl, i, j, len, len1, ref;
		for (i = 0, len = _guiList.length; i < len; i++) {
			guiEl = _guiList[i];
			if (typeof guiEl.searchHandler === 'function') {
				ref = guiEl.searchHandler(guiEl.selector, parent);
				for (j = 0, len1 = ref.length; j < len1; j++) {
					el = ref[j];
					action(guiEl, $(el));
				}
			} else {
				_getElements(guiEl.selector, parent).each(function() {
					action(guiEl, $(this));
				});
			}
		}
		return _gui;
	};
	_refreshItemHandler = function(gui, $el) {
		if (_isInitedElement(gui, $el)) {
			if (typeof gui.refresh === 'function') {
				_refreshItem(gui, $el);
			} else {
				_rebuildItem(gui, $el);
			}
		} else {
			_buildItemHandler(gui, $el);
		}
	};
	_refreshItem = function(gui, $el) {
		if (_isInitedElement(gui, $el)) {
			return gui.refresh($el, _getResultGui($el, gui));
		} else {
			return _buildItemHandler(gui, $el);
		}
	};
	_rebuildItem = function(gui, $el) {
		if (_isInitedElement(gui, $el)) {
			_destroyItemHandler(gui, $el);
		}
		return _buildItemHandler(gui, $el);
	};
	_buildItemHandler = function(gui, $el) {
		if (!_isInitedElement(gui, $el)) {
			$el.data('app-gui')["gui--" + gui._name] = 'inited';
			if (_variables[gui._name] == null) {
				_variables[gui._name] = {};
			}
			$el.data('gui-element--' + gui._name, gui.build($el, {
				variables: _variables[gui._name]
			}));
			$el.on('gui.' + gui._name, function(e, method){
				if(!$el.is(e.target)) return;

				switch(method){
					case 'destroy':
						_destroyItemHandler(gui, $el);
					break;
					case 'refresh':
						_refreshItemHandler(gui, $el);
					break;
					case 'rebuild':
						_rebuildItem(gui, $el);
					break;
				}
			});
		}
	};
	_destroyItemHandler = function(gui, $el) {
		if (_isInitedElement(gui, $el)) {
			$el.data('app-gui')["gui--" + gui._name] = null;
			gui.destroy($el, _getResultGui($el, gui));
			$el.off('gui.' + gui._name);
		}
	};
	_getResultGui = function($el, gui) {
		if ($el.data('gui-element--' + gui._name) != null) {
			return $el.data('gui-element--' + gui._name);
		} else {
			return $el;
		}
	};

	var triggerEvent = function(eventName){
		$('html').trigger('gui-event', [eventName]);
		$('html').trigger('gui-' + eventName);
	}

	removeHandler = function() {
		return _gui;
	};
	refreshHandler = function(parent) {
		triggerEvent('refresh');
		_eachElements(_refreshItemHandler, parent);
		triggerEvent('refreshed');
		return _gui;
	};
	rebuildHandler = function(parent) {
		triggerEvent('rebuild');
		_eachElements(_rebuildItem, parent);
		triggerEvent('rebuilded');
		return _gui;
	};
	buildHandler = function(parent) {
		triggerEvent('build');
		_eachElements(_buildItemHandler, parent);
		triggerEvent('builded');
		return _gui;
	};
	destroyHandler = function(parent) {
		triggerEvent('destroy');
		_eachElements(_destroyItemHandler, parent);
		triggerEvent('destroyed');
		return _gui;
	};
	_gui = {};
	_gui._options = {};
	_gui.add = addHandler;
	_gui.addOption = function(optionName, optionValues){
		_gui._options[ optionName ] = optionValues
		return this;
	}
	_gui.getOption = function($el, guiName){
		var reg = /^\{.*\}$/;
		if( $el.hasAttr( "data-" + guiName + '-name' ) && _gui._options[ $el.attr( "data-" + guiName + '-name' ) ] ){
			return _gui._options[ $el.attr( "data-" + guiName + '-name' ) ];
		}
		var result = {}
		App.saveMe(function(){
			result = eval("[" + $el.attr('data-' + guiName) + "]")[0];
			result = false;
		}, function(){
			result = false;
		})
		return result;
	}
	_gui.remove = removeHandler;
	_gui.build = buildHandler;
	_gui.refresh = refreshHandler;
	_gui.rebuild = rebuildHandler;
	_gui.destroy = destroyHandler;

	_gui.__getList = function(){
		return _guiList;
	}
	return _gui;
})();
App.onReady(App.gui.build);
App.onChangeDOM(App.gui.refresh);
})();