(function () {
    'use strict';

    function injectBasicButton() {
        // Шукаємо блок, де лежать кнопки "Дивитися", "Трейлер" і т.д.
        var container = document.querySelector('.full-start__buttons');
        
        if (container && !document.querySelector('.premium-test-btn')) {
            // Створюємо кнопку вручну (базовий HTML)
            var btn = document.createElement('div');
            
            // Додаємо класи Лампи для стилю + свій клас
            btn.className = 'full-start__button selector premium-test-btn view--online_showy';
            
            // Стиль як у Showy (золотий текст, рамка)
            btn.style.border = '1px solid #ffd700';
            btn.style.color = '#ffd700';
            btn.style.padding = '10px 20px';
            btn.style.margin = '5px';
            btn.style.borderRadius = '5px';
            btn.style.cursor = 'pointer';
            btn.style.fontWeight = 'bold';
            
            btn.innerHTML = '⭐ PREMIUM ТЕСТ';

            // Дія при кліку
            btn.onclick = function() {
                alert('Кнопка працює! Дані фільму: ' + (window.Lampa.Activity.active().card.title || 'невідомо'));
            };

            // Вставляємо в початок
            container.insertBefore(btn, container.firstChild);
            
            // Оновлюємо контролер пульта
            if (window.Lampa && Lampa.Controller) Lampa.Controller.toggle('full');
        }
    }

    // Запускаємо перевірку кожну секунду
    setInterval(injectBasicButton, 1000);

    // Додаємо лог в консоль для перевірки
    console.log('Premium Test Plugin: Running...');
})();
