var gamejs = require('gamejs');
var assert = require('assert');
var drawing = require('gamejs/draw');
var game_state = require('game_state');
var vectors = require('gamejs/utils/vectors');
var main = require('main');
var unit = require('unit');

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

Enemy.prototype._select_new_waypoint = function() {
  return [this.rect.left + 40 * Math.random() - 20, this.rect.top + 40 * Math.random() - 20];
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
