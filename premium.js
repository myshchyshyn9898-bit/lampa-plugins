(function () {
    'use strict';

    // 1. Негайна перевірка запуску
    if (window.Lampa) {
        // Виводимо повідомлення старим методом
        setTimeout(function(){
            Lampa.Noty.show('Old School Script: Loaded');
        }, 1000);
    }

    function PremiumOldSchool() {
        
        // Фільтрація (без стрілок)
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

        // Відображення меню (без `лапок`)
        function showPremiumMenu(movie, data) {
            var html = $('<div><div class="premium-ui" style="padding: 20px;"><div style="font-size: 1.4em; color: #ffd700; font-weight: bold; margin-bottom: 20px;">' + movie.title + '</div><div class="premium-body"></div></div></div>');
            
            function addRow(title, color, items) {
                if (items.length === 0) return;
                
                // Сортування (старий синтаксис)
                items.sort(function(a, b) {
                    var aUkr = a.title.indexOf('UKR') !== -1;
                    return aUkr ? -1 : 1;
                });

                var row = $('<div style="margin-bottom: 20px;"><div style="color: ' + color + '; font-weight: bold; margin-bottom: 10px; border-bottom: 1px solid ' + color + '40;">' + title + '</div><div class="scroll-row" style="display: flex; gap: 10px; overflow-x: auto; padding-bottom: 10px;"></div></div>');
                
                items.slice(0, 15).forEach(function(item) {
                    var btn = $('<div class="selector" style="min-width: 130px; background: rgba(255,255,255,0.1); padding: 10px; border-radius: 8px; cursor: pointer;"><div style="font-size: 0.85em; font-weight: bold; color: #fff;">' + item.title + '</div><div style="font-size: 0.7em; color: #aaa;">' + item.sub + '</div></div>');
                    
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
            
            if (html.find('.selector').length === 0) return Lampa.Noty.show('Список пустий');
            
            Lampa.Modal.open({ 
                title: '', 
                html: html, 
                size: 'medium', 
                select: html.find('.selector').first(), 
                mask: true 
            });
        }

        // Пошук місця для кнопки
        function huntForPlace() {
            var active = Lampa.Activity.active();
            if (!active || !active.component || active.component !== 'full') return;

            // Якщо кнопка вже є - вихід
            if ($('.premium-old-btn').length > 0) return;

            // Шукаємо будь-яку панель кнопок
            var container = $('.full-start__buttons').first();
            if (container.length === 0) container = $('.full-tools__buttons').first();
            if (container.length === 0) container = $('.view--torrent').first().parent(); // Спроба знайти батька

            if (container.length > 0) {
                var btn = $('<div class="premium-old-btn button selector button--shape-rounded button--height-large" style="background: #FFD700; color: #000; font-weight: 900; border: 2px solid #fff; margin-right: 15px;">💎 PREMIUM</div>');

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
                    }, function() { 
                        Lampa.Loading.stop(); 
                        Lampa.Noty.show('Помилка мережі'); 
                    });
                });

                container.prepend(btn);
                Lampa.Noty.show('Кнопка додана (Legacy Mode)');
            }
        }

        setInterval(huntForPlace, 2000);
    }

    if (window.Lampa) PremiumOldSchool();
})();
