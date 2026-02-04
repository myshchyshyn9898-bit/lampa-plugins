(function () {
    'use strict';

    function PremiumPlugin() {
        var _this = this;

        this.init = function () {
            // Додаємо стилі в стилі Showy/Modss
            $('body').append('<style>.premium-gold-btn{background:linear-gradient(135deg,#ffd700,#ff8c00)!important;color:#000!important;font-weight:700!important;border-radius:5px!important;padding:10px 15px!important;margin:5px!important;display:flex!important;align-items:center}.premium-gold-btn.focus{transform:scale(1.05);background:#fff!important;box-shadow:0 0 15px gold}</style>');

            // Слухаємо відкриття картки фільму
            Lampa.Listener.follow('full', function (e) {
                if (e.type == 'complite') {
                    _this.addButton(e);
                }
            });
        };

        this.addButton = function (e) {
            var container = e.object.container.find('.full-start__buttons');
            
            if (container.length && !container.find('.premium-gold-btn').length) {
                var btn = $('<div class="full-start__button selector premium-gold-btn">⭐ PREMIUM</div>');

                btn.on('hover:enter', function () {
                    _this.openMenu(e.data);
                });

                // Вставляємо перед кнопкою трейлера або торрентів
                var target = container.find('.view--torrent, .view--trailer').first();
                if (target.length) target.before(btn);
                else container.append(btn);

                Lampa.Controller.toggle('full');
            }
        };

        this.openMenu = function (data) {
            Lampa.Select.show({
                title: 'Premium Вибір',
                items: [
                    {title: '🇺🇦 Українська озвучка (4K)', quality: '4K', source: 'rezka'},
                    {title: '🇺🇦 Українська озвучка (HD)', quality: '1080p', source: 'ashdi'},
                    {title: '🌍 Original (Найкраща якість)', quality: 'Max', source: 'alloha'}
                ],
                onSelect: function (item) {
                    Lampa.Noty.show('Пошук ' + item.title + ' для ' + (data.movie.title || data.movie.name));
                },
                onBack: function () {
                    Lampa.Controller.toggle('full');
                }
            });
        };
    }

    // Запуск через стандартний механізм Lampa
    if (window.app_ready) {
        new PremiumPlugin().init();
    } else {
        Lampa.Listener.follow('app', function (e) {
            if (e.type == 'ready') new PremiumPlugin().init();
        });
    }

})();
