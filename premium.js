(function () {
    'use strict';

    // Повідомлення, щоб ти бачив, що файл завантажився
    if(window.Lampa) Lampa.Noty.show('✅ Premium Mod: Active');

    function PremiumUniversal() {
        
        // --- 1. Логіка (Та сама) ---
        function filterContent(items) {
            var result = { '4k': [], '1080p': [], '720p': [] };
            if (!items || !items.length) return result;
            items.forEach(function(item) {
                if(!item || !item.title) return;
                var title = String(item.title).toLowerCase();
                var size = item.size || '';
                var languages = [];
                if (title.indexOf('ukr') !== -1 || title.indexOf('ua') !== -1 || title.indexOf('укр') !== -1) languages.push('🇺🇦 UKR');
                if (title.indexOf('rus') !== -1 || title.indexOf('ru') !== -1 || title.indexOf('рус') !== -1) languages.push('🇷🇺 RUS');
                if (languages.length === 0) languages.push('🇬🇧/Other');
                var label = languages.join(' + ');
                var btnData = { title: label, sub: size, file: item };
                if (title.indexOf('2160') !== -1 || title.indexOf('4k') !== -1) result['4k'].push(btnData);
                else if (title.indexOf('1080') !== -1 || title.indexOf('fhd') !== -1) result['1080p'].push(btnData);
                else result['720p'].push(btnData);
            });
            return result;
        }

        function showPremiumMenu(movie, data) {
            var html = $('<div><div class="premium-ui" style="padding: 20px;"><div style="font-size: 1.4em; color: #ffd700; font-weight: bold; margin-bottom: 20px;">' + movie.title + '</div><div class="premium-body"></div></div></div>');
            function addRow(title, color, items) {
                if (items.length === 0) return;
                items.sort(function(a, b) { var aUkr = a.title.indexOf('UKR') !== -1; return aUkr ? -1 : 1; });
                var row = $('<div style="margin-bottom: 20px;"><div style="color: ' + color + '; font-weight: bold; margin-bottom: 10px; border-bottom: 1px solid ' + color + '40;">' + title + '</div><div class="scroll-row" style="display: flex; gap: 10px; overflow-x: auto; padding-bottom: 10px;"></div></div>');
                items.slice(0, 15).forEach(function(item) {
                    var btn = $('<div class="selector" style="min-width: 130px; background: rgba(255,255,255,0.1); padding: 10px; border-radius: 8px; cursor: pointer;"><div style="font-size: 0.85em; font-weight: bold; color: #fff;">' + item.title + '</div><div style="font-size: 0.7em; color: #aaa;">' + item.sub + '</div></div>');
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

        // --- 2. ПОШУК (БРУТФОРС) ---
        function bruteForceInsert() {
            var active = Lampa.Activity.active();
            if (!active || !active.component || active.component !== 'full') return;
            
            // Якщо кнопка вже є - стоп
            if ($('.premium-btn-universal').length > 0) return;

            // Хитрість: Шукаємо кнопку, яка вже точно є на екрані (MODS або Showy або Play)
            // Ми шукаємо будь-який елемент з класом .button всередині активного вікна
            var any_existing_button = $('.full-start .button, .full-tools .button, .view--showy, .selector.button').first();
            
            // Отримуємо "батька" цієї кнопки (контейнер, де вони всі лежать)
            var container = any_existing_button.parent();

            if (container.length > 0) {
                // Створюємо нашу кнопку (Червона, щоб ти точно її помітив)
                var btn = $('<div class="premium-btn-universal button selector button--shape-rounded button--height-large" style="background: #ff0000; color: #fff; font-weight: 900; border: 2px solid #fff; margin-right: 15px; box-shadow: 0 0 15px rgba(255,0,0,0.5);">💎 PREMIUM</div>');

                btn.on('hover:enter', function () {
                    var parser_url = Lampa.Storage.get('parser_website_url'); 
                    if (!parser_url) parser_url = 'http://176.9.117.135/api/v1';
                    Lampa.Loading.start();
                    var query = encodeURIComponent(active.card.title);
                    if(parser_url.indexOf('api/v1') === -1) parser_url = parser_url.replace(/\/$/, "") + '/api/v1';
                    
                    Lampa.Network.silent(parser_url + '/search?query=' + query, function(json) {
                        Lampa.Loading.stop();
                        if (json && json.length) showPremiumMenu(active.card, filterContent(json));
                        else Lampa.Noty.show('Пусто');
                    }, function() { Lampa.Loading.stop(); Lampa.Noty.show('Помилка мережі'); });
                });

                // Вставляємо на початок контейнера
                container.prepend(btn);
                Lampa.Noty.show('Кнопка вставлена!');
            }
        }

        // Довбаємо кожну секунду
        setInterval(bruteForceInsert, 1000);
    }

    if (window.Lampa) PremiumUniversal();
})();
