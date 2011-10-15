var gamejs = require('gamejs');
var drawing = require('gamejs/draw');
var assert = require('assert');
var sprite = require('gamejs/sprite');

var PROJECTILE_WIDTH = 20;
var PROJECTILE_HEIGHT = 20;

var MAX_PROJECTILE_SPEED = 250; // pixels per second

gamejs.preload(['graphics/projectiles/fireball.png']);

// rect - bounding rectangle at the construction time
// speed - direction vector, not necessarily normalized
function Projectile(rect, speed) {
  Projectile.superConstructor.apply(this, arguments);
  this.image = gamejs.image.load("graphics/projectiles/fireball.png");
  this.rect = new gamejs.Rect([rect.left, rect.top], [PROJECTILE_WIDTH, PROJECTILE_HEIGHT]);

  var len = Math.sqrt(speed[0] * speed[0] + speed[1] * speed[1]);
  assert(len > 0.0001, "direction is not well defined");
  this.speed = [speed[0] * MAX_PROJECTILE_SPEED / len, speed[1] * MAX_PROJECTILE_SPEED / len];
}

gamejs.utils.objects.extend(Projectile, sprite.Sprite);

Player.prototype.update = function(ms) {
  var dx = this.speed[0] * ms / 1000;
  var dy = this.speed[1] * ms / 1000;
  this.rect.left += dx;
  this.rect.top += dy;
}

exports.Projectile = Projectile;
exports.PROJECTILE_WIDTH = PROJECTILE_WIDTH;
exports.PROJECTILE_HEIGHT = PROJECTILE_HEIGHT;
