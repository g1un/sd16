/**
 * Класс для монипуляции модальными окнами
 * @class
 * @name Popup
 * @param {jQueryElement|String|DOMElement} popup  Ссылка или селектор на DOM/jQuery-элемент
 * @param {Object=} [popupOptions=@{Popup.prototype.options}] Параметры окон
 * @return {Popup}
 */
function Popup(popup, popupOptions){
	if(popupOptions == null || typeof popupOptions !== 'object'){
		popupOptions = {}
	}
	if( !(this instanceof Popup) ){
		return new Popup(popup, popupOptions);
	}

	var $popup = Popup.findPopup(popup, popupOptions);

	if(!$popup){
		for(var key in this){
			var val = this[key];
			this[key] = Popup.EMPTY_VALUES[ typeof val ] || {};
		}

		this.empty = true;

		return;
	}

	if( $popup.data('uipopup') ){
		return $popup.data('uipopup').setOptions(popupOptions);
	}

	this.setOptions(popupOptions);

	this.$popup = $popup;

	this.id = ++Popup.lastPopupId;

	this.setState('closed');
	this.events();

	$popup.data('uipopup', this);

	return this;
}

Popup.EMPTY_VALUES = {
	'object': {},
	'function': function(){},
	'number': 1
}

/**
 * Счётчик для id
 * @name  Popup.lastPopupId
 * @type {Number}
 */
Popup.lastPopupId = 0;
/**
 * Поиск окна
 * @name Popup.findPopup
 * @param  {jQueryElement|String|DOMElement} popup  Ссылка или селектор на DOM/jQuery-элемент
 * @param  {Object=} [popupOptions=@{Popup.prototype.options}] Параметры модального окна (см. @{Popup.prototype.options})
 * @return {jQueryElement}
 */
Popup.findPopup = function(popup, popupOptions){
	var $popup = $('');
	if( popup === "" ){
		if( popupOptions && popupOptions['clickTarget'] ){
			$popup = popupOptions['clickTarget'].closest('.popup');
		}
	} else {
		if( !(popup instanceof jQuery) ){
			if( typeof popup == 'string' && popup.length > 0){
				$popup = $('[data-popup-name="' + popup + '"]');
			}
			if($popup.length < 1){
				$popup = $(popup);
			}
			if($popup.length < 1){
				$popup = $('.js-popup-' + popup);
			}
		} else {
			return popup;
		}
	}
	if($popup.length < 1){
		console.error( 'Popup not found:', popup )
		return null;
	}
	return $popup;
}
/**
 * Возвращает видимые окна
 * @name Popup.getVisible
 * @return {jQuery} jQuery окна
 * @example
 * var $visiblePopups = Popup.getVisible();
 */
Popup.getVisible = function(){
	return $('.popup:visible');
}
/**
 * Возвращает все окна
 * @name Popup.getAll
 * @return {jQueryElement} [description]
 * @example
 * var $allPopups = Popup.getAll();
 */
Popup.getAll = function(){
	return $('.popup');
}

/**
 * Устанавливает опции "по умолчанию"
 * @name  Popup.setOptions
 * @param {Object} [popupOptions=@{Popup.prototype.options}] Параметры модального окна (см. @{Popup.prototype.options})
 * @example
 * Popup.setOptions({
 * 	durationOpen: 300,
 * 	durationClose: 300
 * })
 */
Popup.setOptions = function(popupOptions){
	Popup.prototype.options = $.extend({}, Popup.prototype.options, popupOptions);
}

/**
 * Кэширование шаблона модального окна
 * @name   Popup.template
 * @type {Object}
 */
Popup.templateCache = {};


/**
 * Получить шаблон
 * @name   Popup.getTemplate
 * @param  {String} templateId 				id шаблона
 * @param  {Boolean=} [resetCache=false] 	Обновить шаблон в кэше
 * @return {Function}            			Функция рендера шаблона {@link https://lodash.com/docs#template}
 * @example
 * var template = Popup.getTemplate("template-example");
 * var resultHtml = template({title: "Заголовок"});
 */
Popup.getTemplate = function(templateId, resetCache){
	if(!Popup.templateCache[templateId] || resetCache === true){
		var $template = $('#' + templateId);
		if($template.length !== 1){
			throw new Error('Popup template not found');
		}
		Popup.templateCache[templateId] =_.template($template.html());
	}
	return Popup.templateCache[templateId];
}

