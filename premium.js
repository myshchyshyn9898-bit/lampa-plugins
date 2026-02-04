(function () {
    'use strict';

    function initPremium() {
        // 1. ПЕРЕВІРКА: Якщо цей текст з'явиться вгорі - значить JS виконується!
        var testDiv = document.createElement('div');
        testDiv.innerHTML = 'PREMIUM LOADED';
        testDiv.style = 'position:fixed;top:0;right:0;background:red;color:white;z-index:9999;padding:5px;font-size:10px;';
        document.body.appendChild(testDiv);
        setTimeout(function(){ if(testDiv) testDiv.remove(); }, 5000);

        try {
            // 2. Додаємо в меню через офіційний метод
            if (window.Lampa && Lampa.Menu) {
                Lampa.Menu.add({
                    id: 'premium_plugin',
                    title: 'PREMIUM',
                    icon: '<svg height="24" viewBox="0 0 24 24" width="24" fill="gold"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/></svg>',
                    onSelect: function () {
                        Lampa.Noty.show('Premium працює!');
                    }
                });
            }

            // 3. Слідкуємо за кнопками в картці (чистий JS + jQuery для страховки)
            setInterval(function() {
                var containers = document.querySelectorAll('.full-start__buttons, .movie-full__buttons');
                containers.forEach(function(container) {
                    if (!container.querySelector('.premium-btn-gold')) {
                        var btn = document.createElement('div');
                        btn.className = 'full-start__button selector premium-btn-gold';
                        btn.innerHTML = '⭐ PREMIUM';
                        btn.style = 'background:linear-gradient(135deg, #ffd700, #ff8c00)!important;color:black!important;padding:10px 15px;border-radius:8px;margin:5px;font-weight:bold;cursor:pointer;display:flex;align-items:center;';
                        
                        btn.onclick = function() {
                            Lampa.Noty.show('Шукаю найкращу якість...');
                        };
                        
                        container.insertBefore(btn, container.firstChild);
                        if(window.Lampa && Lampa.Controller) Lampa.Controller.toggle('full');
                    }
                });
            }, 1000);

        } catch (e) {
            console.error('Premium Error:', e);
        }
    }

    // Спроба запуску через всі можливі дірки
    if (window.app_ready) initPremium();
    else {
        // Слухаємо ініціалізацію Lampa
        if (window.Lampa) {
            Lampa.Listener.follow('app', function (e) {
                if (e.type == 'ready') initPremium();
            });
        }
        // Резервний запуск через 3 та 6 секунд
        setTimeout(initPremium, 3000);
        setTimeout(initPremium, 6000);
    }
})();
