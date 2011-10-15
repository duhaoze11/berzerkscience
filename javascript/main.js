var gamejs = require('gamejs');
var room = require('room');
var map = require('map');
var player = require('player');
var game_state = require('game_state');

// $gamejs.preload([]);

var SCREEN_WIDTH = 825;
var SCREEN_HEIGHT= 625;

var WALL_SMALL = 20;
var WALL_BIG = 180;

gamejs.ready(function() {

    var display = gamejs.display.setMode([SCREEN_WIDTH, SCREEN_HEIGHT]);

    var m = new map.Map();
    m.generate_map();
    var room_id = 0;
    var r = m.get(room_id);
    var p = new player.Player();
    game_state.game_state.Init(m, room_id, p);

    function tick(ms) {
        gamejs.event.get().forEach(function(event) {
          if (event.type === gamejs.event.KEY_DOWN ||
              event.type === gamejs.event.KEY_UP) {
            p.processUserInput(event);
          }
        });
        display.clear();
        r.draw(display);

        p.update(ms);
        p.draw(display);
        return;
    };
    gamejs.time.fpsCallback(tick, this, 40);
});

exports.SCREEN_WIDTH = SCREEN_WIDTH;
exports.SCREEN_HEIGHT = SCREEN_HEIGHT;
