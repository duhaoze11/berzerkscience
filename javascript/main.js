var gamejs = require('gamejs');
var room = require('room');
var map = require('map');
var player = require('player');

// $gamejs.preload([]);

var SCREEN_WIDTH = 825;
var SCREEN_HEIGHT= 625;

var WALL_SMALL = 20;
var WALL_BIG = 180;

gamejs.ready(function() {

    var display = gamejs.display.setMode([SCREEN_WIDTH, SCREEN_HEIGHT]);

    var m = new map.Map();
    m.generate_map();
    var r = m.get(0);
    r.draw(display);

    var p = new player.Player();
    p.draw(display);

    /**
    function tick() {
        // game loop
        return;
    };
    gamejs.time.fpsCallback(tick, this, 26);
    **/
});

exports.SCREEN_WIDTH = SCREEN_WIDTH;
exports.SCREEN_HEIGHT = SCREEN_HEIGHT;
