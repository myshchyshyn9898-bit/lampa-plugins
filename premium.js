(function () {
    'use strict';

    // Повідомлення при завантаженні (як у нормальних плагінів)
    if (window.Lampa) {
        Lampa.Utils.putMessage('✅ Premium Plugin підключено');
    }

    function startPlugin() {
        var _this = this;

        // Логіка фільтрації (спрощена і надійна)
        function getBestTorrents(items) {
            var result = [];
            if (!items || !items.length) return result;

            items.forEach(function(item) {
                if (!item || !item.title) return;
                var title = String(item.title).toLowerCase();
                
                // Шукаємо наші мови
                var isUkr = title.indexOf('ukr') !== -1 || title.indexOf('ua') !== -1 || title.indexOf('укр') !== -1;
                var isRus = title.indexOf('rus') !== -1 || title.indexOf('ru') !== -1 || title.indexOf('рус') !== -1;
                
                // Шукаємо високу якість
                var is4K = title.indexOf('2160') !== -1 || title.indexOf('4k') !== -1;
                var is1080 = title.indexOf('1080') !== -1;

                var label = 'Інше';
                var color = 'white';

                if (isUkr) label = '🇺🇦 UKR';
                else if (isRus) label = '🇷🇺 RUS';

                if (is4K) {
                    label += ' [4K]';
                    color = '#FFD700'; // Золотий
                } else if (is1080) {
                    label += ' [1080p]';
                    color = '#ADFF2F'; // Салатовий
                }

                // Додаємо в список
                result.push({
                    title: label,
                    sub: (item.size || '') + ' • ' + item.title,
                    quality_score: (is4K ? 10 : 0) + (is1080 ? 5 : 0) + (isUkr ? 20 : 0),
                    file: item,
                    color: color
                });
            });

            // Сортуємо: спочатку Укр, потім 4К
            result.sort(function(a, b) {
                return b.quality_score - a.quality_score;
            });

            return result;
        }

        // Відкриття меню
        function showMenu(movie, items) {
            var html = $('<div><div class="premium-list" style="padding: 10px;"></div></div>');
            
            items.slice(0, 20).forEach(function(item) {
                var btn = $('<div class="selector" style="background: rgba(255,255,255,0.05); margin-bottom: 10px; padding: 15px; border-radius: 8px; border-left: 5px solid ' + item.color + ';">' +
                    '<div style="font-size: 1.1em; font-weight: bold; color: white;">' + item.title + '</div>' +
                    '<div style="font-size: 0.8em; color: #aaa; margin-top: 5px;">' + item.sub + '</div>' +
                    '</div>');

                btn.on('hover:enter', function() {
                    Lampa.Modal.close();
                    Lampa.Player.play(item.file);
                    Lampa.Player.playlist([item.file]);
                });

                html.find('.premium-list').append(btn);
            });

            Lampa.Modal.open({
                title: 'Знайдено ' + items.length + ' варіантів',
                html: html,
                size: 'medium',
                select: html.find('.selector').first(),
                mask: true
            });
        }

        // ГОЛОВНА ФУНКЦІЯ: Вставка кнопки поруч із Showy
        function appendButton(event) {
            if (event.type !== 'complite') return;

            var render = event.object.activity.render();
            
            // 1. Шукаємо кнопку Showy (вона у тебе точно є)
            var target = render.find('.view--showy');
            
            // 2. Якщо Showy нема, шукаємо MODS
            if (target.length === 0) target = render.find('.view--mods');
            
            // 3. Якщо і її нема, шукаємо просто панель кнопок
            if (target.length === 0) target = render.find('.full-start__buttons');

            // Якщо ми вже додали кнопку - виходимо
            if (render.find('.view--premium-final').length > 0) return;

            // Створюємо кнопку
            var btn = $('<div class="view--premium-final button selector button--shape-rounded button--height-large" style="background: linear-gradient(90deg, #d53369 0%, #daae51 100%); color: white; font-weight: bold;">💎 Premium</div>');

            btn.on('hover:enter', function() {
                var parser_url = Lampa.Storage.get('parser_website_url');
                if (!parser_url) parser_url = 'http://176.9.117.135/api/v1'; // TorLook default
                
                Lampa.Loading.start();
                var query = encodeURIComponent(event.data.movie.title);
                
                // Фікс URL
                if (parser_url.indexOf('/api/v1') === -1) {
                     parser_url = parser_url.replace(/\/$/, "") + '/api/v1';
                }

                var url = parser_url + '/search?query=' + query;
                
                Lampa.Network.silent(url, function(json) {
                    Lampa.Loading.stop();
                    if (json && json.length) {
                        var best = getBestTorrents(json);
                        showMenu(event.data.movie, best);
                    } else {
                        Lampa.Noty.show('Нічого не знайдено');
                    }
                }, function() {
                    Lampa.Loading.stop();
                    Lampa.Noty.show('Помилка парсера');
                });
            });

            // Вставляємо ПІСЛЯ Showy
            if (target.hasClass('view--showy') || target.hasClass('view--mods')) {
                target.after(btn);
            } else {
                target.prepend(btn); // Якщо не знайшли сусідів, ставимо першою
            }
        }

        // Підписуємось на відкриття фільму
        Lampa.Listener.follow('full', appendButton);
    }

    if (window.Lampa) {
        startPlugin();
    } else {
        // Якщо Lampa ще не готова, чекаємо
        var timer = setInterval(function() {
            if (window.Lampa) {
                clearInterval(timer);
                startPlugin();
            }
        }, 200);
    }
})();
