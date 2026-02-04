(function () {
    'use strict';

    function Premium(object) {
        var network = new Lampa.Reguest();
        var scroll  = new Lampa.Scroll({mask: true, over: true});
        var files   = new Lampa.Explorer(object);
        
        this.create = function () {
            var _this = this;
            // Створюємо заголовок меню (як у Modss або Showy)
            var html = $('<div class="premium-list"></div>');
            
            // Наш золотий банер вибору
            var banner = $(`
                <div class="selector" style="padding: 20px; background: linear-gradient(135deg, #ffd700, #ff8c00); color: #000; border-radius: 10px; margin: 10px; text-align: center; font-weight: bold;">
                    💎 ПРЕМІУМ ВИБІР ЯКОСТІ (UKR/4K)
                </div>
            `);

            banner.on('hover:enter', function(){
                Lampa.Noty.show('Шукаю найкращі варіанти на Rezka...');
            });

            html.append(banner);
            scroll.append(html);

            return scroll.render();
        };

        this.render = function () {
            return scroll.render();
        };

        this.destroy = function () {
            network.clear();
            scroll.destroy();
        };
    }

    // Головна логіка ініціалізації в стилі And7ey
    function startPlugin() {
        window.premium_online = true;

        // Реєструємо компонент
        Lampa.Component.add('premium_online', Premium);

        // Додаємо кнопку в картку фільму (метод And7ey)
        Lampa.Listener.follow('full', function (e) {
            if (e.type == 'complite') {
                var btn = $(`
                    <div class="full-start__button selector premium-button" style="background: #ffd700 !important; color: #000 !important; font-weight: bold !important; border-radius: 8px !important;">
                        <span>Premium</span>
                    </div>
                `);

                btn.on('hover:enter', function () {
                    Lampa.Activity.push({
                        url: '',
                        title: 'Premium',
                        component: 'premium_online',
                        movie: e.data,
                        page: 1
                    });
                });

                // Шукаємо кнопку трейлера або торрентів і ставимо нашу ПЕРЕД ними
                var target = e.object.container.find('.view--torrent, .view--trailer').first();
                if (target.length) target.before(btn);
                else e.object.container.find('.full-start__buttons').append(btn);
                
                Lampa.Controller.toggle('full');
            }
        });
    }

    // Запуск через перевірку готовності додатка
    if (window.app_ready) startPlugin();
    else {
        Lampa.Listener.follow('app', function (e) {
            if (e.type == 'ready') startPlugin();
        });
    }
})();
