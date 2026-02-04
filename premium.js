(function () {
    'use strict';

    function PremiumFilterPlugin() {
        // Реєстрація
        Lampa.Manifest.plugins = Lampa.Manifest.plugins || {};
        Lampa.Manifest.plugins['premium_filter'] = {
            type: 'video',
            version: '2.0.0',
            name: 'Premium Button Fix',
            description: 'Кнопка Premium (працює через налаштування Лампи)'
        };

        // --- ЛОГІКА ФІЛЬТРАЦІЇ ---
        function filterContent(items) {
            var result = { '4k': [], '1080p': [], '720p': [] };
            
            items.forEach(function(item) {
                // Захист від пустих даних
                if(!item || !item.title) return;

                var title = item.title.toLowerCase();
                var size = item.size || 'Unknown';
                var tracker = item.tracker || 'Torrent';
                
                // Визначаємо мову
                var languages = [];
                if (title.includes('ukr') || title.includes('ua') || title.includes('укр')) languages.push('🇺🇦 UKR');
                if (title.includes('rus') || title.includes('ru') || title.includes('рус')) languages.push('🇷🇺 RUS');
                
                // Якщо мову не знайдено - позначаємо як Original/Eng
                if (languages.length === 0) languages.push('🇬🇧/🏴‍☠️ Other');

                var label = languages.join(' + ');
                var btnData = { title: label, sub: size + ' • ' + tracker, file: item };

                // Сортуємо по папках
                if (title.includes('2160') || title.includes('4k') || title.includes('uhd')) result['4k'].push(btnData);
                else if (title.includes('1080') || title.includes('fhd')) result['1080p'].push(btnData);
                else result['720p'].push(btnData);
            });
            return result;
        }

        // --- ВІДОБРАЖЕННЯ (Меню) ---
        function showPremiumMenu(movie, data) {
            var html = $(`<div class="premium-ui" style="padding: 20px;">
                <div style="font-size: 1.4em; color: #ffd700; font-weight: bold; margin-bottom: 5px;">${movie.title}</div>
                <div style="font-size: 0.8em; opacity: 0.7; margin-bottom: 20px;">Оберіть якість та озвучку</div>
                <div class="premium-body"></div>
            </div>`);

            function addRow(title, color, items) {
                if (items.length === 0) return;
                
                // Сортуємо: Українська зверху
                items.sort((a, b) => a.title.includes('UKR') ? -1 : 1);

                var row = $(`<div style="margin-bottom: 20px;">
                    <div style="color: ${color}; font-weight: bold; margin-bottom: 10px; border-bottom: 1px solid ${color}40;">${title} <span style="font-size: 0.7em; opacity: 0.6;">(${items.length})</span></div>
                    <div class="scroll-row" style="display: flex; gap: 10px; overflow-x: auto; padding-bottom: 10px;"></div>
                </div>`);

                items.slice(0, 15).forEach(item => {
                    var btn = $(`<div class="selector" style="min-width: 130px; background: rgba(255,255,255,0.08); padding: 10px; border-radius: 8px; cursor: pointer; border: 1px solid rgba(255,255,255,0.05);">
                        <div style="font-size: 0.85em; font-weight: bold; color: #fff;">${item.title}</div>
                        <div style="font-size: 0.7em; color: #aaa; margin-top: 4px;">${item.sub}</div>
                    </div>`);
                    
                    btn.on('hover:enter', function() {
                        Lampa.Modal.close();
                        Lampa.Player.play(item.file);
                        Lampa.Player.playlist([item.file]);
                    });
                    row.find('.scroll-row').append(btn);
                });
                html.find('.premium-body').append(row);
            }

            addRow('🌟 4K Ultra HD', '#e74c3c', data['4k']);
            addRow('📺 1080p Full HD', '#27ae60', data['1080p']);
            addRow('📱 720p / Інше', '#3498db', data['720p']);

            if (html.find('.selector').length === 0) return Lampa.Noty.show('Знайдено файли, але список пустий');
            
            Lampa.Modal.open({ title: '', html: html, size: 'medium', select: html.find('.selector').first(), mask: true });
        }

        // --- КНОПКА ---
        function addButton(){
            Lampa.Listener.follow('full', function (e) {
                if (e.type == 'complite') {
                    var render = e.object.activity.render();
                    var buttons = render.find('.view--torrent');
                    if(buttons.length === 0) buttons = render.find('.full-start__buttons');

                    // Перевірка, чи кнопка вже є, щоб не дублювати
                    if(render.find('.view--premium-filter').length > 0) return;

                    var btn = $(`<div class="view--premium-filter button selector button--shape-rounded button--height-large" style="background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%); color: #000; font-weight: 800; border: none;">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style="margin-right: 6px; vertical-align: -3px;">
                            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="black"/>
                        </svg> PREMIUM
                    </div>`);

                    btn.on('hover:enter', function () {
                        // 1. Отримуємо URL парсера з налаштувань Lampa
                        var parser_url = Lampa.Storage.get('parser_website_url');
                        var use_parser = Lampa.Storage.get('parser_use');

                        // 2. Якщо парсер не налаштований — сваримось
                        if (!use_parser || !parser_url) {
                            Lampa.Noty.show('Помилка: Увімкніть "Парсер" в налаштуваннях!');
                            Lampa.Settings.open(); // Відкриваємо налаштування користувачу
                            return;
                        }

                        Lampa.Loading.start();
                        
                        // 3. Формуємо правильний URL (Lampa сама підставить проксі якщо треба)
                        var query = encodeURIComponent(e.data.movie.title);
                        // Видаляємо слеш в кінці, якщо є
                        parser_url = parser_url.replace(/\/$/, ""); 
                        if(parser_url.indexOf('/api/v1') == -1) parser_url += '/api/v1';
                        
                        var searchUrl = parser_url + '/search?query=' + query;

                        // 4. Робимо запит
                        Lampa.Network.silent(searchUrl, function(json) {
                            Lampa.Loading.stop();
                            if (json && Array.isArray(json) && json.length > 0) {
                                showPremiumMenu(e.data.movie, filterContent(json));
                            } else {
                                Lampa.Noty.show('Нічого не знайдено :(');
                            }
                        }, function(a, c) {
                            Lampa.Loading.stop();
                            Lampa.Noty.show('Помилка мережі (' + c + ')');
                        });
                    });

                    buttons.prepend(btn);
                }
            });
        }

        if (window.appready) addButton();
        else Lampa.Listener.follow('app', addButton);
    }

    if (window.Lampa) PremiumFilterPlugin();
})();
