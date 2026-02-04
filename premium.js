(function () {
    'use strict';

    function PremiumFilterPlugin() {
        Lampa.Manifest.plugins = Lampa.Manifest.plugins || {};
        Lampa.Manifest.plugins['premium_filter'] = {
            type: 'video',
            version: '1.5.0',
            name: 'Premium Filter (Ukr/Rus)',
            description: 'Фільтрує 4K/1080p та мови UKR/RUS'
        };

        function filterContent(items) {
            var result = { '4k': [], '1080p': [], '720p': [] };
            items.forEach(function(item) {
                var title = (item.title || item.name || '').toLowerCase();
                var size = item.size || '';
                
                var languages = [];
                if (title.includes('ukr') || title.includes('ua') || title.includes('укр')) languages.push('🇺🇦 UKR');
                if (title.includes('rus') || title.includes('ru') || title.includes('рус')) languages.push('🇷🇺 RUS');
                
                // Якщо хочеш бачити всі файли (навіть англ), закоментуй рядок нижче:
                if (languages.length === 0) return; 

                var label = languages.length ? languages.join(' + ') : 'Unknown';
                var btnData = { title: label, sub: size, file: item };

                if (title.includes('2160') || title.includes('4k') || title.includes('uhd')) result['4k'].push(btnData);
                else if (title.includes('1080') || title.includes('fhd')) result['1080p'].push(btnData);
                else result['720p'].push(btnData);
            });
            return result;
        }

        function showPremiumMenu(movie, data) {
            var html = $(`<div class="premium-ui" style="padding: 20px;"><div style="font-size: 1.5em; color: #ffd700; font-weight: bold; margin-bottom: 20px;">${movie.title}</div><div class="premium-body"></div></div>`);

            function addRow(title, color, items) {
                if (items.length === 0) return;
                items.sort((a, b) => a.title.includes('UKR') ? -1 : 1);
                
                var row = $(`<div style="margin-bottom: 25px;"><div style="color: ${color}; font-weight: bold; margin-bottom: 10px; border-bottom: 1px solid ${color}40;">${title}</div><div class="scroll-row" style="display: flex; gap: 10px; overflow-x: auto; padding-bottom: 10px;"></div></div>`);
                
                items.slice(0, 10).forEach(item => {
                    var btn = $(`<div class="selector" style="min-width: 140px; background: rgba(255,255,255,0.1); padding: 10px; border-radius: 8px; cursor: pointer;"><div style="font-size: 0.9em; font-weight: bold; color: #fff;">${item.title}</div><div style="font-size: 0.75em; color: #aaa;">${item.sub}</div></div>`);
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

            if (html.find('.selector').length === 0) return Lampa.Noty.show('Немає Ukr/Rus озвучки');
            
            Lampa.Modal.open({ title: '', html: html, size: 'medium', select: html.find('.selector').first(), mask: true });
        }

        Lampa.Listener.follow('full', function (e) {
            if (e.type == 'complite') {
                var buttons = e.object.activity.render().find('.view--torrent');
                if(buttons.length === 0) buttons = e.object.activity.render().find('.full-start__buttons');

                var btn = $(`<div class="view--premium-filter button selector button--shape-rounded button--height-large" style="background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%); color: #000; font-weight: 800;"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" style="margin-right: 6px; vertical-align: -3px;"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="black"/></svg>PREMIUM</div>`);

                btn.on('hover:enter', function () {
                    Lampa.Loading.start();
                    var query = encodeURIComponent(e.data.movie.title);
                    // Використовуємо універсальний публічний парсер TorLook, якщо свій не налаштовано
                    var parser = Lampa.Storage.get('parser_website_url') || 'http://176.9.117.135/api/v1'; 
                    if(parser.indexOf('api/v1') == -1) parser += '/api/v1';

                    Lampa.Network.silent(parser + '/search?query=' + query, function(json) {
                        Lampa.Loading.stop();
                        if (json && json.length) showPremiumMenu(e.data.movie, filterContent(json));
                        else Lampa.Noty.show('Нічого не знайдено :(');
                    }, function() { Lampa.Loading.stop(); Lampa.Noty.show('Помилка парсера'); });
                });
                buttons.prepend(btn);
            }
        });
    }
    if (window.Lampa) PremiumFilterPlugin();
})();