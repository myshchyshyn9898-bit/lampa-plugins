// 1. Додаємо кастомні стилі для Premium-ефекту
Lampa.Template.add('premium_style', `
    <style>
        .premium-btn-gold {
            background: linear-gradient(135deg, #ffd700 0%, #b8860b 100%) !important;
            color: #000 !important;
            border-radius: 12px !important;
            box-shadow: 0 4px 15px rgba(218, 165, 32, 0.4);
            transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) !important;
            border: none !important;
            transform: scale(1);
        }
        .premium-btn-gold.focus {
            transform: scale(1.1);
            box-shadow: 0 0 25px rgba(255, 215, 0, 0.8) !important;
            background: #fff !important; /* Білий колір при фокусі для контрасту */
        }
        .premium-menu-title {
            color: #ffd700;
            text-shadow: 0 2px 4px rgba(0,0,0,0.5);
            font-weight: bold;
        }
    </style>
`);
$('body').append(Lampa.Template.get('premium_style', {}, true));

// 2. Оновлена функція додавання кнопки
function addPremiumButton(e) {
    if (e.render.find('.premium-btn-gold').length) return;

    var btn = $(`
        <div class="full-start__button selector premium-btn-gold">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="margin-right: 8px;">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="black"/>
            </svg>
            <span>PREMIUM</span>
        </div>
    `);

    btn.on('hover:enter', function() {
        // Викликаємо наше нове гарне меню
        showPremiumChoice(e.movie);
    });

    e.render.before(btn);
}

// 3. Красиве меню вибору якості та озвучки
function showPremiumChoice(movie) {
    Lampa.Select.show({
        title: '💎 Premium Вибір',
        items: [
            { title: '🇺🇦 Українська озвучка (4K/UHD)', quality: '4K', lang: 'uk' },
            { title: '🇺🇦 Українська озвучка (Full HD)', quality: '1080p', lang: 'uk' },
            { title: '🎬 Оригінальна якість + Саби', quality: 'Max', lang: 'en' },
            { title: '🇷🇺 Російська озвучка', quality: '1080p', lang: 'ru' }
        ],
        onSelect: function(item) {
            Lampa.Noty.show('Пошук ' + item.title + '...');
            
            // Тут ми підключаємось до логіки твого базового плагіна
            Lampa.Activity.push({
                url: '',
                component: 'showy', // використовуємо твій компонент
                movie: movie,
                search: movie.title,
                premium_filter: item // передаємо наш фільтр
            });
        },
        onBack: function() {
            Lampa.Controller.toggle('full');
        }
    });
}
