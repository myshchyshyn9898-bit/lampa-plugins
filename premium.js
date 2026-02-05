(function () {
    if (!window.Lampa) return;

    Lampa.Extensions.add({
        name: 'premium_online',

        onStart: function () {
            Lampa.Noty.show('Premium extension loaded');
            console.log('[Premium] extension started');
        },

        onStop: function () {
            console.log('[Premium] extension stopped');
        }
    });
})();
