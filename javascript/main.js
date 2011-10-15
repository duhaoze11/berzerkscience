var gamejs = require('gamejs');
var room = require('room');
var map = require('map');
var player = require('player');
var game_state = require('game_state');

// $gamejs.preload([]);

var SCREEN_WIDTH = 825;
var SCREEN_HEIGHT= 625;

gamejs.ready(function() {

    var display = gamejs.display.setMode([SCREEN_WIDTH, SCREEN_HEIGHT]);

    var m = new map.Map();
    m.generate_map();

    var p = new player.Player();
    var room_id = 0;
    game_state.game_state.Init(m, m.get(room_id), p);

    function tick(ms) {
        gamejs.event.get().forEach(function(event) {
          if (event.type === gamejs.event.KEY_DOWN ||
              event.type === gamejs.event.KEY_UP ||
              event.type === gamejs.event.MOUSE_DOWN) {
            p.processUserInput(event);
          }
        });
        display.clear();

        p.update(ms);
        game_state.game_state.changeRoomIfNeeded();

        game_state.game_state.current_room.draw(display);
        p.draw(display);

        game_state.game_state.update_player_projectiles(ms, display);
        return;
    };
    gamejs.time.fpsCallback(tick, this, 40);
});

exports.SCREEN_WIDTH = SCREEN_WIDTH;
exports.SCREEN_HEIGHT = SCREEN_HEIGHT;
