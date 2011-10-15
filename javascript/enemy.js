var gamejs = require('gamejs');
var assert = require('assert');
var drawing = require('gamejs/draw');
var game_state = require('game_state');
var vectors = require('gamejs/utils/vectors');
var main = require('main');
var unit = require('unit');
var astar = require('gamejs/pathfinding/astar');

var ENEMY_WIDTH = exports.ENEMY_WIDTH = 40;
var ENEMY_HEIGHT = exports.ENEMY_HEIGHT = 40;

var orange_robot_image = 'graphics/robots/orange.png';
var red_robot_image = 'graphics/robots/red.png';
var yellow_robot_image = 'graphics/robots/yellow.png';
var tractor1_robot_image = 'graphics/robots/tractor1.png';
var robot_images = [ orange_robot_image, red_robot_image, yellow_robot_image, tractor1_robot_image ];

gamejs.preload(robot_images);

function Enemy(type, rect) {
  Enemy.superConstructor.apply(this, arguments);
  this._type = type;
  assert.assert(this._type >= 0 && this._type < robot_images.length, "Incorrect robot type");
  this.image = gamejs.image.load(robot_images[this._type]);
  this.rect = rect;
  this._going_to = [this.rect.left, this.rect.top];
  this._speed = 0.05;
  this.state = Enemy.StateEnum.ALIVE;
}

gamejs.utils.objects.extend(Enemy, unit.Unit);

Enemy.StateEnum = {
  DEAD : 1,
  ALIVE : 2,
}

function RoomMap(r) {
  var PER_CELL = 4;
  for (var i = 0; i < room.ROOM_HEIGHT; i++) {
    for (var j = 0; j < room.ROOM_WIDTH; j++) {
      for (var k = 0; k < PER_CELL; k++) {
        for (var l = 0; l < PER_CELL; l++) {
        }
      }
    }
  }
}

Enemy.prototype._select_astar_path = function() {
  return [this.rect.left + Math.random() * 40 - 20, this.rect.top + Math.random() * 40 - 20];
}

Enemy.prototype._select_new_waypoint = function() {
  var p = game_state.game_state.player.rect;
  var line = [ [this.rect.left, this.rect.top], [p.left, p.top] ];
  var r = game_state.game_state.current_room;
  for (var i = 0; i < r._walls_to_draw.length; i++) {
    var z = r._walls_to_draw[i].rect;
    var tocheck = new gamejs.Rect(z.left-ENEMY_WIDTH,z.top-ENEMY_HEIGHT,z.width+ENEMY_WIDTH,z.height+ENEMY_HEIGHT);
    if (tocheck.collideLine(line[0], line[1])) {
      return this._select_astar_path();
    }
  }
  var dir = vectors.subtract([p.left, p.top], [this.rect.left, this.rect.top]);
  var len = vectors.len(dir);
  var eps = 1e-4;
  if (len > eps) {
    var dist_togo = vectors.truncate(len * 0.25);
    var dir_togo = vectors.multiply(vectors.unit(dir), dist_togo);
    return vectors.add([p.left, p.top], dir_togo);
  }
  return [this.rect.left, this.rect.top];
}

Enemy.prototype.update = function(ms) {
  var pos = [this.rect.left, this.rect.top];
  var dir = vectors.truncate(vectors.subtract(this._going_to, pos), this._speed * ms);
  this._make_sliding_move(dir[0], dir[1]);
  if (vectors.len(dir) < this._speed * ms * 0.5) {
    this._going_to = this._select_new_waypoint();
  }
}

Enemy.prototype.become_dead = function() {
  this.state = Enemy.StateEnum.DEAD;
}

exports.Enemy = Enemy;
exports.number_of_kinds = robot_images.length;
