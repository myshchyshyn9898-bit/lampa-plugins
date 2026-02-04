(function () {
    'use strict';
    function init() {
        if (window.premium_inited) return;
        window.premium_inited = true;

        // Додаємо в меню
        Lampa.Menu.add({
            id: 'premium',
            title: 'PREMIUM',
            icon: '<svg height="24" viewBox="0 0 24 24" width="24" fill="gold"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/></svg>',
            onSelect: function () {
                Lampa.Noty.show('Premium працює!');
            }
        });

        // Пошук контейнера для кнопки
        setInterval(function() {
            var container = document.querySelector('.full-start__buttons');
            if (container && !container.querySelector('.premium-btn')) {
                var btn = document.createElement('div');
                btn.className = 'full-start__button selector premium-btn';
                btn.innerHTML = '⭐ PREMIUM';
                btn.style.background = 'gold';
                btn.style.color = 'black';
                btn.style.padding = '10px 20px';
                btn.style.margin = '5px';
                btn.style.borderRadius = '8px';
                btn.style.fontWeight = 'bold';
                
                btn.onclick = function() {
                    Lampa.Noty.show('Шукаю найкращу якість...');
                };

                container.insertBefore(btn, container.firstChild);
                if(window.Lampa.Controller) Lampa.Controller.toggle('full');
            }
        }, 1000);
    }

    if (window.Lampa) init();
    else {
        document.addEventListener('DOMContentLoaded', init);
    }
})();
