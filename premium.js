(function () {
    try {
        window.plugin = true;

        console.log('[Premium] loaded safely');

        if (window.Lampa && Lampa.Listener) {
            Lampa.Listener.follow('app', function () {
                console.log('[Premium] app ready');
            });
        }
    } catch (e) {
        console.error('[Premium] fatal error', e);
    }
})();
