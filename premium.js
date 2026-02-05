(function () {
    'use strict';

    // 1. ДІАГНОСТИКА: Блимання фоном (якщо це спрацює - JS живий)
    document.body.style.backgroundColor = '#1a1a1a';
    setTimeout(function() { document.body.style.backgroundColor = ''; }, 1000);

    function forceInject() {
        // Шукаємо блок кнопок, як у працюючого MODS's (твій скріншот 4)
        var footer = document.querySelector('.full-start__buttons');
        
        if (footer && !document.querySelector('.premium-btn-final')) {
            var btn = document.createElement('div');
            // Використовуємо класи, які Лампа точно знає
            btn.className = 'full-start__button selector premium-btn-final view--online_modss';
            btn.style.background = 'gold';
            btn.style.color = 'black';
            btn.style.padding = '10px 15px';
            btn.style.margin = '5px';
            btn.style.borderRadius = '6px';
            btn.style.fontWeight = 'bold';
            btn.innerHTML = '⭐ PREMIUM';

            btn.onclick = function() {
                window.Lampa.Noty.show('ПРАЦЮЄ! Дані фільму підтягнуто.');
            };

            footer.insertBefore(btn, footer.firstChild);
            
            if (window.Lampa && Lampa.Controller) Lampa.Controller.toggle('full');
        }
    }

    // Перевіряємо екран кожну секунду (для ТВ це найнадійніше)
    setInterval(forceInject, 1000);
})();
