(function () {
    'use strict';

    if (!window.Lampa) return;

    Lampa.Extensions.add({
        name: 'premium_online',

        onStart: function () {
            console.log('[Premium] extension started');

            Lampa.Noty.show('Premium extension loaded');
        },

        onStop: function () {
            console.log('[Premium] extension stopped');
        }
    });

})();
