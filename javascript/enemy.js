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
  this._going_to = [this.rect.top, this.rect.left];
  this._speed = 5;
}

gamejs.utils.objects.extend(Enemy, unit.Unit);

Enemy.prototype._waypoint_reached = function() {
  var pos = [this.rect.top, this.rect.left];
  return vectors.distance(pos, this._going_to) < 10;
}

Enemy.prototype._select_new_waypoint = function() {
  return [Math.random() * main.SCREEN_HEIGHT, Math.random() * main.SCREEN_WIDTH];
}

Enemy.prototype.update = function() {
  var pos = [this.rect.top, this.rect.left];
  var dir = vectors.truncate(vectors.subtract(pos, this._going_to), this._speed);
  var new_pos = vectors.add(pos,dir);
  if (vectors.distance(dir) >= this._speed && this._can_be_placed(new_pos)) {
    this.rect.top = new_pos[0];
    this.rect.left = new_pos[1];
  } else {
    this._going_to = this._select_new_waypoint();
  }
}

gamejs.utils.objects.extend(Robot, gamejs.sprite.Sprite);

exports.Enemy = Enemy;
