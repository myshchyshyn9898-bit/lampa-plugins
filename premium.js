(function () {
    'use strict';

    function initPremium() {
        // Унікальна назва для реєстрації
        Lampa.Component.add('premium_custom_search', function (object) {
            this.create = function () {
                var html = $('<div><div class="selector" style="padding:40px; text-align:center; background:gold; color:black; border-radius:15px; font-size:20px; font-weight:bold;">💎 PREMIUM: ШУКАЮ В ОБОХ БАЗАХ (UKR/4K)</div></div>');
                return html;
            };
            this.render = function () { return $('<div></div>').append(this.create()); };
            this.destroy = function () {};
        });

        // Офіційне додавання в меню
        Lampa.Menu.add({
            id: 'premium_unique_id',
            title: 'PREMIUM',
            icon: '<svg height="24" viewBox="0 0 24 24" width="24" fill="gold"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/></svg>',
            onSelect: function () {
                Lampa.Noty.show('Premium Сервіс активовано!');
            }
        });

        // Додавання кнопки в картку
        Lampa.Listener.follow('full', function (e) {
            if (e.type == 'complite') {
                var container = e.object.container.find('.full-start__buttons');
                if (container.length && !container.find('.premium-btn').length) {
                    var btn = $('<div class="full-start__button selector premium-btn" style="background:linear-gradient(135deg, #ffd700, #ff8c00)!important; color:black!important; font-weight:bold!important; border-radius:8px!important;">⭐ PREMIUM</div>');
                    btn.on('hover:enter', function () {
                        Lampa.Activity.push({
                            title: 'Premium',
                            component: 'premium_custom_search',
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

    if (window.app_ready) initPremium();
    else Lampa.Listener.follow('app', function (e) { if (e.type == 'ready') initPremium(); });
})();
