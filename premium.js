(function () {
    'use strict';

    function init() {
        Lampa.Listener.follow('full', function (e) {
            if (e.type == 'complite') {
                var container = e.object.container.find('.full-start__buttons');
                if (container.length && !container.find('.premium-btn').length) {
                    var btn = $('<div class="full-start__button selector premium-btn" style="background:gold!important;color:black!important;font-weight:bold!important;border-radius:8px!important;">⭐ PREMIUM</div>');
                    
                    btn.on('hover:enter', function () {
                        Lampa.Noty.show('Premium Сервіс активовано');
                    });

                    container.prepend(btn);
                    Lampa.Controller.toggle('full');
                }
            }
        });
    }

    if (window.app_ready) init();
    else Lampa.Listener.follow('app', function (e) { if (e.type == 'ready') init(); });
})();
