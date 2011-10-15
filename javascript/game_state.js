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

  this.player_projectiles = new Array();
  this.current_room.calculate_distances_from_start(-1);
  this.current_room.generate_robots();
}

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
  this.current_room.generate_robots();
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

  // delete all player's projectiles as we changed room
  this.player_projectiles = new Array();
  this.player.num_projectiles = 0;
}

GameState.prototype.current_room_id = function() {
  return this.current_room.id();
}

var global_game_state = new GameState();

GameState.prototype.add_player_projectile = function(proj) {
  this.player_projectiles.push(proj);
}

GameState.prototype.update_player_projectiles = function(ms, display) {
  var new_projectiles = new Array();
  for (var i = 0; i < this.player_projectiles.length; i++) {
    this.player_projectiles[i].update(ms);
    if (!this.player_projectiles[i].outside() &&
        !this.player_projectiles[i].collides(this.current_room._walls_to_draw)) {
      new_projectiles.push(this.player_projectiles[i]);
    } else {
      this.player.num_projectiles--;
    }
    this.player_projectiles[i].draw(display);
  }
  this.player_projectiles = new_projectiles;
  assert.assert(this.player.num_projectiles == this.player_projectiles.length, "projectiles limit");
}

exports.game_state = global_game_state;
