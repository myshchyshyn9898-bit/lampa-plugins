(function () {
    'use strict';

    function PremiumPlugin() {
        // 1. СТИЛІ
        var style = `
            <style>
                .premium-btn-gold {
                    background: linear-gradient(135deg, #ffd700 0%, #ff8c00 100%) !important;
                    color: #000 !important;
                    padding: 10px 20px !important;
                    border-radius: 8px !important;
                    margin: 10px 5px !important;
                    font-weight: bold !important;
                    display: flex !important;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    box-shadow: 0 4px 15px rgba(255, 140, 0, 0.4);
                }
                .premium-btn-gold.focus {
                    transform: scale(1.1);
                    background: #fff !important;
                    box-shadow: 0 0 25px gold !important;
                }
            </style>
        `;

        this.create = function () {
            if (!$('body').find('#premium-styles').length) {
                $('body').append('<div id="premium-styles">' + style + '</div>');
            }

            // Додаємо в головне меню
            Lampa.Menu.add({
                id: 'premium_plugin',
                title: 'PREMIUM',
                icon: '<svg height="24" viewBox="0 0 24 24" width="24" fill="gold"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/></svg>',
                onSelect: function () {
                    Lampa.Noty.show('Premium плагін активовано!');
                }
            });

            // Постійна перевірка наявності контейнера кнопок
            setInterval(() => {
                var container = $('.full-start__buttons');
                if (container.length && !container.find('.premium-btn-gold').length) {
                    this.inject(container);
                }
            }, 1000);
        };

        this.inject = function (container) {
            var btn = $('<div class="full-start__button selector premium-btn-gold">⭐ PREMIUM</div>');
            
            btn.on('click hover:enter', () => {
                this.openMenu();
            });

            container.prepend(btn);
            // Оновлюємо навігацію
            Lampa.Controller.toggle('full');
        };

        this.openMenu = function () {
            var movie = Lampa.Activity.active().card || Lampa.Activity.active().movie;
            Lampa.Select.show({
                title: 'Premium Вибір',
                items: [
                    { title: '🇺🇦 Rezka (Українська 4K)', quality: '4K', source: 'rezka' },
                    { title: '🇺🇦 Ashdi (Українська HD)', quality: '1080p', source: 'ashdi' },
                    { title: '🌍 Original (Найкраща якість)', quality: 'Max', source: 'alloha' }
                ],
                onSelect: (item) => {
                    Lampa.Noty.show('Шукаю ' + item.title + ' для ' + movie.title);
                },
                onBack: () => { Lampa.Controller.toggle('full'); }
            });
        };
    }

    // РЕЄСТРАЦІЯ ПЛАГІНА В МАНІФЕСТІ (Для Lampa MX це важливо)
    var plugin = new PremiumPlugin();
    
    if (window.app_ready) plugin.create();
    else {
        Lampa.Listener.follow('app', function (e) {
            if (e.type == 'ready') plugin.create();
        });
    }

    // Реєструємо плагін як офіційний компонент
    Lampa.Manifest.plugins = {
        name: 'Premium Online',
        version: '1.0.0',
        description: 'Premium джерела з найкращою якістю',
        component: 'premium_plugin'
    };

})();
