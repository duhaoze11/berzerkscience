var gamejs = require('gamejs');

// $gamejs.preload([]);

gamejs.ready(function() {

    var display = gamejs.display.setMode([800, 600]);
    var room = new Room(5);
    display.blit(
        (new gamejs.font.Font('30px Sans-serif')).render(room.id())
    );

    /**
    function tick() {
        // game loop
        return;
    };
    gamejs.time.fpsCallback(tick, this, 26);
    **/
});
