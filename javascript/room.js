var gamejs = require('gamejs');
var drawing = require('gamejs/draw');

var ROOM_HEIGHT = 7;
var ROOM_WIDTH = 9;

var WALL_SMALL = 20;
var WALL_BIG = 180;

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

function get_edge(p) {
  return left = (Math.floor(p / 2) * (WALL_BIG + WALL_SMALL)) + ((p % 2) * WALL_SMALL);
}

function get_width(p) {
  return ((p % 2) == 0) ? WALL_SMALL : WALL_BIG;
}

Room.prototype.draw = function(display) {
  for (var i=0; i<ROOM_WIDTH; i++) {
    for (var j=0; j<=ROOM_HEIGHT; j++) {
      var left = get_edge(i);
      var width = get_width(i);
      var up = get_edge(j);
      var height = get_width(j);
      //if (this.get(i, j) == true) {
        drawing.rect(display, '#aaaaaa', new gamejs.Rect([left, up], [width, height]), 2);
        window.console.log('' + left + ', ' + up + ',' + width + ',' + height);
      //}
    }
  }
  display.blit(
      (new gamejs.font.Font('30px Sans-serif')).render(ROOM_HEIGHT)
  );
}

exports.Room = Room

