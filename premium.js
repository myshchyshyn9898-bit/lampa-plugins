(function () {
    'use strict';

    // Повідомлення про запуск
    if (window.Lampa) Lampa.Noty.show('🛠 Premium Script V3: Start');

    function PremiumHunter() {
        
        // --- 1. Логіка фільтрації (стандартна) ---
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

        // --- 2. Меню (стандартне) ---
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

        // --- 3. ПОШУК КНОПОК (Агресивний метод) ---
        function huntForPlace() {
            // Перевіряємо, чи ми взагалі на сторінці фільму
            var active = Lampa.Activity.active();
            if (!active || !active.component || active.component !== 'full') return;

            // Якщо кнопка вже є - стоп
            if ($('.premium-hunter-btn').length > 0) return;

            console.log('Premium Hunter: Looking for container...');

            // Список місць, де можуть бути кнопки у Skaz/FMX/Mods
            var places = [
                '.full-start__buttons',   // Стандарт
                '.full-tools__buttons',   // FMX / Skaz
                '.view--torrent',         // Старі версії
                '.full-start .buttons',   // Варіант модифікацій
                '.full-line .full-line__body' // Якщо кнопок нема, пхнемо в лінію опису
            ];

            var container = null;

            // Перебираємо всі можливі місця
            for (var i = 0; i < places.length; i++) {
                var found = $(places[i]);
                if (found.length > 0) {
                    container = found.first();
                    break;
                }
            }

            // Якщо знайшли місце - вставляємо!
            if (container) {
                var btn = $(`<div class="premium-hunter-btn button selector button--shape-rounded button--height-large" style="background: #FFD700; color: #000; font-weight: 900; border: 2px solid #fff; margin-right: 15px;">
                    💎 PREMIUM
                </div>`);

                btn.on('hover:enter', function () {
                    // Логіка запуску
                    var parser_url = Lampa.Storage.get('parser_website_url'); 
                    if (!parser_url) parser_url = 'http://176.9.117.135/api/v1'; // Запасний
                    
                    Lampa.Loading.start();
                    var query = encodeURIComponent(active.card.title);
                    
                    if(parser_url.indexOf('api/v1') == -1) parser_url = parser_url.replace(/\/$/, "") + '/api/v1';
                    
                    Lampa.Network.silent(parser_url + '/search?query=' + query, function(json) {
                        Lampa.Loading.stop();
                        if (json && json.length) showPremiumMenu(active.card, filterContent(json));
                        else Lampa.Noty.show('Пусто (перевір парсер)');
                    }, function() { Lampa.Loading.stop(); Lampa.Noty.show('Помилка мережі'); });
                });

                // Вставляємо кнопку на початок
                container.prepend(btn);
                
                // Сповіщення, що ми перемогли
                Lampa.Noty.show('✅ Кнопка встановлена!');
            }
        }

        // Запускаємо перевірку кожні 2 секунди вічно (щоб піймати момент)
        setInterval(huntForPlace, 2000);
    }

    if (window.Lampa) PremiumHunter();
})();
