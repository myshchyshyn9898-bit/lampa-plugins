(function () {
    'use strict';

    function init() {
        // 1. СТВОРЮЄМО КНОПКУ-ПРИВИД (вона з'явиться всюди, де є опис фільму)
        setInterval(function() {
            // Шукаємо ГОЛОВНИЙ контейнер картки (він є у всіх версіях)
            var card = $('.full-start, .movie-full, .full-movie');
            
            if (card.length > 0 && !$('.premium-wrapper').length) {
                console.log('Premium: Card found!');
                
                var premiumBlock = $(`
                    <div class="premium-wrapper selector" style="width: 100%; margin-bottom: 20px; z-index: 999; position: relative;">
                        <div style="background: linear-gradient(135deg, #ffd700 0%, #ff8c00 100%); 
                                    color: #000; padding: 15px; border-radius: 12px; 
                                    text-align: center; font-weight: bold; font-size: 1.2em;
                                    box-shadow: 0 5px 15px rgba(0,0,0,0.5);">
                            💎 PREMIUM: ВИБРАТИ УКРАЇНСЬКУ ОЗВУЧКУ (4K)
                        </div>
                    </div>
                `);

                premiumBlock.on('click hover:enter', function() {
                    Lampa.Noty.show('Шукаю найкращу якість...');
                    openPremiumMenu();
                });

                // Вставляємо в самий верх опису фільму
                card.prepend(premiumBlock);
                
                // Оновлюємо пульт
                Lampa.Controller.toggle('full');
            }
        }, 1000);
    }

    function openPremiumMenu() {
        var movie = Lampa.Activity.active().card || Lampa.Activity.active().movie;
        Lampa.Select.show({
            title: 'Premium Якість',
            items: [
                { title: '🇺🇦 Rezka (Українська 4K)', quality: '4K' },
                { title: '🇺🇦 Ashdi (Українська Full HD)', quality: '1080p' },
                { title: '🌍 Original (Найкращий бітрейт)', quality: 'UHD' }
            ],
            onSelect: function(item) {
                Lampa.Noty.show('Запуск ' + item.title);
            },
            onBack: function() { Lampa.Controller.toggle('full'); }
        });
    }

    // РЕЄСТРАЦІЯ (як у робочих плагінах)
    Lampa.Component.add('premium_online', function() {}); 
    
    if (window.app_ready) init();
    else Lampa.Listener.follow('app', function (e) { if (e.type == 'ready') init(); });

    // ПРИМУСОВИЙ ЗАПУСК
    setTimeout(init, 3000);
})();
