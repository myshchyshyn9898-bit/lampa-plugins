(function () {
    'use strict';

    function initPremium() {
        console.log('Premium Plugin: Initialized');

        // Таймер, який постійно перевіряє, чи ми в картці фільму
        setInterval(function() {
            // Шукаємо блок з кнопками
            var container = $('.full-start__buttons');
            
            // Якщо знайшли контейнер і там ще немає нашої кнопки
            if (container.length > 0 && container.find('.premium-btn').length === 0) {
                console.log('Premium Plugin: Container found, adding button...');
                
                var btn = $('<div class="full-start__button selector premium-btn" style="background: #ffd700 !important; color: #000 !important; padding: 10px 20px; border-radius: 8px; margin: 10px 5px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: transform 0.2s;">' +
                                '<span style="font-weight: bold; font-size: 16px;">⭐ PREMIUM</span>' +
                            '</div>');

                btn.on('click hover:enter', function() {
                    openPremiumMenu();
                });

                container.append(btn);
                
                // Оновлюємо навігацію пульта
                if(window.Lampa && Lampa.Controller) Lampa.Controller.toggle('full');
            }
        }, 500);
    }

    function openPremiumMenu() {
        Lampa.Select.show({
            title: 'Premium Вибір',
            items: [
                { title: '🇺🇦 Rezka (UKR)', quality: '1080p' },
                { title: '🎥 HDRezka (4K)', quality: '2160p' }
            ],
            onSelect: function(item) {
                Lampa.Noty.show('Шукаю: ' + item.title);
            },
            onBack: function() {
                Lampa.Controller.toggle('full');
            }
        });
    }

    // Запускаємо негайно
    if (window.app_ready) {
        initPremium();
    } else {
        $(document).on('app:ready', initPremium);
        // Резервний запуск через 3 секунди
        setTimeout(initPremium, 3000);
    }
})();
