var gamejs = require('gamejs');

var ROOM_HEIGHT = 7;
var ROOM_WIDTH = 9;

function Room(id) {
  this._id = id;
  this._state = new Array();
  for (var i = 0; i < ROOM_HEIGHT; i++) {
    this._state[i] = new Array();
    for (var j = 0; j < ROOM_WIDTH; j++) {
      this._state[i][j] = 0;
    }
  }
}

Room.prototype.id = function() {
  return this._id;
}

Room.prototype.get = function(x,y) {
  return this._state[y][x];
}

Room.prototype.draw = function(display) {
  display.blit(
      (new gamejs.font.Font('30px Sans-serif')).render(ROOM_HEIGHT)
  );
}

exports.Room = Room;

