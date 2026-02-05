(function () {
    'use strict';

    function startPremium() {
        // Додаємо стилі, імітуючи системні
        $('body').append('<style>.premium-btn{background:#ffd700!important;color:#000!important;padding:10px 15px!important;margin:5px!important;border-radius:5px!important;font-weight:bold!important;display:inline-block!important;cursor:pointer}.premium-btn.focus{background:#fff!important;box-shadow:0 0 15px gold!important}</style>');

        // Використовуємо MutationObserver - він бачить появу кнопок навіть якщо Lampa мовчить
        var observer = new MutationObserver(function(mutations) {
            // Шукаємо блок кнопок у картці фільму
            var container = $('.full-start__buttons, .movie-full__buttons, .buttons__list');
            
            if (container.length > 0 && !container.find('.premium-btn').length) {
                var btn = $('<div class="full-start__button selector premium-btn">⭐ PREMIUM</div>');

                btn.on('click hover:enter', function() {
                    Lampa.Select.show({
                        title: 'Premium Якість',
                        items: [
                            {title: '🇺🇦 Rezka (Українська 4K)', quality: '4K'},
                            {title: '🌍 Original (Full HD)', quality: '1080p'}
                        ],
                        onSelect: function(item) {
                            Lampa.Noty.show('Шукаю: ' + item.title);
                        },
                        onBack: function(){ Lampa.Controller.toggle('full'); }
                    });
                });

                // Вставляємо в початок
                container.prepend(btn);
                
                // Оновлюємо навігацію
                if(window.Lampa && Lampa.Controller) Lampa.Controller.toggle('full');
            }
        });

        observer.observe(document.body, {childList: true, subtree: true});
    }

    // Запуск через примусовий таймер (ігноруємо статус завантаження)
    setTimeout(startPremium, 2000);
    setTimeout(startPremium, 5000);
})();
