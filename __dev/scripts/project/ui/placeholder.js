App.gui.add({
    _name: 'placeholder',
    selector: 'input[placeholder]:not(._placeholder_), textarea[placeholder]:not(._placeholder_)',
    build: function ($el) {
        $el.placeholder().addClass('_placeholder_');
    },
    destroy: function () {
    }
})