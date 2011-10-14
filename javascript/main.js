var gamejs = require('gamejs');

// $gamejs.preload([]);

function draw(display, room) {
    display.blit(
        (new gamejs.font.Font('30px Sans-serif')).render(room.id())
    );
}

gamejs.ready(function() {

    var display = gamejs.display.setMode([800, 600]);
    var room = new Room(4);
    draw(display, room);

    /**
    function tick() {
        // game loop
        return;
    };
    gamejs.time.fpsCallback(tick, this, 26);
    **/
});

