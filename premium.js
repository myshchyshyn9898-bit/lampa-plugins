(function () {
    'use strict';

    // 1. Створюємо основну функцію плагіна
    function PremiumPlugin() {
        this.create = function () {
            // Слухаємо відкриття картки фільму
            Lampa.Listener.follow('full', (e) => {
                if (e.type == 'complite') this.addButton(e);
            });
        };

        this.addButton = function (e) {
            // Створюємо саму кнопку "Premium"
            let btn = $(`
                <div class="full-start__button selector premium-btn">
                    <svg height="24" viewBox="0 0 24 24" width="24" style="fill: #ffd700; margin-right: 10px;">
                        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
                    </svg>
                    <span>Premium</span>
                </div>
            `);

            // Додаємо дію при натисканні
            btn.on('hover:enter', () => {
                this.openMenu(e.data);
            });

            // Вставляємо в блок кнопок
            e.object.container.find('.full-start__buttons').append(btn);
        };

        this.openMenu = function (data) {
            // Тут буде наше круте меню вибору
            Lampa.Select.show({
                title: 'Premium Якість для: ' + (data.title || data.name),
                items: [
                    { title: '🇺🇦 Українська озвучка (4K)', quality: '2160p', source: 'rezka' },
                    { title: '🇺🇦 Українська озвучка (HD)', quality: '1080p', source: 'ashdi' },
                    { title: '🇬🇧 English Original', quality: '1080p', source: 'alloha' }
                ],
                onSelect: (item) => {
                    Lampa.Noty.show('Шукаю ' + item.quality + ' на ' + item.source + '...');
                    // Тут викличемо функцію пошуку посилань
                }
            });
        };
    }

    // Запуск
    if (window.app_ready) new PremiumPlugin().create();
    else {
        Lampa.Listener.follow('app', function (e) {
            if (e.type == 'ready') new PremiumPlugin().create();
        });
    }
})();
