(function () {
    'use strict';

    function Premium() {
        this.init = function () {
            Lampa.Listener.follow('full', function (e) {
                if (e.type == 'complite') {
                    var container = e.object.container.find('.full-start__buttons');
                    if (container.length && !container.find('.premium-btn').length) {
                        var btn = $('<div class="full-start__button selector premium-btn" style="background:gold!important;color:#000!important;font-weight:bold!important;border-radius:5px!important"><span>PREMIUM</span></div>');
                        
                        btn.on('hover:enter', function () {
                            Lampa.Noty.show('Premium активовано');
                        });

                        container.prepend(btn);
                        Lampa.Controller.toggle('full');
                    }
                }
            });
        };
    }

    if (window.app_ready) {
        new Premium().init();
    } else {
        Lampa.Listener.follow('app', function (e) {
            if (e.type == 'ready') new Premium().init();
        });
    }
})();
