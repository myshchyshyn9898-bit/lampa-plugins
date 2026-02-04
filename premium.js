(function () {
    'use strict';

    // Функція, яка спрацює 100%, якщо файл завантажився
    function startDiagnostic() {
        console.log('Premium Plugin: Start Diagnostic');
        
        // Виводимо повідомлення в самій Лампі
        setTimeout(function() {
            if (window.Lampa && Lampa.Noty) {
                Lampa.Noty.show('Premium Плагін підключено!');
            } else {
                alert('Плагін завантажився, але API Lampa не знайдено');
            }
        }, 2000);

        // Спроба знайти будь-яке місце для кнопки
        setInterval(function() {
            // Перевіряємо всі можливі варіанти назв контейнерів у різних версіях
            var selectors = [
                '.full-start__buttons', 
                '.full-start__actions', 
                '.movie-full__buttons',
                '.buttons__list'
            ];
            
            selectors.forEach(function(sel) {
                var container = $(sel);
                if (container.length > 0 && container.find('.premium-btn').length === 0) {
                    console.log('Found container:', sel);
                    var btn = $('<div class="premium-btn selector" style="background: gold; color: black; padding: 10px; margin: 5px; border-radius: 5px; cursor: pointer; font-weight: bold; text-align: center;">⭐ PREMIUM</div>');
                    
                    btn.on('click', function() {
                        alert('Premium працює!');
                    });

                    container.append(btn);
                    if(window.Lampa && Lampa.Controller) Lampa.Controller.toggle('full');
                }
            });
        }, 1000);
    }

    // Запуск без зайвих перевірок
    try {
        startDiagnostic();
    } catch (e) {
        console.error('Plugin error:', e);
    }
})();
