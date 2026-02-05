(function () {
    'use strict';

    // Створюємо плагін як об'єкт - саме так працюють "непробивні" моди
    var PremiumPlugin = {
        name: 'Premium Online',
        version: '1.2.0',
        description: 'Найкраща якість та українська озвучка',
        
        init: function () {
            var _this = this;

            // Додаємо стилі, які точно відобразяться
            $('body').append('<style>.premium-btn-mod{background:linear-gradient(135deg,#ffd700,#ff8c00)!important;color:#000!important;font-weight:bold!important;border-radius:4px!important;display:inline-flex!important;align-items:center;justify-content:center;padding:10px 18px!important;margin:5px!important;cursor:pointer;border:none!important;text-transform:uppercase;font-size:12px}.premium-btn-mod.focus{background:#fff!important;box-shadow:0 0 10px gold!important;transform:scale(1.05)}</style>');

            // Реєструємо компонент у системі
            Lampa.Component.add('premium_component', this.component);

            // Використовуємо універсальний Listener
            Lampa.Listener.follow('full', function (e) {
                if (e.type == 'complite') {
                    _this.inject(e);
                }
            });
        },

        inject: function (e) {
            var _this = this;
            // Шукаємо контейнер кнопок через контекст об'єкта
            var container = e.object.container.find('.full-start__buttons');
            
            if (container.length && !container.find('.premium-btn-mod').length) {
                var btn = $('<div class="full-start__button selector premium-btn-mod">⭐ Premium</div>');

                btn.on('hover:enter click', function () {
                    Lampa.Activity.push({
                        title: 'Premium',
                        component: 'premium_component',
                        movie: e.data,
                        page: 1
                    });
                });

                // Вставляємо на самий початок
                container.prepend(btn);
                
                // Оновлюємо навігацію
                if (window.Lampa.Controller) Lampa.Controller.toggle('full');
            }
        },

        component: function (object) {
            this.create = function () {
                var html = $('<div class="premium-menu-select" style="text-align:center;padding:20px;">' +
                                '<h2 style="color:gold;">ОБЕРІТЬ ВАРІАНТ</h2>' +
                                '<div class="selector" style="padding:20px;background:rgba(255,255,255,0.1);margin-top:20px;border-radius:10px;">🇺🇦 Українська (Rezka 4K)</div>' +
                                '<div class="selector" style="padding:20px;background:rgba(255,255,255,0.1);margin-top:10px;border-radius:10px;">🌍 Original Quality</div>' +
                            '</div>');
                
                html.find('.selector').on('hover:enter', function() {
                    Lampa.Noty.show('Пошук активовано...');
                });

                return html;
            };
            this.render = function () { return this.create(); };
            this.destroy = function () {};
        }
    };

    // Запуск через глобальний об'єкт Lampa
    if (window.Lampa) {
        PremiumPlugin.init();
    } else {
        Lampa.Listener.follow('app', function (e) {
            if (e.type == 'ready') PremiumPlugin.init();
        });
    }

})();
