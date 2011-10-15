function GameState() {
}

GameState.prototype.Init = function(map, current_room, player) {
  this.map = map;
  this.current_room_id = current_room;
  this.player = player;
}

var global_game_state = new GameState();

exports.game_state = global_game_state;
