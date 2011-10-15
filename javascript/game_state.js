var main = require('main');
var player = require('player');

function GameState() {
}

GameState.prototype.Init = function(map, current_room, player) {
  this.map = map;
  this.current_room = current_room;
  this.player = player;
}

var global_game_state = new GameState();

GameState.prototype.changeRoomIfNeeded = function() {
  if (this.player.rect.left > main.SCREEN_WIDTH - player.PLAYER_WIDTH) {
    this.player.rect.left = this.player.rect.left - 10;
  } else if (this.player.rect.left < 0) {
    this.player.rect.left = this.player.rect.left + 10;
  } else if (this.player.rect.top > main.SCREEN_HEIGHT - player.PLAYER_HEIGHT) {
    this.player.rect.top = this.player.rect.top - 10;
  }  else if (this.player.rect.top < 0) {
    this.player.rect.top = this.player.rect.top + 10;
  }
}

GameState.prototype.current_room_id = function() {
  return this.current_room.id();
}

exports.game_state = global_game_state;
