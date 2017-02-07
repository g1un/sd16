var triggerDebounce = _.debounce(function(handler){
    handler();
}, 100);
App.gui.add({
    _name: 'tab',
    selector: '[data-tab]',
    build: function($el) {
        var _getGroup, _getGroupElement;
        _getGroupElement = function($this) {
            if ($this.hasAttr('data-tab-group')) {
                return $this;
            } else {
                return $this.closest('[data-tab-group]');
            }
        };
        _getGroup = function($this) {
            var $group;
            $group = $this.hasAttr('data-tab-group') ? $('[data-tab-group="' + $this.attr('data-tab-group') + '"]') : $this.closest('[data-tab-group]').find('[data-tab]');
            return $group;
        };
        App.delay(15, function() {
            var $group, _$elements;
            $group = _getGroupElement($el);
            if ($group.length < 1) {
                console.info('[UI Tab] Group length < 1', $el);
                return;
            }
            if ($group.attr('data-tab-group-auto-show') !== 'false') {
                _$elements = _getGroup($el);
                if (_$elements.filter('.__current').length > 0) {
                    _$elements.filter('.__current').removeClass('__current').click();
                } else {
                    _getGroup($el).eq(0).not('.__current').click();
                }
            } else {
                _getGroup($el).each(function() {
                    return $($(this).attr('data-tab')).addClass('__hidden');
                });
            }
        });
        $el.on('click.tab', function(e) {
            var $group, $target, $this;
            e.preventDefault();
            $this = $(this);
            $group = _getGroup($this);
            if ($this.hasClass('__current')) {
                if (_getGroupElement($this).attr('data-tab-group-collapsible') === 'true') {
                    $this.removeClass('__current');
                    $group.each(function() {
                        return $($(this).attr('data-tab')).removeClass('__visible').addClass('__hidden');
                    });
                }
                return;
            }
            if ($group.length < 1) {
                console.info('[UI Tab] Group length < 1', $el);
                return true;
            }
            $group.removeClass('__current');
            $this.addClass('__current');
            $target = $($this.attr('data-tab'));
            $group.each(function() {
                $($(this).attr('data-tab')).addClass('__hidden').removeClass('__visible');
            });
            $target.removeClass('__hidden').addClass('__visible');
            // $this.trigger('change', [$this, $group]);

            triggerDebounce(function(){
                $this.trigger('tabchange', [$this, $group]);
            })

            App.triggerResize();
            App.delay(50, App.triggerResize);
            return true;
        });
        return true;
    },
    destroy: function($el) {
        $el.off('.tab');
        return true;
    }
});