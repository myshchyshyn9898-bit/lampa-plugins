(function () {
    'use strict';

    // Реєструємо плагін у глобальному списку
    window.premium_plugin = function () {
        
        // Функція ініціалізації
        this.create = function () {
            console.log('Premium Plugin: Started');
            
            // 1. Додаємо пункт у меню (офіційний шлях)
            Lampa.Menu.add({
                id: 'premium_menu',
                title: 'PREMIUM',
                icon: '<svg height="24" viewBox="0 0 24 24" width="24" fill="#FFD700"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/></svg>',
                onSelect: function () {
                    Lampa.Noty.show('Premium працює! Оберіть фільм для пошуку якісного відео.');
                }
            });

            // 2. Слухаємо відкриття картки фільму
            Lampa.Listener.follow('full', function (e) {
                if (e.type == 'complite' || e.type == 'ready') {
                    // Використовуємо вбудовану затримку, щоб кнопки встигли з'явитися
                    setTimeout(function () {
                        var container = e.object.container.find('.full-start__buttons');
                        
                        if (container.length > 0 && !container.find('.premium-btn').length) {
                            var btn = $('<div class="full-start__button selector premium-btn" style="background: linear-gradient(135deg, #ffd700, #ff8c00) !important; color: #000 !important; font-weight: bold !important; border-radius: 8px !important; display: flex; align-items: center; padding: 10px 15px; margin: 5px;">⭐ PREMIUM</div>');

                            btn.on('hover:enter', function () {
                                openPremiumMenu(e.data);
                            });

                            container.prepend(btn);
                            Lampa.Controller.toggle('full');
                        }
                    }, 200);
                }
            });
        };
    };

    function openPremiumMenu(movie) {
        Lampa.Select.show({
            title: 'Premium Вибір',
            items: [
                { title: '🇺🇦 Українська (4K / Rezka)', quality: '4K', source: 'rezka' },
                { title: '🇺🇦 Українська (HD / Ashdi)', quality: '1080p', source: 'ashdi' },
                { title: '🌍 Оригінал (UHD)', quality: 'Max', source: 'alloha' }
            ],
            onSelect: function (item) {
                Lampa.Noty.show('Шукаю ' + item.quality + ' для ' + (movie.movie.title || movie.movie.name));
            },
            onBack: function () {
                Lampa.Controller.toggle('full');
            }
        });
    }

    // ВАЖЛИВО: Офіційний запуск плагіна
    if (window.app_ready) {
        var pl = new window.premium_plugin();
        pl.create();
    } else {
        Lampa.Listener.follow('app', function (e) {
            if (e.type == 'ready') {
                var pl = new window.premium_plugin();
                pl.create();
            }
        });
    }

})();
