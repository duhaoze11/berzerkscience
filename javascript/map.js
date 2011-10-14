// Map direction constants.
var MAP_UP = 0;
var MAP_RIGHT = 1;
var MAP_DOWN = 2;
var MAP_LEFT = 3;

var MAP_HEIGHT = 50;
var MAP_WIDTH = 50;

function Map() {
  var _room_map = new Array();
  var room_cnt = 0;
  for (var i = 0; i < MAP_HEIGHT; i++) {
    _room_map[i] = new Array();
    for (var j = 0; j < MAP_HEIGHT; j++) {
      _room_map[i][j] = new Room(room_cnt);
      room_cnt++;
    }
  }

  _dy = new Array();
  _dx = new Array();
  _dy[MAP_UP] = -1;
  _dx[MAP_UP] = 0;
  _dy[MAP_RIGHT] = 0;
  _dx[MAP_RIGHT] = 1;
  _dy[MAP_DOWN] = 1;
  _dx[MAP_DOWN] = 0;
  _dy[MAP_LEFT] = 0;
  _dx[MAP_LEFT] = -1;
}

Map.prototype.get = function(id) {
  assert(id >= 0, "room id must be >= 0");
  return rooms_by_id[id];
}

Map.prototype.get_neighbour = function(id, dir) {
  assert(id >= 0, "room id must be >= 0");
  for (var i = 0; i < MAP_HEIGHT; i++) {
    for (var j = 0; j < MAP_WIDTH; j++) {
      if (_room_map[i][j].id() == id) {
        var ay = i + _dy[dir];
        var ax = j + _dx[dir];
        if (ay >= 0 && ay < MAP_HEIGHT && ax >= 0 && ax < MAP_WIDTH) {
          return _room_map[ay][ax].id();
        }
        return -1;
      }
    }
  }
  return -1;
}

