(function () {

    if (typeof Lampa == 'undefined') return;

    var plugin = {
        name: 'Онлайн хелоу',
        version: '1.0',
        description: 'Кнопка онлайн перегляду',
        author: 'test'
    };

    Lampa.Plugin.add('online_helou', {
        init: function () {

            Lampa.Listener.follow('full', function (event) {

                if (event.type !== 'complite') return;
                if (!event.data || !event.data.movie) return;

                Lampa.Player.addButton({
                    title: 'Онлайн хелоу',
                    onClick: function () {
                        window.open('https://google.com');
                    }
                });

            }
