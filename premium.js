(function () {
    'use strict';

    function PremiumAction() {
        // 1. Повідомлення відразу (якщо його нема - плагін не запустився)
        if (window.Lampa) {
            Lampa.Noty.show('Premium Plugin Loaded');
        }

        // 2. Функція пошуку
        var doSearch = function (movie) {
            var url = Lampa.Storage.get('parser_website_url') || 'http://torlook.info/api/v1';
            if (url.indexOf('api/v1') === -1) url = url.replace(/\/$/, "") + '/api/v1';

            Lampa.Loading.start();
            Lampa.Network.silent(url + '/search?query=' + encodeURIComponent(movie.title), function (json) {
                Lampa.Loading.stop();
                if (json && json.length) {
                    var list = $('<div><div style="padding: 20px;" class="premium-list"></div></div>');
                    json.forEach(function (item) {
                        var t = item.title.toLowerCase();
                        // Тільки 4К або Укр або Рус
                        if (t.indexOf('2160') == -1 && t.indexOf('4k') == -1 && t.indexOf('ukr') == -1 && t.indexOf('ua') == -1 && t.indexOf('rus') == -1 && t.indexOf('ru') == -1) return;

                        var row = $('<div class="selector" style="background: rgba(255,255,255,0.1); margin-bottom: 5px; padding: 10px; border-radius: 5px;">' +
                            '<div style="font-weight: bold;">' + item.title + '</div>' +
                            '<div style="font-size: 0.8em; color: #ccc;">' + (item.size || '') + '</div>' +
                        '</div>');

                        row.on('hover:enter', function () {
                            Lampa.Modal.close();
                            Lampa.Player.play(item);
                            Lampa.Player.playlist([item]);
                        });
                        list.find('.premium-list').append(row);
                    });
                    Lampa.Modal.open({ title: 'Premium: ' + movie.title, html: list, size: 'medium', select: list.find('.selector').first() });
                } else {
                    Lampa.Noty.show('Пусто');
                }
            }, function () {
                Lampa.Loading.stop();
                Lampa.Noty.show('Помилка парсера');
            });
        };

        // 3. Вставка кнопки (Метод Showy)
        Lampa.Listener.follow('full', function (e) {
            if (e.type == 'complite' || e.type == 'ready') {
                // Чекаємо півсекунди, щоб Skaz встиг намалювати свої кнопки
                setTimeout(function () {
                    var render = e.object.activity.render();
                    
                    // Шукаємо по класу "view--showy" (який ми бачимо на твоєму фото)
                    var target = render.find('.view--showy, .view--mods, .full-start__buttons').first();

                    if (target.length > 0 && render.find('.premium-final-btn').length == 0) {
                        var btn = $('<div class="button selector premium-final-btn" style="background: #f1c40f; color: #000; font-weight: bold;">💎 Premium</div>');
                        
                        btn.on('hover:enter', function () {
                            doSearch(e.data.movie);
                        });

                        // Ставимо ПЕРЕД Showy
                        target.before(btn);
                    }
                }, 500);
            }
        });
    }

    // Запуск (максимально просто)
    if (window.Lampa) PremiumAction();
    else {
        var wait = setInterval(function() {
            if (window.Lampa) {
                clearInterval(wait);
                PremiumAction();
            }
        }, 500);
    }
})();
