var gamejs = require('gamejs');
var room = require('room');
var map = require('map');
var player = require('player');
var game_state = require('game_state');
var font = require('font');
var gamescreen = require('gamescreen');

// $gamejs.preload([]);

var SCREEN_WIDTH = 825;
var SCREEN_HEIGHT= 625;

gamejs.ready(function() {

    var display = gamejs.display.setMode([SCREEN_WIDTH, SCREEN_HEIGHT]);

    // TODO(zvold): not necessary, it's done in INITIALIZING case below
    var m = new map.Map();
    m.generate_map();
    var p = new player.Player();
    var room_id = 0;
    game_state.game_state.Init(m, m.get(room_id), p);
    font.global_font.Init();

    var done = 0;

    function tick(ms) {
      switch (game_state.game_state.machine_state) {
        case gamescreen.GAMESTATE_SCREENS:
          var machine_screen = gamescreen.state_machine[game_state.game_state.machine_screen_id];
          display.clear();
          machine_screen.draw(display);
          gamejs.event.get().forEach(function(event) {
            if (event.type === gamejs.event.MOUSE_DOWN) {
              machine_screen.processUserInput(event);
            }
          });
          break;
        case gamescreen.GAMESTATE_INITIALIZING:
          m = new map.Map();
          m.generate_map();
          p = new player.Player();
          room_id = 0;
          game_state.game_state.Init(m, m.get(room_id), p);
          game_state.game_state.machine_state = gamescreen.GAMESTATE_PLAYING;
          break;
        case gamescreen.GAMESTATE_PLAYING:
          game_state.game_state.statistics._game_time += ms;
          if (ms > 100) ms = 100;
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

          game_state.game_state.current_room.update(ms);
          game_state.game_state.current_room.draw(display);
          p.draw(display);

          game_state.game_state.update_effects(ms, display);

          game_state.game_state.update_player_projectiles(ms, display);
          game_state.game_state.update_enemy_projectiles(ms, display);
          game_state.game_state.update_player_powerups();

          game_state.game_state.render_game_stats(display);
          break;
      }
      return;
    };
    gamejs.time.fpsCallback(tick, this, 40);
});

exports.SCREEN_WIDTH = SCREEN_WIDTH;
exports.SCREEN_HEIGHT = SCREEN_HEIGHT;
