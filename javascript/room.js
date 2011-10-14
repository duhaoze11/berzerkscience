var gamejs = require('gamejs');
var drawing = require('gamejs/draw');

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

Room.prototype.get = function(x,y) {
  return Math.floor(Math.random() * 3);
//  return this._state[y][x];
}

function get_edge(p) {
  return left = (Math.floor(p / 2) * (WALL_BIG + WALL_SMALL)) + ((p % 2) * WALL_SMALL);
}

function get_width(p) {
  return ((p % 2) == 0) ? WALL_SMALL : WALL_BIG;
}

Room.prototype.draw = function(display) {
  for (var i=0; i<ROOM_WIDTH; i++) {
    for (var j=0; j<ROOM_HEIGHT; j++) {
      var left = get_edge(i);
      var width = get_width(i);
      var up = get_edge(j);
      var height = get_width(j);
      if (this.get(i, j) == 1) {
        drawing.rect(display, '#0000ff', new gamejs.Rect([left, up], [width, height]), 1);
      }
    }
  }
}

Room.prototype.generate_walls = function(pos_up, pos_right, pos_down, pos_left) {
  for (var i = 0; i < ROOM_HEIGHT; i++) {
    for (var j = 0; j < ROOM_WIDTH; j++) {
      this._state[i][j] = 0;
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
}

exports.Room = Room;

