var gamejs = require('gamejs');
var drawing = require('gamejs/draw');
var game_state = require('game_state');
var vectors = require('gamejs/utils/vectors');
var main = require('main');
var unit = require('unit');

var orange_robot_image = 'graphics/robots/orange.png';
var red_robot_image = 'graphics/robots/orange.png';
var yellow_robot_image = 'graphics/robots/orange.png';
var robot_images = [ orange_robot_image, red_robot_image, yellow_robot_image ];

gamejs.preload(robot_images);

function Enemy(type) {
  Enemy.superConstructor.apply(this, arguments);
  this._type = type;
  if (this._type >= 0 && this.type < robot_images.length) {
    this.image = gamejs.image.load(robot_images[this._type]);
  }
  this.rect = new gamejs.Rect(312,312,40,40);
  this._going_to = [this.rect.left, this.rect.top];
  this._speed = 5;
}

gamejs.utils.objects.extend(Enemy, unit.Unit);

Enemy.prototype._select_new_waypoint = function() {
  return [Math.random() * main.SCREEN_WIDTH, Math.random() * main.SCREEN_HEIGHT];
}

Enemy.prototype.update = function() {
  var pos = [this.rect.left, this.rect.top];
  var dir = vectors.truncate(vectors.subtract(pos, this._going_to), this._speed);
  this._make_sliding_move(dir[0], dir[1]);
  if (vectors.distance(dir) < 5) {
    this._going_to = this._select_new_waypoint();
  }
}


exports.Enemy = Enemy;
