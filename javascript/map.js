var gamejs = require('gamejs');
var room = require('room');
var edge = require('edge');
var assert = require('assert');
var utils = require('utils');
var main = require('main');
var item = require('item');

// Map direction constants.
var MAP_UP = 0;
var MAP_RIGHT = 1;
var MAP_DOWN = 2;
var MAP_LEFT = 3;

var MAP_HEIGHT = 3;
var MAP_WIDTH = 3;
var NUM_ROOMS = MAP_HEIGHT * MAP_WIDTH;

function Map() {
  this._room_map = new Array();
  this._rooms_by_id = new Array();
  var room_cnt = 0;
  for (var i = 0; i < MAP_HEIGHT; i++) {
    this._room_map[i] = new Array();
    for (var j = 0; j < MAP_WIDTH; j++) {
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

Map.prototype.generate_items = function(type, num, id) {
  // generate 3 firebooks at random rooms
  for (var i = 0; i < num; i++) {
    if (id == undefined) {
      id = utils.rand_int(NUM_ROOMS);
    }
    var room = this._rooms_by_id[id];

    // TODO(zvold): make sure books are reachable
    var x = utils.rand_int(main.SCREEN_WIDTH - item.ITEM_WIDTH);
    var y = utils.rand_int(main.SCREEN_HEIGHT - item.ITEM_HEIGHT);
    var new_item = new item.Item(new gamejs.Rect([x, y], [0, 0]), type);

    room.items.push(new_item);
  }
}

Map.prototype.get = function(id) {
  assert.assert(id >= 0, "room id must be >= 0");
  return this._rooms_by_id[id];
}

Map.prototype.get_neighbour = function(id, dir) {
  assert.assert(id >= 0, "room id must be >= 0");
  for (var i = 0; i < MAP_HEIGHT; i++) {
    for (var j = 0; j < MAP_WIDTH; j++) {
      if (this._room_map[i][j].id() == id) {
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

Map.prototype.is_connected = function(x,y) {
  for (var i = 0; i < this._room_connections.length; i++) {
    var c = this._room_connections[i];
    if (c.x == x && c.y == y) return true;
    if (c.x == y && c.y == x) return true;
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

  hole_position = new Array();
  for (var i = 0; i < MAP_HEIGHT*2+1; i++) {
    hole_position[i] = new Array();
    for (var j = 0; j < MAP_WIDTH*2+1; j++) {
      hole_position[i][j] = -1;
    }
  }
  for (var i = 0; i < MAP_HEIGHT; i++) {
    for (var j = 0; j < MAP_WIDTH; j++) {
      var ry = i + this._dy[MAP_RIGHT];
      var rx = j + this._dx[MAP_RIGHT];
      var cur_id = this._room_map[i][j].id();
      var right_id = rx < MAP_WIDTH ? this._room_map[ry][rx].id() : -1;
      var dy = i + this._dy[MAP_DOWN];
      var dx = j + this._dx[MAP_DOWN];
      var down_id = dy < MAP_HEIGHT ? this._room_map[dy][dx].id() : -1;

      if (right_id >= 0 && this.is_connected(cur_id, right_id)) {
        hole_position[ry*2+1][rx*2] = utils.rand_int(room.ROOM_HEIGHT >> 1);
      }
      if (down_id >= 0 && this.is_connected(cur_id, down_id)) {
        hole_position[dy*2][dx*2+1] = utils.rand_int(room.ROOM_WIDTH >> 1);
      }
    }
  }
  for (var i = 0; i < MAP_HEIGHT; i++) {
    for (var j = 0; j < MAP_WIDTH; j++) {
      var ay = i*2+1;
      var ax = j*2+1;
      this._room_map[i][j].generate_walls(hole_position[ay-1][ax],hole_position[ay][ax+1],hole_position[ay+1][ax],hole_position[ay][ax-1]);
    }
  }
  this.generate_items(item.ITEM_BOOK_FIREBALL, 3, undefined);
  this.generate_items(item.ITEM_BOOK_LIGHTNING, 3, undefined);
}

exports.Map = Map;
exports.MAP_UP = MAP_UP;
exports.MAP_RIGHT = MAP_RIGHT;
exports.MAP_DOWN = MAP_DOWN;
exports.MAP_LEFT = MAP_LEFT;
exports.NUM_ROOMS = NUM_ROOMS;
