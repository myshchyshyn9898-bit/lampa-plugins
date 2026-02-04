(function () {
    'use strict';

    // 1. СТИЛІ (Premium Design)
    var style = `
        <style>
            .premium-btn-gold {
                display: flex;
                align-items: center;
                justify-content: center;
                background: linear-gradient(135deg, #ffd700 0%, #ff8c00 100%) !important;
                color: #000 !important;
                padding: 12px 24px !important;
                border-radius: 10px !important;
                margin: 10px 5px !important;
                cursor: pointer;
                font-weight: bold !important;
                transition: all 0.2s ease;
                box-shadow: 0 4px 15px rgba(255, 140, 0, 0.3);
            }
            .premium-btn-gold.focus {
                transform: scale(1.05);
                background: #fff !important;
                box-shadow: 0 0 20px rgba(255, 215, 0, 0.6);
            }
            .premium-btn-gold svg {
                margin-right: 10px;
                fill: #000;
            }
        </style>
    `;

    function startPlugin() {
        if (!$('body').find('#premium-styles').length) {
            $('body').append('<div id="premium-styles">' + style + '</div>');
        }

        // Функція створення кнопки
        function injectButton(container, movieData) {
            if (container.find('.premium-btn-gold').length) return;

            var btn = $('<div class="full-start__button selector premium-btn-gold">' +
                '<svg width="20" height="20" viewBox="0 0 24 24"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/></svg>' +
                '<span>PREMIUM</span>' +
            '</div>');

            btn.on('click hover:enter', function () {
                openPremiumMenu(movieData);
            });

            // Вставляємо на початок списку кнопок
            container.prepend(btn);
            
            // Оновлюємо навігацію, щоб пульт бачив кнопку
            if (window.Lampa && Lampa.Controller) Lampa.Controller.toggle('full');
        }

        // Стежимо за змінами на екрані (для Lampa MX це найнадійніше)
        var observer = new MutationObserver(function (mutations) {
            var container = $('.full-start__buttons');
            if (container.length) {
                // Дістаємо дані фільму з активної активності Lampa
                var movie = Lampa.Activity.active().card || Lampa.Activity.active().movie;
                if (movie) injectButton(container, movie);
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    function openPremiumMenu(movie) {
        Lampa.Select.show({
            title: '💎 Premium Вибір: ' + (movie.title || movie.name),
            items: [
                { title: '🇺🇦 Українська озвучка (4K)', quality: '4K', voice: 'ukr' },
                { title: '🇺🇦 Українська озвучка (1080p)', quality: 'HD', voice: 'ukr' },
                { title: '🎬 Оригінал (найкраща якість)', quality: 'Max', voice: 'orig' },
                { title: '🇷🇺 Російська озвучка', quality: 'HD', voice: 'rus' }
            ],
            onSelect: function (item) {
                Lampa.Noty.show('Шукаю ' + item.title + ' на Rezka...');
                
                // Викликаємо твій основний компонент пошуку
                Lampa.Component.add('premium_search', function(object) {
                    // Тут логіка твого великого плагіна
                });

                Lampa.Activity.push({
                    url: '',
                    component: 'premium_search',
                    movie: movie,
                    page: 1
                });
            },
            onBack: function () {
                Lampa.Controller.toggle('full');
            }
        });
    }

    // Запуск
    if (window.app_ready) startPlugin();
    else {
        Lampa.Listener.follow('app', function (e) {
            if (e.type == 'ready') startPlugin();
        });
    }
})();
