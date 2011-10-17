var gamejs = require('gamejs');
var drawing = require('gamejs/draw');
var sprite = require('gamejs/sprite');
var assert = require('assert');

var EFFECT_FIREBALL = 1;
var EFFECT_LIGHTNING = 2;
var EFFECT_LIGHTNING_LINE = 3;
var EFFECT_DEAD_RED_ROBOT = 0;
var EFFECT_DEAD_YELLOW_ROBOT = 1;
var EFFECT_DEAD_ORANGE_ROBOT = 2;
var EFFECT_DEAD_TRACTOR1_ROBOT = 3;
var EFFECT_DEAD_TRACTOR2_ROBOT = 4;

var INITIAL_SIZE = 40;

gamejs.preload(['graphics/projectiles/fireball.png',
                'graphics/projectiles/lightning.png']);

var dead_robot_images = [
'graphics/robots/orange_death.png',
'graphics/robots/yellow_death.png',
'graphics/robots/red_death.png',
'graphics/robots/tractor1_death.png',
'graphics/robots/tractor2_death.png', ];
gamejs.preload(dead_robot_images);

// rect - rectangle with (left, top) specifying where to put effect's center
// time - time for the effect to die, in milliseconds
function Effect(rect, type, end_size, end_time) {
  Effect.superConstructor.apply(this, arguments);
  this.type = type;
  this.rect = new gamejs.Rect([rect.left - INITIAL_SIZE / 2, rect.top - INITIAL_SIZE / 2],
      [INITIAL_SIZE, INITIAL_SIZE]);
  this.alpha = 1;
  this.end_size = end_size;
  this.timer = 0;
  this.end_time = end_time;
  this.expired = false;
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
    var size = this.end_size * this.timer / this.end_time;
    this.rect = new gamejs.Rect([center[0] - size / 2, center[1] - size / 2], [size, size]);
    this.alpha = this.timer / this.end_time;
}

Effect.prototype.draw = function(display) {
  //window.console.log('effect draw');
  var mainSurface = gamejs.display.getSurface();
  this.image.setAlpha(this.alpha);
  mainSurface.blit(this.image, this.rect);
}

// rect - rectangle with (left, top) specifying where to put effect's center
// time - time for the effect to die, in milliseconds
function DeathEffect(rect, type, end_time) {
  DeathEffect.superConstructor.apply(this, arguments);
  this.type = type;
  this.rect = rect;
  this.timer = 0;
  this.end_time = end_time;
  this.expired = false;
  switch (type) {
    case EFFECT_DEAD_RED_ROBOT:
      this.image = gamejs.image.load(dead_robot_images[EFFECT_DEAD_RED_ROBOT]);
      break;
    case EFFECT_DEAD_YELLOW_ROBOT:
      this.image = gamejs.image.load(dead_robot_images[EFFECT_DEAD_YELLOW_ROBOT]);
      break;
    case EFFECT_DEAD_ORANGE_ROBOT:
      this.image = gamejs.image.load(dead_robot_images[EFFECT_DEAD_ORANGE_ROBOT]);
      break;
    case EFFECT_DEAD_TRACTOR1_ROBOT:
      this.image = gamejs.image.load(dead_robot_images[EFFECT_DEAD_TRACTOR1_ROBOT]);
      break;
    case EFFECT_DEAD_TRACTOR2_ROBOT:
      this.image = gamejs.image.load(dead_robot_images[EFFECT_DEAD_TRACTOR2_ROBOT]);
      break;
    default:
      assert.assert(false, "effect type unsupported : " + type);
  }
}

gamejs.utils.objects.extend(DeathEffect, sprite.Sprite);

DeathEffect.prototype.update = function(ms) {
  this.timer += ms;
  if (this.timer >= this.end_time) {
    this.expired = true;
    return;
  }
}

DeathEffect.prototype.draw = function(display) {
  var mainSurface = gamejs.display.getSurface();
  this.image.setAlpha(0);
  mainSurface.blit(this.image, this.rect);
}

exports.Effect = Effect;
exports.DeathEffect = DeathEffect;
exports.EFFECT_FIREBALL = EFFECT_FIREBALL;
exports.EFFECT_LIGHTNING = EFFECT_LIGHTNING;
