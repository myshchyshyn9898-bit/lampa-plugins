(function () {
    // 1. ПЕРЕВІРКА ЗАВАНТАЖЕННЯ (якщо файл завантажився, екран на 1 сек стане червоним)
    // Це потрібно, щоб зрозуміти, чи взагалі Лампа виконує цей файл.
    document.body.style.border = "5px solid gold";
    setTimeout(function() { document.body.style.border = "none"; }, 2000);

    console.log('Premium Plugin: Loaded');

    function init() {
        // Додаємо пункт меню через затримку, щоб Лампа встигла ініціалізуватися
        setTimeout(function() {
            if (window.Lampa && Lampa.Menu) {
                Lampa.Menu.add({
                    id: 'premium_menu',
                    title: 'PREMIUM',
                    icon: '<svg height="24" viewBox="0 0 24 24" width="24" fill="gold"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/></svg>',
                    onSelect: function () {
                        Lampa.Noty.show('Premium працює!');
                    }
                });
            }
        }, 3000);

        // Постійний цикл пошуку кнопок у картці фільму
        setInterval(function() {
            // Шукаємо блок кнопок
            var container = $('.full-start__buttons, .movie-full__buttons, .buttons__list');
            
            if (container.length > 0 && !container.find('.premium-btn').length) {
                var btn = $('<div class="premium-btn selector" style="background:linear-gradient(135deg, #ffd700, #ff8c00)!important; color:black!important; padding:12px 20px; border-radius:10px; margin:10px 5px; font-weight:bold; cursor:pointer; display:flex; align-items:center; justify-content:center; z-index:999;">⭐ PREMIUM</div>');
                
                btn.on('click', function() {
                    Lampa.Select.show({
                        title: 'Premium Якість',
                        items: [
                            {title: '🇺🇦 Українська (Rezka)', quality: '4K'},
                            {title: '🌍 Original (Full HD)', quality: '1080p'}
                        ],
                        onSelect: function(item) {
                            Lampa.Noty.show('Шукаю: ' + item.title);
                        },
                        onBack: function(){ Lampa.Controller.toggle('full'); }
                    });
                });

                container.prepend(btn);
                if(window.Lampa && Lampa.Controller) Lampa.Controller.toggle('full');
            }
        }, 1000);
    }

    // Запускаємо відразу
    if (document.readyState === 'complete') init();
    else window.addEventListener('load', init);

    // Дублюємо запуск через 5 секунд про всяк випадок
    setTimeout(init, 5000);

})();
