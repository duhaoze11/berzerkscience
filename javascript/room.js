var gamejs = require('gamejs');
var drawing = require('gamejs/draw');
var wall = require('wall');
var edge = require('edge');
var assert = require('assert');
var main = require('main');

var ROOM_HEIGHT = 7;
var ROOM_WIDTH = 9;

var WALL_SMALL = 25;
var WALL_BIG = 175;

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

Room.prototype.get = function(i,j) {
  return this._state[i][j];
}

function get_edge(p) {
  return ((p >> 1) * (WALL_BIG + WALL_SMALL)) + ((p % 2) * WALL_SMALL);
}

function get_width(p) {
  return ((p % 2) == 0) ? WALL_SMALL : WALL_BIG;
}

function get_type(x, y) {
  return (x % 2) + (y % 2) * 2;
}

Room.prototype.draw = function(display) {
  var mainSurface = gamejs.display.getSurface();
  for (var i = 0; i < this._walls_to_draw.length; i++) {
    var w = this._walls_to_draw[i];
    window.console.log(w.rect.top+w.rect.height);
    assert.assert(w.rect.top + w.rect.height <= main.SCREEN_HEIGHT, "y out of screen");
    assert.assert(w.rect.left + w.rect.width <= main.SCREEN_WIDTH, "x out of screen");
    w.draw(mainSurface);
  }
}

Room.prototype._build_walls_rects = function() {
  this._walls_to_draw = new Array();
  var walls_cnt = 0;
  for (var i = 0; i < ROOM_HEIGHT; i++) {
    var s = '';
    for (var j = 0; j < ROOM_WIDTH; j++) {
      s += this.get(i,j);
      if (this.get(i,j) == 1) {
        var left = get_edge(i);
        var width = get_width(i);
        var up = get_edge(j);
        var height = get_width(j);
        this._walls_to_draw[walls_cnt] = new wall.Wall(get_type(j, i), new gamejs.Rect(up,left,height,width));
        walls_cnt++;
      }
    }
    window.console.log(s);
  }
  assert.assert(walls_cnt == this._walls_to_draw.length, "incorrect number of walls to draw");
}

Room.prototype.generate_walls = function(pos_up, pos_right, pos_down, pos_left) {
  for (var i = 0; i < ROOM_HEIGHT; i++) {
    for (var j = 0; j < ROOM_WIDTH; j++) {
      if (i > 0 && i+1 < ROOM_HEIGHT && j > 0 && j+1 < ROOM_WIDTH && get_type(i,j) != 3) {
        this._state[i][j] = 1;
      } else {
        this._state[i][j] = 0;
      }
    }
  }

  for (var i = 0; i < ROOM_HEIGHT; i++) {
    this._state[i][0] = this._state[i][ROOM_WIDTH-1] = 1;
  }
  for (var j = 0; j < ROOM_WIDTH; j++) {
    this._state[0][j] = this._state[ROOM_HEIGHT-1][j] = 1;
  }
  if (pos_up >= 0) {
    this._state[0][pos_up*2+1] = 0;
  }
  if (pos_down >= 0) {
    this._state[ROOM_HEIGHT-1][pos_down*2+1] = 0;
  }
  if (pos_right >= 0){
    this._state[pos_right*2+1][ROOM_WIDTH-1] = 0;
  }
  if (pos_left >= 0){
    this._state[pos_left*2+1][0] = 0;
  }
  var edges_count = 0;
  var edges = new Array();
  for (var i = 1; i < ROOM_HEIGHT; i+=2) {
    for (var j = 1; j < ROOM_WIDTH; j+=2) {
      var cur = i*ROOM_WIDTH + j;
      if (j+2 < ROOM_WIDTH) {
        var r = cur + 2;
        edges[edges_count] = new edge.Edge(cur, r);
        edges_count++;
      }
      if (i+2 < ROOM_HEIGHT) {
        var d = cur + ROOM_WIDTH*2;
        edges[edges_count] = new edge.Edge(cur, d);
        edges_count++;
      }
    }
  }
  var cell_connections = edge.Edge.prototype.build_mst(edges);
  for (var i = 0; i < cell_connections.length; i++) {
    var e = cell_connections[i];
    var z1 = e.x;
    var z2 = e.y;
    var x1 = (z1 % ROOM_WIDTH);
    var y1 = (z1 / ROOM_WIDTH) >> 0;
    var x2 = (z2 % ROOM_WIDTH);
    var y2 = (z2 / ROOM_WIDTH) >> 0;
    var x = (x1 + x2) >> 1;
    var y = (y1 + y2) >> 1;
    assert.assert(this._state[y][x] == 1, "There must be a wall");
    this._state[y][x] = 0;
  }

  for (var i = 2; i+3 < ROOM_HEIGHT; i+=2) {
    for (var j = 2; j+3 < ROOM_WIDTH; j+=2) {
      if (this._state[i-1][j] + this._state[i+1][j] + this._state[i][j-1] + this._state[i][j+1] == 0) {
        this._state[i][j] = 0;
      }
    }
  }

  this._build_walls_rects();
}

exports.Room = Room;
exports.ROOM_HEIGHT = ROOM_HEIGHT;
exports.ROOM_WIDTH = ROOM_WIDTH;

