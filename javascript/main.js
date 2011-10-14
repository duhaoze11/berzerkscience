var gamejs = require('gamejs');
var room = require('room');

// $gamejs.preload([]);

var WALL_SMALL = 20;
var WALL_BIG = 180;

gamejs.ready(function() {

    var display = gamejs.display.setMode([820, 620]);

    var r = new room.Room(5);
    r.draw(display);

    /**
    function tick() {
        // game loop
        return;
    };
    gamejs.time.fpsCallback(tick, this, 26);
    **/
});
