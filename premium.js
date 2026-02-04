(function () {
    'use strict';

    // Створюємо плагін як об'єкт
    var PremiumPlugin = {
        name: 'Premium Online',
        version: '1.1.0',
        description: 'Найкраща якість та українська озвучка',
        
        // Функція ініціалізації
        init: function () {
            var _this = this;

            // Додаємо стилі один раз
            if (!$('#premium-styles').length) {
                $('body').append('<style id="premium-styles">' +
                    '.premium-gold-btn { background: linear-gradient(135deg, #ffd700, #ff8c00) !important; color: #000 !important; font-weight: bold !important; border-radius: 8px !important; display: inline-flex !important; align-items: center; justify-content: center; padding: 12px 24px !important; margin: 10px 5px !important; cursor: pointer; border: none !important; }' +
                    '.premium-gold-btn.focus { transform: scale(1.1); background: #fff !important; box-shadow: 0 0 20px gold !important; }' +
                    '</style>');
            }

            // Слухаємо відкриття картки фільму
            Lampa.Listener.follow('full', function (e) {
                if (e.type == 'complite') {
                    _this.addButton(e);
                }
            });
        },

        // Додавання кнопки
        addButton: function (e) {
            var _this = this;
            // Шукаємо блок кнопок. У нових версіях MX це .full-start__buttons
            var container = e.object.container.find('.full-start__buttons');
            
            if (container.length && !container.find('.premium-gold-btn').length) {
                var btn = $('<div class="full-start__button selector premium-gold-btn">⭐ PREMIUM</div>');

                btn.on('hover:enter click', function () {
                    _this.openMenu(e.data);
                });

                // Вставляємо перед кнопкою "Дивитися" (Смотреть)
                container.prepend(btn);
                
                // Примусово оновлюємо контролер
                Lampa.Controller.toggle('full');
            }
        },

        // Меню вибору
        openMenu: function (data) {
            Lampa.Select.show({
                title: 'Premium Якість: ' + (data.movie.title || data.movie.name),
                items: [
                    { title: '🇺🇦 Українська (Rezka 4K)', quality: '4K', source: 'rezka' },
                    { title: '🇺🇦 Українська (Ashdi 1080p)', quality: '1080p', source: 'ashdi' },
                    { title: '🌍 Original (Найкращий бітрейт)', quality: 'Max', source: 'alloha' }
                ],
                onSelect: function (item) {
                    Lampa.Noty.show('Пошук ' + item.title + ' активується...');
                },
                onBack: function () {
                    Lampa.Controller.toggle('full');
                }
            });
        }
    };

    // Запуск через перевірку Lampa
    try {
        if (window.Lampa) {
            PremiumPlugin.init();
        } else {
            Lampa.Listener.follow('app', function (e) {
                if (e.type == 'ready') PremiumPlugin.init();
            });
        }
    } catch (err) {
        console.error('Premium Plugin Error:', err);
    }

})();
