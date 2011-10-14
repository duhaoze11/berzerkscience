var ROOM_HEIGHT = 9;
var ROOM_WIDTH = 7;

function Room(id) {
  var _id = id;
  var _state = new Array();
  for (var i = 0; i < ROOM_HEIGHT; i++) {
    _state[i] = new Array();
    for (var j = 0; j < ROOM_WIDTH; j++) {
      _state[i][j] = 0;
    }
  }
  this.id = function() {
    return _id;
  }
  this.get = function(x,y) {
    return _state[y][x];
  }
}

