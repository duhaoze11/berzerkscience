var gamejs = require('gamejs');
var drawing = require('gamejs/draw');
var sprite = require('gamejs/sprite');
var assert = require('assert');

var EFFECT_FIREBALL = 1;
var EFFECT_LIGHTNING = 2;
var EFFECT_LIGHTNING_LINE = 3;

var INITIAL_SIZE = 40;

gamejs.preload(['graphics/projectiles/fireball.png',
                'graphics/projectiles/lightning.png']);

// rect - rectangle with (left, top) specifying where to put effect's center
// time - time for the effect to die, in milliseconds
function Effect(rect, type, end_size, end_time) {
  Effect.superConstructor.apply(this, arguments);
  this.type = type;
  this.rect = new gamejs.Rect([rect.left - INITIAL_SIZE / 2, rect.top - INITIAL_SIZE / 2],
                              [INITIAL_SIZE, INITIAL_SIZE]);
  this.end_size = end_size;
  this.timer = 0;
  this.end_time = end_time;
  this.expired = false;
  this.alpha = 1;
  switch (type) {
    case EFFECT_FIREBALL:
      this.image = gamejs.image.load("graphics/projectiles/fireball.png");
      break;
    case EFFECT_LIGHTNING:
      this.image = gamejs.image.load("graphics/projectiles/lightning.png");
      break;
    default:
      assert.assert(false, "effect type unsupported : " + type);
  }
}

gamejs.utils.objects.extend(Effect, sprite.Sprite);

Effect.prototype.update = function(ms) {
  this.timer += ms;
  if (this.timer >= this.end_time) {
    this.expired = true;
    return;
  }
  var center = [this.rect.left + this.rect.width / 2, this.rect.top + this.rect.height / 2];
  window.console.log('center : ' + center);
  var size = this.end_size * this.timer / this.end_time;
  this.rect = new gamejs.Rect([center[0] - size / 2, center[1] - size / 2], [size, size]);
  this.alpha = this.timer / this.end_time;
}

Effect.prototype.draw = function(display) {
  window.console.log('effect draw');
  var mainSurface = gamejs.display.getSurface();
  this.image.setAlpha(this.alpha);
  mainSurface.blit(this.image, this.rect);
}

exports.Effect = Effect;
exports.EFFECT_FIREBALL = EFFECT_FIREBALL;
exports.EFFECT_LIGHTNING = EFFECT_LIGHTNING;
