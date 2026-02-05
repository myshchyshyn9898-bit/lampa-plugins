(function () {
    'use strict';

    // 1. Створюємо функцію-обгортку, яку Lampa MX сприймає як "свою"
    function PremiumMod(object) {
        var network = new Lampa.Reguest();
        var scroll  = new Lampa.Scroll({mask: true, over: true});
        
        this.create = function () {
            var _this = this;
            // Це те, що відкриється при натисканні на PREMIUM
            var html = $('<div class="premium-list"></div>');
            var btn  = $('<div class="simple-button selector" style="padding:20px; text-align:center; background:gold; color:black; border-radius:10px; margin:20px; font-weight:bold;">💎 ПОШУК REZKA PREMIUM (4K)</div>');
            
            btn.on('hover:enter', function(){
                Lampa.Noty.show('Запуск пошуку якісної озвучки...');
            });

            html.append(btn);
            return html;
        };

        this.render = function () { return this.create(); };
        this.destroy = function () { network.clear(); };
    }

    // 2. Головна магія: реєстрація плагіна в стилі Modss
    function startPlugin() {
        // Додаємо компонент у ядро
        Lampa.Component.add('premium_mod', PremiumMod);

        // Вставляємо кнопку в картку фільму ПРЯМО в момент побудови інтерфейсу
        Lampa.Listener.follow('full', function (e) {
            if (e.type == 'complite') {
                // Використовуємо класи, які Lampa MX 100% дозволяє (як у Modss)
                var btn = $('<div class="full-start__button selector view--online_modss" style="background: gold !important; color: black !important; font-weight: bold !important; border-radius: 6px !important;"><span>PREMIUM</span></div>');

                btn.on('hover:enter', function () {
                    // Викликаємо наш компонент
                    Lampa.Activity.push({
                        url: '',
                        title: 'Premium',
                        component: 'premium_mod',
                        movie: e.data,
                        page: 1
                    });
                });

                // Шукаємо блок кнопок і ставимо нашу ПЕРШОЮ
                var container = e.object.container.find('.full-start__buttons');
                if (container.length) {
                    container.prepend(btn);
                    // Оновлюємо навігацію пульта
                    Lampa.Controller.toggle('full');
                }
            }
        });
    }

    // Запуск точно за схемою Modss
    if (window.app_ready) startPlugin();
    else {
        Lampa.Listener.follow('app', function (e) {
            if (e.type == 'ready') startPlugin();
        });
    }

})();
