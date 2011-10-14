var gamejs = require('gamejs');
var room = require('room');
var edge = require('edge');

// Map direction constants.
var MAP_UP = 0;
var MAP_RIGHT = 1;
var MAP_DOWN = 2;
var MAP_LEFT = 3;

var MAP_HEIGHT = 5;
var MAP_WIDTH = 5;

function Map() {
  this._room_map = new Array();
  this._rooms_by_id = new Array();
  var room_cnt = 0;
  for (var i = 0; i < MAP_HEIGHT; i++) {
    this._room_map[i] = new Array();
    for (var j = 0; j < MAP_HEIGHT; j++) {
      this._room_map[i][j] = new room.Room(room_cnt);
      this._rooms_by_id[room_cnt] = this._room_map[i][j];
      room_cnt++;
    }
  }

  this._dy = new Array();
  this._dx = new Array();

  this._dy[MAP_UP] = -1;
  this._dy[MAP_RIGHT] = 0;
  this._dy[MAP_DOWN] = 1;
  this._dy[MAP_LEFT] = 0;

  this._dx[MAP_UP] = 0;
  this._dx[MAP_RIGHT] = 1;
  this._dx[MAP_DOWN] = 0;
  this._dx[MAP_LEFT] = -1;
}

Map.prototype.get = function(id) {
  assert(id >= 0, "room id must be >= 0");
  return this._rooms_by_id[id];
}

Map.prototype.get_neighbour = function(id, dir) {
  assert(id >= 0, "room id must be >= 0");
  for (var i = 0; i < MAP_HEIGHT; i++) {
    for (var j = 0; j < MAP_WIDTH; j++) {
      if (_room_map[i][j].id() == id) {
        var ay = i + this._dy[dir];
        var ax = j + this._dx[dir];
        if (ay >= 0 && ay < MAP_HEIGHT && ax >= 0 && ax < MAP_WIDTH) {
          return this._room_map[ay][ax].id();
        }
        return -1;
      }
    }
  }
  return -1;
}

Map.prototype._rand_int = function(max) {
  return Math.floor(Math.random()*(max+1));
}

Map.prototype.is_connected = function(x,y) {
  for (var i = 0; i < this._room_connections.length; i++) {
    if (this._room_connections[i].x == x && this._room_connections[i].y == y) return true;
    if (this._room_connections[i].x == y && this._room_connections[i].y == x) return true;
  }
  return false;
}

Map.prototype.generate_map = function() {
  var cnt = 0;
  var edges = new Array();
  var BIG_NUMBER = 1e6;
  for (var i = 0; i < MAP_HEIGHT-1; i++) {
    for (var j = 0; j < MAP_WIDTH; j++){
      edges[cnt] = new edge.Edge(this._room_map[i][j].id(), this._room_map[i+1][j].id());
      cnt++;
    }
  }
  for (var i = 0; i < MAP_HEIGHT; i++) {
    for (var j = 0; j < MAP_WIDTH-1; j++){
      edges[cnt] = new edge.Edge(this._room_map[i][j].id(), this._room_map[i][j+1].id());
      cnt++;
    }
  }

  this._room_connections = edge.Edge.prototype.build_mst(edges);
}

exports.Map = Map;
