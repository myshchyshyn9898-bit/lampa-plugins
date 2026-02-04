(function () {
    'use strict';

    function init() {
        // 1. Реєструємо компонент (як у твоєму прикладі)
        Lampa.Component.add('premium_search', function (object) {
            var network = new Lampa.Reguest();
            var scroll = new Lampa.Scroll({mask: true, over: true});
            var files = new Lampa.Explorer(object);

            this.create = function () {
                var _this = this;
                // Тут логіка відображення списку озвучок/якості
                var html = $('<div><div class="simple-button selector" style="width:100%; text-align:center; padding: 20px; background: gold; color: black; border-radius: 10px;">Шукаю найкращу якість для: ' + object.movie.title + '</div></div>');
                
                html.find('.selector').on('hover:enter', function(){
                    Lampa.Noty.show('Пошук на Rezka активовано...');
                });

                return html;
            };

            this.render = function () {
                return scroll.render();
            };

            this.destroy = function () {
                network.clear();
                scroll.destroy();
            };
        });

        // 2. Додаємо кнопку в головне меню
        Lampa.Menu.add({
            id: 'premium_menu',
            title: 'PREMIUM',
            icon: '<svg height="24" viewBox="0 0 24 24" width="24" fill="gold"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/></svg>',
            onSelect: function () {
                Lampa.Noty.show('Premium Plugin Ready');
            }
        });

        // 3. Автоматичне додавання кнопки в картку фільму (твоя ідея + надійний селектор)
        Lampa.Listener.follow('full', function (e) {
            if (e.type == 'complite') {
                var container = e.object.container.find('.full-start__buttons');
                if (container.length && !container.find('.premium-btn').length) {
                    var btn = $('<div class="full-start__button selector premium-btn" style="background: linear-gradient(135deg, #ffd700, #ff8c00) !important; color: #000 !important; font-weight: bold !important; border-radius: 8px !important; display: flex; align-items: center; padding: 10px 15px; margin: 5px;">⭐ PREMIUM</div>');

                    btn.on('hover:enter', function () {
                        // Відкриваємо наш зареєстрований компонент
                        Lampa.Activity.push({
                            url: '',
                            title: 'Premium Пошук',
                            component: 'premium_search',
                            movie: e.data,
                            page: 1
                        });
                    });

                    container.prepend(btn);
                    Lampa.Controller.toggle('full');
                }
            }
        });
    }

    // Правильна перевірка завантаження
    if (window.Lampa) {
        init();
    } else {
        Lampa.Listener.follow('app', function (e) {
            if (e.type == 'ready') init();
        });
    }
})();
