var gamejs = require('gamejs');
var drawing = require('gamejs/draw');
var assert = require('assert');
var sprite = require('gamejs/sprite');
var main = require('main');
var enemy = require('enemy');
var game_state = require('game_state');

var PROJECTILE_WIDTH = 20;
var PROJECTILE_HEIGHT = 20;

function ProjStats(speed, radius) {
  this.speed = speed;
  this.radius = radius;
}

var proj_properties = [[], // no weapon
                       [  new ProjStats(0, 0), // fireball
                          new ProjStats(200, 40),
                          new ProjStats(300, 60),
                          new ProjStats(350, 100)],
                       [   // lightning
                          new ProjStats(0, 0),
                          new ProjStats(300, 0),
                          new ProjStats(350, 50),
                          new ProjStats(0, 200)
                      ],
                      [   new ProjStats(0,0), // enemy bullet
                          new ProjStats(150, 50),
                          new ProjStats(150, 50),
                          new ProjStats(150, 50),
                      ],
                      ];

var WEAPON_NONE = 0;
var WEAPON_FIREBALL = 1;
var WEAPON_LIGHTNING = 2;
var WEAPON_ENEMY_BULLET = 3;

var MAX_WEAPON_LEVEL = 3;

gamejs.preload(['graphics/projectiles/fireball.png']);

// rect - rectangle with (left, top) specifying where to put projectile's center
// speed - direction vector, not necessarily normalized
function Projectile(rect, speed, type, level) {
  Projectile.superConstructor.apply(this, arguments);
  assert.assert(type != WEAPON_NONE, "invalid weapon type");
  assert.assert(level != 0, "invalid weapon level");
  
  switch (type) {
    case WEAPON_FIREBALL:
      this.image = gamejs.image.load("graphics/projectiles/fireball.png");
      break;
    case WEAPON_LIGHNING:
      this.image = gamejs.image.load("graphics/projectiles/fireball.png");
      break;
    default:
      assert.assert(false, "weapon type unsupported");
  }
  assert.assert(level < proj_properties[type].length, "unknown weapon level");
  var props = proj_properties[type][level];

  this.rect = new gamejs.Rect([rect.left - PROJECTILE_WIDTH / 2, rect.top - PROJECTILE_HEIGHT / 2],
                              [PROJECTILE_WIDTH, PROJECTILE_HEIGHT]);
  var len = Math.sqrt(speed[0] * speed[0] + speed[1] * speed[1]);
  assert.assert(len > 0.0001, "direction is not well defined");
  this.speed = [speed[0] * props.speed / len, speed[1] * props.speed / len];
  this.radius = props.radius;
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

Projectile.prototype.collides = function(sprites) {
  for (var i = 0; i < sprites.length; i++) {
    if (this.rect.collideRect(sprites[i].rect)) {
      return true;
    }
  }
  return false;
}

Projectile.prototype.explode = function(room, kills_robots, kills_player) {
    /**
  if (this.radius == 0) {
    this._kill_single();
  } else {
    var new_robots = new Array();
    var center = [this.rect.left + PROJECTILE_WIDTH / 2, this.rect.top + PROJECTILE_HEIGHT / 2];

    if (kills_robots) {
      for (var i = 0; i < room._robots.length; i++) {
        var robot = room._robots[i];
        var robot_center = [robot.rect.left + enemy.ENEMY_WIDTH / 2, robot.rect.top + enemy.ENEMY_HEIGHT / 2];
        var dx = center[0] - robot_center[0];
        var dy = center[1] - robot_center[1];
        var len = Math.sqrt(dx * dx + dy * dy);
        if (len > this.radius || room.wall_collides_line(center, robot_center)) {
          new_robots.push(robot);
        } else {
          window.console.log('hit');
        }
      }
      room._robots = new_robots;
    }
    if (kills_player) {
      var p = game_state.game_state.player;
      var r = p.rect;
      var player_center = [r.left + player.PLAYER_WIDTH * 0.5, r.top + player.PLAYER_HEIGHT * 0.5];
      var dx = center[0] - player_center[0];
      var dy = center[1] - player_center[1];
      var len = Math.sqrt(dx*dx + dy*dy);
      if (len > this.radius || room.wall_collides_line(center, player_center)) {

      } else {
        game_state.game_state.reinit_room();
      }
    }
  }
    */
}

exports.Projectile = Projectile;
exports.PROJECTILE_WIDTH = PROJECTILE_WIDTH;
exports.PROJECTILE_HEIGHT = PROJECTILE_HEIGHT;

exports.WEAPON_NONE = WEAPON_NONE;
exports.WEAPON_FIREBALL = WEAPON_FIREBALL;
exports.WEAPON_LIGHTNING = WEAPON_LIGHTNING;
exports.WEAPON_ENEMY_BULLET = WEAPON_ENEMY_BULLET;
