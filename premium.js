(function () {
    'use strict';

    // 1. Примусове повідомлення про старт (щоб ми бачили, що файл живий)
    console.log('Premium Plugin: Started');
    if(window.Lampa) Lampa.Noty.show('🚀 Premium Script Loaded (Skaz ver)');

    function PremiumSkaz() {
        // --- Логіка фільтрації (та сама) ---
        function filterContent(items) {
            var result = { '4k': [], '1080p': [], '720p': [] };
            items.forEach(function(item) {
                if(!item || !item.title) return;
                var title = item.title.toLowerCase();
                var size = item.size || '';
                var languages = [];
                if (title.includes('ukr') || title.includes('ua') || title.includes('укр')) languages.push('🇺🇦 UKR');
                if (title.includes('rus') || title.includes('ru') || title.includes('рус')) languages.push('🇷🇺 RUS');
                if (languages.length === 0) languages.push('🇬🇧/Other');
                var label = languages.join(' + ');
                var btnData = { title: label, sub: size, file: item };
                if (title.includes('2160') || title.includes('4k')) result['4k'].push(btnData);
                else if (title.includes('1080') || title.includes('fhd')) result['1080p'].push(btnData);
                else result['720p'].push(btnData);
            });
            return result;
        }

        // --- Логіка відображення меню (та сама) ---
        function showPremiumMenu(movie, data) {
            var html = $(`<div class="premium-ui" style="padding: 20px;"><div style="font-size: 1.4em; color: #ffd700; font-weight: bold; margin-bottom: 20px;">${movie.title}</div><div class="premium-body"></div></div>`);
            
            function addRow(title, color, items) {
                if (items.length === 0) return;
                items.sort((a, b) => a.title.includes('UKR') ? -1 : 1);
                var row = $(`<div style="margin-bottom: 20px;"><div style="color: ${color}; font-weight: bold; margin-bottom: 10px; border-bottom: 1px solid ${color}40;">${title}</div><div class="scroll-row" style="display: flex; gap: 10px; overflow-x: auto; padding-bottom: 10px;"></div></div>`);
                items.slice(0, 15).forEach(item => {
                    var btn = $(`<div class="selector" style="min-width: 130px; background: rgba(255,255,255,0.1); padding: 10px; border-radius: 8px; cursor: pointer;"><div style="font-size: 0.85em; font-weight: bold; color: #fff;">${item.title}</div><div style="font-size: 0.7em; color: #aaa;">${item.sub}</div></div>`);
                    btn.on('hover:enter', function() { Lampa.Modal.close(); Lampa.Player.play(item.file); Lampa.Player.playlist([item.file]); });
                    row.find('.scroll-row').append(btn);
                });
                html.find('.premium-body').append(row);
            }
            addRow('🌟 4K Ultra HD', '#e74c3c', data['4k']);
            addRow('📺 1080p Full HD', '#27ae60', data['1080p']);
            addRow('📱 720p / Інше', '#3498db', data['720p']);
            
            if (html.find('.selector').length === 0) return Lampa.Noty.show('Список пустий');
            Lampa.Modal.open({ title: '', html: html, size: 'medium', select: html.find('.selector').first(), mask: true });
        }

        // --- АГРЕСИВНА ВСТАВКА КНОПКИ ---
        function injectButton() {
            // Шукаємо відкриту сторінку фільму (активну)
            var active = Lampa.Activity.active();
            if (!active || !active.activity || !active.component) return;
            
            // Перевіряємо, чи це фільм/серіал (компонент full)
            if (active.component !== 'full') return;

            // Шукаємо панель кнопок. У модах Skaz класи можуть бути інші, тому шукаємо декілька варіантів
            var render = active.activity.render();
            var buttons_container = render.find('.full-start__buttons, .full-tools__buttons, .view--torrent').first();
            
            // Якщо панель не знайдена - виходимо
            if (buttons_container.length === 0) return;

            // Якщо наша кнопка вже там є - виходимо
            if (buttons_container.find('.view--premium-skaz').length > 0) return;

            console.log('Injecting Button...');

            // Створюємо кнопку
            var btn = $(`<div class="view--premium-skaz button selector button--shape-rounded button--height-large" style="background: #FFD700; color: #000; font-weight: 900; border: 2px solid #fff; margin-right: 10px;">
                PREMIUM
            </div>`);

            // Логіка кліку
            btn.on('hover:enter', function () {
                var movie_data = active.card; // Отримуємо дані фільму з активної картки
                
                var parser_url = Lampa.Storage.get('parser_website_url');
                var use_parser = Lampa.Storage.get('parser_use');
                if (!use_parser || !parser_url) parser_url = 'http://176.9.117.135/api/v1'; // Fallback
                
                Lampa.Loading.start();
                var query = encodeURIComponent(movie_data.title);
                parser_url = parser_url.replace(/\/$/, ""); 
                if(parser_url.indexOf('/api/v1') == -1) parser_url += '/api/v1';
                
                Lampa.Network.silent(parser_url + '/search?query=' + query, function(json) {
                    Lampa.Loading.stop();
                    if (json && Array.isArray(json) && json.length > 0) showPremiumMenu(movie_data, filterContent(json));
                    else Lampa.Noty.show('Пусто :(');
                }, function() { Lampa.Loading.stop(); Lampa.Noty.show('Помилка мережі'); });
            });

            // Вставляємо на початок
            if(buttons_container.find('.view--torrent').length) {
                buttons_container.find('.view--torrent').before(btn);
            } else {
                buttons_container.prepend(btn);
            }
        }

        // Запускаємо перевірку кожну секунду (це найнадійніший метод для модів)
        setInterval(injectButton, 1000);
    }

    if (window.Lampa) PremiumSkaz();
})();
