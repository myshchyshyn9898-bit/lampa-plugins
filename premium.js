(function () {
    'use strict';

    function initPremium() {
        // 1. Реєструємо компонент для виклику меню
        Lampa.Component.add('premium_search_ui', function (object) {
            this.create = function () {
                var html = $('<div class="premium-menu-page" style="text-align:center; padding:20px;">' +
                                '<h2 style="color:gold; margin-bottom:20px;">💎 PREMIUM SELECTION</h2>' +
                                '<div class="premium-options" style="display:flex; flex-direction:column; gap:10px;">' +
                                    '<div class="simple-button selector" data-source="rezka_ukr" style="width:100%; padding:15px; background:rgba(255,255,255,0.1); border-radius:10px;">🇺🇦 Українська озвучка (4K)</div>' +
                                    '<div class="simple-button selector" data-source="rezka_hd" style="width:100%; padding:15px; background:rgba(255,255,255,0.1); border-radius:10px;">🇺🇦 Українська озвучка (1080p)</div>' +
                                    '<div class="simple-button selector" data-source="orig" style="width:100%; padding:15px; background:rgba(255,255,255,0.1); border-radius:10px;">🌍 Original / English</div>' +
                                '</div>' +
                            '</div>');

                html.find('.selector').on('hover:enter', function() {
                    Lampa.Noty.show('Шукаю варіанти: ' + $(this).text());
                });

                return html;
            };
            this.render = function () { return this.create(); };
            this.destroy = function () {};
        });

        // 2. Метод додавання кнопки (універсальний)
        var injectButton = function() {
            // Шукаємо блок кнопок (Play, Трейлер тощо)
            var footer = $('.full-start__buttons, .buttons__list, .movie-full__buttons');
            
            if (footer.length > 0 && !footer.find('.premium-btn-gold').length) {
                var btn = $('<div class="full-start__button selector premium-btn-gold" style="background: linear-gradient(135deg, #ffd700 0%, #ff8c00 100%) !important; color: #000 !important; font-weight: bold !important; border-radius: 8px !important; display: flex !important; align-items: center; justify-content: center; padding: 10px 20px; margin: 5px;">' +
                                '⭐ PREMIUM' +
                            '</div>');

                btn.on('hover:enter click', function () {
                    var cardData = Lampa.Activity.active().card || Lampa.Activity.active().movie;
                    Lampa.Activity.push({
                        title: 'Premium Пошук',
                        component: 'premium_search_ui',
                        movie: cardData,
                        page: 1
                    });
                });

                // Вставляємо перед першою кнопкою
                footer.prepend(btn);
                
                // Змушуємо навігацію оновитися
                if (window.Lampa && Lampa.Controller) Lampa.Controller.toggle('full');
            }
        };

        // 3. Запускаємо "наглядача" за екраном
        setInterval(injectButton, 1000);
        
        // Додаємо в головне меню для тесту
        Lampa.Menu.add({
            id: 'premium_main',
            title: 'PREMIUM',
            icon: '<svg height="24" viewBox="0 0 24 24" width="24" fill="gold"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/></svg>',
            onSelect: function() { Lampa.Noty.show('Premium Сервіс Готовий'); }
        });
    }

    // Старт
    if (window.app_ready) initPremium();
    else Lampa.Listener.follow('app', function (e) { if (e.type == 'ready') initPremium(); });
})();
