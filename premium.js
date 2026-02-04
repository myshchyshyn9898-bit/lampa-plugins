(function () {
    'use strict';

    function PremiumPlugin() {
        // 1. Повідомлення про життя (з'явиться знизу зліва)
        Lampa.Utils.putMessage('💎 Premium: Ready');

        // 2. Основна логіка
        function addBtn(e) {
            // Шукаємо панель кнопок (у Skaz вона може бути в різних місцях)
            var buttons = $(e.target).find('.full-start__buttons');
            
            if (buttons.length === 0) buttons = $(e.target).find('.full-tools__buttons');
            if (buttons.length === 0) buttons = $(e.target).find('.view--torrent').parent();

            // Якщо кнопку вже додали - виходимо
            if (buttons.find('.premium-super-btn').length > 0) return;

            // Створюємо кнопку (Використовуємо стандартний клас Лампи)
            var btn = $('<div class="premium-super-btn button selector button--shape-rounded button--height-large" style="background: #ffd700; color: #000; font-weight: bold;">💎 Premium</div>');

            // Дія при натисканні
            btn.on('hover:enter', function () {
                var search = Lampa.Activity.active().card.title;
                var url = 'http://176.9.117.135/api/v1/search?query=' + encodeURIComponent(search);
                
                Lampa.Loading.start();
                
                Lampa.Network.silent(url, function (json) {
                    Lampa.Loading.stop();
                    if (json && json.length) {
                        // Фільтруємо і показуємо (спрощено)
                        var html = $('<div><div class="premium-list" style="padding:15px;"></div></div>');
                        json.forEach(function(item) {
                            var title = item.title;
                            // Простий фільтр
                            if(title.toLowerCase().indexOf('ukr') === -1 && title.toLowerCase().indexOf('rus') === -1 && title.indexOf('2160') === -1) return;
                            
                            var b = $('<div class="selector" style="background:rgba(255,255,255,0.1); margin-bottom:5px; padding:10px; border-radius:5px;">'+title+'</div>');
                            b.on('hover:enter', function() {
                                Lampa.Player.play(item);
                                Lampa.Player.playlist([item]);
                            });
                            html.find('.premium-list').append(b);
                        });
                        
                        Lampa.Modal.open({
                            title: 'Premium Search',
                            html: html,
                            size: 'medium',
                            select: html.find('.selector').first()
                        });
                    } else {
                        Lampa.Noty.show('Empty');
                    }
                }, function () {
                    Lampa.Loading.stop();
                    Lampa.Noty.show('Error');
                });
            });

            buttons.prepend(btn);
        }

        // 3. Підписка на події (Як у Showy)
        Lampa.Listener.follow('full', function (e) {
            if (e.type == 'complite') {
                addBtn(e);
            }
        });
    }

    // 4. ЗАВАНТАЖУВАЧ (SHOWY STYLE)
    // Чекаємо, поки Лампа завантажиться, навіть якщо це займе час
    if (!window.Lampa) {
        var timer = setInterval(function () {
            if (window.Lampa) {
                clearInterval(timer);
                PremiumPlugin();
            }
        }, 200);
    } else {
        PremiumPlugin();
    }

})();
