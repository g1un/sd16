function PopupPrototype(){}
App.PopupPrototype = PopupPrototype;
PopupPrototype.prototype = new App.ClassProto({namespace: 'popup'});
Popup.prototype = new PopupPrototype();
var _proto = Popup.prototype;

/**
 * Настройки по умолчанию
 * @name Popup.prototype.options
 * @type {Object}
 * @property {Number} [durationOpen=300] 					Скорость открытия, в мс.
 * @property {Number} [durationClose=300] 					Скорость закрытия, в мс.
 * @property {String} [templateId="popup-template"] 		ID шаблона для генерации окон
 * @property {String} [templateId="template-popup-error"] 	ID шаблона для генерации ошибки при ajax загрузки
 */
_proto.options = {
	durationOpen: 300,
	durationClose: 300,
	templateId: 'template-popup',
	templateErrorId: 'template-popup-error'
}

/**
 * [Служебный] Словарь для состояний окна
 * @name Popup.prototype.STATES
 * @type {Object}
 */
_proto.STATES = {
	'closed'						: "00",
	'close-end'						: "00",
	'close'							: "00",

	'closing'						: "01",
	'close-start'					: "01",

	'before-close'					: "02",

	'before-close-animation'		: "03",
	'after-close-animation'			: "04",
	'fail-close-animation'			: "05",



	'opened'						: "10",
	'open-end'						: "10",
	'open'							: "10",

	'opening'						: "11",
	'open-start'					: "11",

	'before-open'					: "12",

	'before-open-animation'			: "13",
	'after-open-animation'			: "14",
	'fail-open-animation'			: "15"
}