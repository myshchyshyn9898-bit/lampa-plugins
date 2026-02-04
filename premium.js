(function () {
    'use strict';

    function PremiumPlugin() {
        // 1. Реєструємо плагін (як це роблять усі робочі моди)
        Lampa.Manifest.plugins = Lampa.Manifest.plugins || {};
        Lampa.Manifest.plugins['premium_simple'] = {
            type: 'video',
            version: '1.0.1',
            name: 'Premium UI',
            description: 'Кнопка фільтрації 4K/Ukr/Rus'
        };

        // 2. Функція пошуку та фільтрації
        var startSearch = function(movie) {
            var parser_url = Lampa.Storage.get('parser_website_url') || 'http://176.9.117.135/api/v1';
            if (parser_url.indexOf('/api/v1') === -1) parser_url = parser_url.replace(/\/$/, "") + '/api/v1';

            Lampa.Loading.start();
            
            Lampa.Network.silent(parser_url + '/search?query=' + encodeURIComponent(movie.title), function(json) {
                Lampa.Loading.stop();
                if (json && json.length) {
                    var html = $('<div><div style="padding: 20px;" class="premium-list"></div></div>');
                    
                    json.forEach(function(item) {
                        var t = item.title.toLowerCase();
                        // Лишаємо тільки те, що ти просив: 4K або Ukr або Rus
                        if (t.indexOf('2160') == -1 && t.indexOf('4k') == -1 && t.indexOf('ukr') == -1 && t.indexOf('ua') == -1 && t.indexOf('rus') == -1 && t.indexOf('ru') == -1) return;

                        var card = $('<div class="selector" style="background: rgba(255,255,255,0.07); margin-bottom: 8px; padding: 12px; border-radius: 6px;">' +
                            '<div style="font-size: 1.1em; font-weight: bold;">' + item.title + '</div>' +
                            '<div style="font-size: 0.8em; color: #aaa;">' + (item.size || '') + '</div>' +
                        '</div>');

                        card.on('hover:enter', function() {
                            Lampa.Modal.close();
                            Lampa.Player.play(item);
                            Lampa.Player.playlist([item]);
                        });

                        html.find('.premium-list').append(card);
                    });

                    Lampa.Modal.open({
                        title: 'Premium: ' + movie.title,
                        html: html,
                        size: 'medium',
                        select: html.find('.selector').first()
                    });
                } else {
                    Lampa.Noty.show('Нічого не знайдено');
                }
            }, function() {
                Lampa.Loading.stop();
                Lampa.Noty.show('Помилка парсера');
            });
        };

        // 3. Додавання кнопки (Чекаємо на відкриття картки фільму)
        Lampa.Listener.follow('full', function (e) {
            if (e.type == 'complite') {
                var container = e.object.activity.render().find('.full-start__buttons');
                
                // Якщо не знайшли стандартний контейнер, шукаємо будь-який з кнопками
                if (container.length == 0) container = e.object.activity.render().find('.button.selector').parent();

                // Якщо кнопки Premium ще немає — додаємо
                if (container.length > 0 && container.find('.premium-btn').length == 0) {
                    var btn = $('<div class="button selector premium-btn" style="background: #d4af37; color: #000; font-weight: bold; margin-bottom: 10px;">💎 Premium</div>');
                    
                    btn.on('hover:enter', function() {
                        startSearch(e.data.movie);
                    });

                    container.prepend(btn);
                }
            }
        });
    }

    // Запуск плагіна
    if (window.Lampa) {
        PremiumPlugin();
    }
})();
