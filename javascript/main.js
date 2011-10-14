var gamejs = require('gamejs');

// $gamejs.preload([]);

function draw(display, room) {
  for (var i=0; i<ROOM_WIDTH; i++) {
    for (var j=0; j<ROOM_HEIGHT; j++) {
      window.console.log('test' + i);
    }
  }
}

/**    display.blit(
        (new gamejs.font.Font('30px Sans-serif')).render(ROOM_HEIGHT)
    );*/

gamejs.ready(function() {

    var display = gamejs.display.setMode([800, 600]);
    var room = new Room(5);
    draw(display, room);

    /**
    function tick() {
        // game loop
        return;
    };
    gamejs.time.fpsCallback(tick, this, 26);
    **/
});
