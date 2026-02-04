(function () {
    'use strict';

    function startPremium() {
        // 1. Спробуємо додати кнопку в БІЧНЕ МЕНЮ (це спрацює всюди)
        Lampa.Listener.follow('app', function (e) {
            if (e.type == 'ready' || window.app_ready) {
                
                // Додаємо пункт у головне меню
                Lampa.Menu.add({
                    id: 'premium_section',
                    title: 'PREMIUM',
                    icon: '<svg height="24" viewBox="0 0 24 24" width="24" fill="gold"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/></svg>',
                    onSelect: function () {
                        Lampa.Noty.show('Premium Сервіс активовано!');
                    }
                });

                // 2. Спробуємо "силою" вставити кнопку в картку фільму через кожні 2 секунди
                setInterval(function() {
                    // Перевіряємо всі можливі класи кнопок у Lampa MX
                    var selectors = ['.full-start__buttons', '.buttons__list', '.movie-full__buttons', '.full-start__actions'];
                    
                    selectors.forEach(function(sel) {
                        var container = $(sel);
                        if (container.length > 0 && container.find('.premium-btn').length === 0) {
                            var btn = $('<div class="premium-btn selector" style="background: gold !important; color: black !important; padding: 10px 15px; margin: 5px; border-radius: 8px; font-weight: bold; cursor: pointer; display: inline-block;">⭐ PREMIUM</div>');
                            
                            btn.on('click', function() {
                                Lampa.Noty.show('Пошук Rezka Premium...');
                            });

                            container.prepend(btn);
                            console.log('Premium Button Injected into: ' + sel);
                        }
                    });
                }, 2000);
            }
        });
    }

    try {
        startPremium();
    } catch (err) {
        console.error("Premium Plugin Error: " + err);
    }
})();
