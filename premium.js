(function () {
    'use strict';

    // ОБОВʼЯЗКОВО для Lampa
    if (!window.plugin) window.plugin = true;

    function start() {
        console.log('[Premium] plugin loaded');

        if (window.Lampa && Lampa.Noty) {
            Lampa.Noty.show('Premium plugin loaded');
        }
    }

    if (window.Lampa && Lampa.Listener) {
        Lampa.Listener.follow('app', start);
    } else {
        document.addEventListener('lampa_app_ready', start);
    }
})();
