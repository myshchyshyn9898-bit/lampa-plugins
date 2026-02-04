(function () {
    'use strict';

    function PremiumComponent(object) {
        this.create = function () {
            this.start();
        };

        this.start = function () {
            Lampa.Noty.show('Premium активовано');
            // Тут буде логіка пошуку, коли компонент відкриється
        };

        this.render = function () {
            return $('<div>Premium Component</div>');
        };

        this.destroy = function () {};
    }

    function startPlugin() {
        // Реєструємо компонент
        Lampa.Component.add('premium_plugin', PremiumComponent);

        // Додаємо кнопку в маніфест (офіційний спосіб Lampa)
        Lampa.Manifest.plugins = {
            name: 'Premium Online',
            version: '1.0.0',
            description: 'Найкраща якість та українська озвучка',
            component: 'premium_plugin'
        };

        // Додаємо пункт у головне меню
        Lampa.Menu.add({
            id: 'premium_menu',
            title: 'PREMIUM',
            icon: '<svg height="24" viewBox="0 0 24 24" width="24" fill="gold"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/></svg>',
            onSelect: function () {
                Lampa.Noty.show('Premium працює!');
            }
        });

        // Спроба "вбити" кнопку в картку через перевірку DOM
        var injectInterval = setInterval(function () {
            var container = $('.full-start__buttons');
            if (container.length > 0 && !container.find('.premium-btn-gold').length) {
                var btn = $('<div class="full-start__button selector premium-btn-gold" style="background: linear-gradient(135deg, #ffd700 0%, #ff8c00 100%) !important; color: #000 !important; padding: 10px 20px; border-radius: 8px; margin: 10px 5px; font-weight: bold; cursor: pointer; display: flex; align-items: center; justify-content: center;">⭐ PREMIUM</div>');
                
                btn.on('click hover:enter', function () {
                    Lampa.Noty.show('Шукаю найкращу якість...');
                    // Тут виклик меню якості
                });

                container.prepend(btn);
                if (window.Lampa && Lampa.Controller) Lampa.Controller.toggle('full');
            }
        }, 1000);
    }

    // Запуск точно як у Showy
    if (window.app_ready) {
        startPlugin();
    } else {
        Lampa.Listener.follow('app', function (e) {
            if (e.type == 'ready') startPlugin();
        });
    }

})();
