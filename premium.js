(function () {
    'use strict';

    function start() {
        console.log('[Premium] plugin loaded');

        // повідомлення для перевірки
        if (Lampa && Lampa.Noty) {
            Lampa.Noty.show('Premium plugin loaded');
        }
    }

    if (window.Lampa && Lampa.Listener) {
        Lampa.Listener.follow('app', start);
    } else {
        document.addEventListener('lampa_app_ready', start);
    }

})();
