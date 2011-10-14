var gamejs = require('gamejs');
var drawing = require('gamejs/draw');
var wall = require('wall');

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

function get_type(i, j) {
  return Math.floor(i % 2) + Math.floor(j % 2) * 2;
}

Room.prototype.draw = function(display) {
  var mainSurface = gamejs.display.getSurface();
  for (var i=0; i<ROOM_WIDTH; i++) {
    for (var j=0; j<ROOM_HEIGHT; j++) {
      var left = get_edge(i);
      var width = get_width(i);
      var up = get_edge(j);
      var height = get_width(j);
      if (this.get(i, j) == 1) {
        switch (get_type(i, j)) {
          case 0:
          case 3:
            drawing.rect(display, '#0000ff', new gamejs.Rect([left, up], [width, height]), 1);
            break;
          case 1:
          case 2:
            var w = new wall.Wall(get_type(i, j), [left, up]);
            w.draw(mainSurface);
            break;
        }
      }
    }
  }
}

exports.Room = Room;

