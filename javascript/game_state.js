var main = require('main');
var player = require('player');
var assert = require('assert');
var map = require('map');

function GameState() {
}

GameState.prototype.Init = function(map, current_room, player) {
  this.map = map;
  this.current_room = current_room;
  this.player = player;
}

var global_game_state = new GameState();

GameState.prototype.changeRoomIfNeeded = function() {
  var exit;
  if (this.player.rect.left > main.SCREEN_WIDTH - player.PLAYER_WIDTH) {
    exit = map.MAP_RIGHT;
  } else if (this.player.rect.left < 0) {
    exit = map.MAP_LEFT;
  } else if (this.player.rect.top > main.SCREEN_HEIGHT - player.PLAYER_HEIGHT) {
    exit = map.MAP_DOWN;
  }  else if (this.player.rect.top < 0) {
    exit = map.MAP_UP;
  }
  if (exit == undefined) {
    return;
  }

  var room_id = this.map.get_neighbour(this.current_room.id(), exit);
  assert.assert(room_id != -1, "exit detected incorrectly");
  this.current_room = this.map.get(room_id);
  switch (exit) {
    case map.MAP_LEFT:
      this.player.rect.left = main.SCREEN_WIDTH - player.PLAYER_WIDTH;
      break;
    case map.MAP_RIGHT:
      this.player.rect.left = 0;
      break;
    case map.MAP_UP:
      this.player.rect.top = main.SCREEN_HEIGHT - player.PLAYER_HEIGHT;
      break;
    case map.MAP_DOWN:
      this.player.rect.top = 0;
      break;
  }
}

GameState.prototype.current_room_id = function() {
  return this.current_room.id();
}

exports.game_state = global_game_state;