/**
 * Открытие модального окна из шаблона, используется шаблонизатор {@link https://lodash.com/docs#template}
 * @name   Popup.fromTemplate
 * @param  {Object=} [templateOptions={}]					   Переменные шаблона
 * @param  {Object=} [popupOptions=@{Popup.prototype.options}]    Параметры модального окна (см. @{Popup.prototype.options})
 * @return {Popup}                   						   Экземпляр модального окна
 * @example
 * Popup.fromTemplate({
 * 	title: "Заголовок",
 * 	text: "Далеко-далеко за словесными горами в стране."
 * }, {
 * 	templateId: "template-custom-popoup"
 * })
 */
Popup.fromTemplate = function(templateOptions, popupOptions){
	if(templateOptions == null) templateOptions = {};
	popupOptions = $.extend({}, Popup.prototype.options, popupOptions);

	templateOptions = $.extend({}, {
		hideClose: false,
		title: '',
		subtitle: '',
		content: '',
		popupName: '',
		addClass: ''
	}, templateOptions);


	var template = Popup.getTemplate(popupOptions.templateId);

	var $content = $($('<div/>').html( template(templateOptions) ).find('.popup'));

	var result = new Popup($content, popupOptions);
	return result
}
/**
 * Очистить кэш шаблона для модальных окон
 * @name   Popup.clearTemplateCache
 * @param  {String=} templateId Для очистки определённого кэша
 * @example
 * Popup.clearTemplateCache("template-custom-popoup") // Очистить кэш "template-custom-popoup" шаблона
 * @example
 * Popup.clearTemplateCache() // Очистить весь кэш
 */
Popup.clearTemplateCache = function(templateId){
	if(templateId == null){ Popup.templateCache = {}; }
	else if(Popup.templateCache[templateId]) {
		delete Popup.templateCache[templateId];
	}
}

/**
 * Открытие Модального окна с ajax загрузкой контента
 * @name   Popup.ajaxOpen
 * @param  {String | Object} 	requestOptions									url или параметры запроса {@link http://api.jquery.com/jquery.ajax/}
 * @param  {Object=}			[templateOptions={}]							Переменные шаблона
 * @param  {Object=} 			[templateOptions=@{Popup.prototype.options}] 	Параметры модального окна
 * @return {Popup}             													Экземпляр модального окна
 * @example
 * Popup.ajaxOpen('/ajaxFeedback')
 * @example
 * Popup.ajaxOpen({
 * 	url: '/ajaxFloor',
 * 	method: 'post',
 * 	data: {
 * 		buildingId: 1
 * 	},
 * 	done: function(){
 * 		alert('Done');
 * 	}
 * }, {
 * 	title: 'План этажа'
 * })
 * @example
 * // Фильтрация результата запроса
 * Popup.ajaxOpen({
 * 	url: '/ajaxFloor',
 * 	dataFilter: function(data){
 * 		return $('<div/>').html(data).find('.popup-content').html(); // Возвращаем необходимый результат
 * 	}
 * });
 */
Popup.ajaxOpen = function(requestOptions, templateOptions, popupOptions){
	if(requestOptions == null || ( typeof requestOptions != 'object' && typeof requestOptions != 'string' )){
		console.error('requestOptions isnot object or string');
		return;
	}

	var options = {
		method: 'get',
		data: undefined,
		done: _.noop(),
		fail: _.noop(),
		always: _.noop()
	}

	var parseHtmlHandler = requestOptions.parse

	if(typeof requestOptions == 'string'){
		options.url = requestOptions;
		options.method = 'get';
	} else {
		options = $.extend({}, options, requestOptions);
	}
	var popup = Popup.fromTemplate(templateOptions, popupOptions);

	if(popup.request){
		popup.request.abort();
		delete popup.request;
	}

	popup.getPopup().addClass('__loading');

	_.delay(function(){
		popup.request = $.ajax(options).always(function(){ delete popup.request; popup.getPopup().removeClass('__loading'); })
			.fail(function(error, typeError){
				if(typeError == "abort") return;
				popup.setContent( Popup.getTemplate(popup.options.templateErrorId)({title: error.statusText, text: error.responseText}) );
			})
			.done(function(data){ popup.setContent(data); });
	}, 50);

	popup.open();
	popup.on('popup-closed', function(){ this.$popup.remove(); });

	return popup;
}