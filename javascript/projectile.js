var gamejs = require('gamejs');
var drawing = require('gamejs/draw');
var assert = require('assert');
var sprite = require('gamejs/sprite');
var main = require('main');

var PROJECTILE_WIDTH = 20;
var PROJECTILE_HEIGHT = 20;

var MAX_PROJECTILE_SPEED = 250; // pixels per second

gamejs.preload(['graphics/projectiles/fireball.png']);

// rect - rectangle with (left, top) specifying where to put projectile's center
// speed - direction vector, not necessarily normalized
function Projectile(rect, speed) {
  Projectile.superConstructor.apply(this, arguments);
  this.image = gamejs.image.load("graphics/projectiles/fireball.png");
  this.rect = new gamejs.Rect([rect.left - PROJECTILE_WIDTH / 2, rect.top - PROJECTILE_HEIGHT / 2],
                              [PROJECTILE_WIDTH, PROJECTILE_HEIGHT]);

  var len = Math.sqrt(speed[0] * speed[0] + speed[1] * speed[1]);
  assert.assert(len > 0.0001, "direction is not well defined");
  this.speed = [speed[0] * MAX_PROJECTILE_SPEED / len, speed[1] * MAX_PROJECTILE_SPEED / len];
}

gamejs.utils.objects.extend(Projectile, sprite.Sprite);

Projectile.prototype.update = function(ms) {
  var dx = this.speed[0] * ms / 1000;
  var dy = this.speed[1] * ms / 1000;
  this.rect.left += dx;
  this.rect.top += dy;
}

Projectile.prototype.outside = function() {
  return (this.rect.left < 0 || this.rect.left > main.SCREEN_WIDTH
      || this.rect.top < 0 || this.rect.top > main.SCREEN_HEIGHT);
}

exports.Projectile = Projectile;
exports.PROJECTILE_WIDTH = PROJECTILE_WIDTH;
exports.PROJECTILE_HEIGHT = PROJECTILE_HEIGHT;
