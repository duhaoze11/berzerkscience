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

    var r = m.get(6);
    var p = new player.Player();

    function tick() {
        gamejs.event.get().forEach(function(event) {
          if (event.type === gamejs.event.KEY_DOWN ||
              event.type === gamejs.event.KEY_UP) {
            p.processUserInput(event);
          }
        });
        r.draw(display);
        p.draw(display);
        return;
    };
    gamejs.time.fpsCallback(tick, this, 40);
});
