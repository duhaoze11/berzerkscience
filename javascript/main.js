var gamejs = require('gamejs');
var room = require('room');
var map = require('map');

// $gamejs.preload([]);

var WALL_SMALL = 20;
var WALL_BIG = 180;

gamejs.preload(['graphics/walls/brick1.png',
		'graphics/walls/brick2.png',
		'graphics/walls/brick3.png']);
gamejs.ready(function() {

    var display = gamejs.display.setMode([825, 625]);

    var m = new map.Map();
    m.generate_map();
    var r = m.get(6);
    r.draw(display);

    /**
    function tick() {
        // game loop
        return;
    };
    gamejs.time.fpsCallback(tick, this, 26);
    **/
});
