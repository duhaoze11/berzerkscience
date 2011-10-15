var gamejs = require('gamejs');
var drawing = require('gamejs/draw');
var wall = require('wall');
var enemy = require('enemy');
var edge = require('edge');
var assert = require('assert');
var main = require('main');
var utils = require('utils');
var map = require('map');
var game_state = require('game_state');
var unit = require('unit');

var ROOM_HEIGHT = exports.ROOM_HEIGHT = 7;
var ROOM_WIDTH = exports.ROOM_WIDTH = 9;

var WALL_SMALL = 25;
var WALL_BIG = 175;

var floorImages =(['graphics/floor/abstract1.png',
                   'graphics/floor/abstract2.png',
                   'graphics/floor/wood1.png',
                   'graphics/floor/abstract3.png',
                   'graphics/floor/tile1.png']);
gamejs.preload(floorImages);

function Room(id) {
  this._id = id;
  this._state = new Array();
  for (var i = 0; i < ROOM_HEIGHT; i++) {
    this._state[i] = new Array();
    for (var j = 0; j < ROOM_WIDTH; j++) {
      this._state[i][j] = 0;
    }
  }
  var index = utils.rand_int(floorImages.length);
  // TODO(zvold): preload the images to global state and reuse image objects here
  this.floorTile = gamejs.image.load(floorImages[index]);
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
exports.get_edge = get_edge;

function get_width(p) {
  return ((p % 2) == 0) ? WALL_SMALL : WALL_BIG;
}

function get_type(x, y) {
  return (x % 2) + (y % 2) * 2;
}

Room.prototype.calculate_distances_from_start = function(parent) {
  var m = game_state.game_state.map;
  if (parent < 0) {
    this._distance_from_start = 0;
  } else {
    this._distance_from_start = m.get(parent)._distance_from_start+1;
  }
  var v = this.id();
  for (var i = 1; i < ROOM_HEIGHT; i+=2) {
    if (this.get(i,0) == 0) {
      var p = m.get_neighbour(v, map.MAP_LEFT);
      if (p != parent) {
        m.get(p).calculate_distances_from_start(v);
      }
    }
    if (this.get(i,ROOM_WIDTH-1) == 0) {
      var p = m.get_neighbour(v, map.MAP_RIGHT);
      if (p != parent) {
        m.get(p).calculate_distances_from_start(v);
      }
    }
  }
  for (var i = 1; i < ROOM_WIDTH; i+=2) {
    if (this.get(0,i) == 0) {
      var p = m.get_neighbour(v, map.MAP_UP);
      if (p != parent) {
        m.get(p).calculate_distances_from_start(v);
      }
    }
    if (this.get(ROOM_HEIGHT-1, i) == 0) {
      var p = m.get_neighbour(v, map.MAP_DOWN);
      if (p != parent) {
        m.get(p).calculate_distances_from_start(v);
      }
    }
  }
}

Room.prototype.draw = function(display) {
  var mainSurface = gamejs.display.getSurface();

  var TILE_SIZE = WALL_BIG + WALL_SMALL;
  for (var i = 0; i < 1 + main.SCREEN_WIDTH / TILE_SIZE; i++) {
    for (var j = 0; j < 1 + main.SCREEN_HEIGHT / TILE_SIZE; j++) {
      mainSurface.blit(this.floorTile, [i * TILE_SIZE, j * TILE_SIZE]);
    }
  }

  for (var i = 0; i < this._walls_to_draw.length; i++) {
    var w = this._walls_to_draw[i];
    assert.assert(w.rect.top + w.rect.height <= main.SCREEN_HEIGHT, "y out of screen");
    assert.assert(w.rect.left + w.rect.width <= main.SCREEN_WIDTH, "x out of screen");
    w.draw(mainSurface);
  }

  for (var i = 0; i < this._robots.length; i++) {
    var r = this._robots[i];
    if (r.state == enemy.Enemy.StateEnum.DEAD) {
      continue;
    }
    r.draw(mainSurface);
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

Room.prototype._get_initial_number_of_robots = function() {
  return this._distance_from_start * 5 + 10;
}

Room.prototype._generate_robot_position = function() {
  var r = game_state.current_room;
  for (var tries = 0;tries < 50; tries++) {
    var rect = new gamejs.Rect(Math.random() * (main.SCREEN_WIDTH - enemy.ENEMY_WIDTH), Math.random() * (main.SCREEN_HEIGHT - enemy.ENEMY_HEIGHT), enemy.ENEMY_WIDTH, enemy.ENEMY_HEIGHT);
    var u = new unit.Unit();
    u.rect = rect;
    if (u._can_be_placed(rect.left, rect.top)) {
      return rect;
    }
  }
  return undefines;
}

Room.prototype.generate_robots = function() {
  this._robots = new Array();
  for (var i = 0; i < this._get_initial_number_of_robots(); i++) {
    this._robots[i] = new enemy.Enemy(utils.rand_int(enemy.number_of_kinds), this._generate_robot_position());
    if (this._robots[i].rect == undefined) {
      alert('born dead');
      this._robots[i].become_dead();
    }
  }
}

Room.prototype._update_room_map = function() {
  var queue = new Array();
  var fr = 0;
  var ba = 0;
  var r = [game_state.game_state.player.rect.left, game_state.game_state.player.rect.top];
  var dist = new Array();
  for (var i = 0; i < ROOM_HEIGHT; i++) {
    dist[i] = new Array();
    for (var j = 0; j < ROOM_WIDTH; j++) {
      dist[i][j] = 100000;
      if (this.get(i,j) == 1) continue;
      var x0 = get_edge(j);
      var y0 = get_edge(i);
      var dx = get_edge(j+1);
      var dy = get_edge(i+1);
      if (x0 <= r[0] && x0+dx >= r[0] && y0 <= r[1] && y0+dy >= r[1]) {
        dist[i][j] = 0;
        queue[fr] = [i,j];
        fr++;
      }
    }
  }
  var dx = [0,1,0,-1];
  var dy = [1,0,-1,0];
  for (;ba < fr; ba++) {
    var a = queue[ba][0];
    var b = queue[ba][1];
    for (var d = 0; d < 4; d++) {
      var aa = a+dy[d];
      var bb = b+dx[d];
      if (aa < 0 || bb < 0 || aa >= ROOM_HEIGHT || bb >= ROOM_WIDTH) continue;
      if (this.get(aa,bb) == 1) continue;
      if (dist[aa][bb] <= dist[a][b] + 1) continue;
      dist[aa][bb] = dist[a][b] + 1;
      queue[fr] = [aa,bb];
      fr++;
    }
  }
  this._cell_map = dist;
  for (var i = 0; i < ROOM_HEIGHT; i++) {
    s = '';
    for (var j = 0; j < ROOM_WIDTH; j++) {
      s += dist[i][j] + ' ';
    }
    window.console.log(s);
  }
}

Room.prototype.update = function(ms) {
  this._update_room_map();
  for (var i = 0; i < this._robots.length; i++) {
    var r = this._robots[i];
    if (r.state == enemy.Enemy.StateEnum.DEAD) continue;
    r.update(ms);
  }
}

Room.prototype.wall_collides_line = function(point1, point2) {
  for (var i = 0; i < this._walls_to_draw.length; i++) {
    if (this._walls_to_draw[i].rect.collideLine(point1, point2)) {
      return true;
    }
  }
  return false;
}

exports.Room = Room;
