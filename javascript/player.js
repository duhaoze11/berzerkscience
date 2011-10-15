var gamejs = require('gamejs');
var drawing = require('gamejs/draw');
var unit = require('unit');
var vectors = require('gamejs/utils/vectors');
var projectile = require('projectile');
var game_state = require('game_state');

var START_X = 312;
var START_Y = 312;

var PLAYER_WIDTH = 40;
var PLAYER_HEIGHT = 40;

var MAX_SPEED = 150; // pixels per second
var MAX_PROJECTILES = 5; // maximum number of allowed projectiles

gamejs.preload(['graphics/wizard/left.png']);

function Player() {
  Player.superConstructor.apply(this, arguments);
  this.image = gamejs.image.load("graphics/wizard/left.png");
  this.rect = new gamejs.Rect([START_X - PLAYER_WIDTH / 2, START_Y - PLAYER_HEIGHT / 2],
                              [PLAYER_WIDTH, PLAYER_HEIGHT]);
  this.speed = [0, 0];
  this.num_projectiles = 0;
}

gamejs.utils.objects.extend(Player, unit.Unit);

Player.prototype.speed_up = function(e) {
  switch (e.key) {
    case gamejs.event.K_w:
      this.speed[1] = -MAX_SPEED;
      break;
    case gamejs.event.K_s:
      this.speed[1] = MAX_SPEED;
      break;
    case gamejs.event.K_a:
      this.speed[0] = -MAX_SPEED;
      break;
    case gamejs.event.K_d:
      this.speed[0] = MAX_SPEED;
      break;
  }
}

Player.prototype.slow_down = function(e) {
  switch (e.key) {
    case gamejs.event.K_w:
    case gamejs.event.K_s:
      this.speed[1] = 0;
      break;
    case gamejs.event.K_a:
    case gamejs.event.K_d:
      this.speed[0] = 0;
      break;
  }
}

Player.prototype.center = function() {
  return [this.rect.left + PLAYER_WIDTH / 2, this.rect.top + PLAYER_HEIGHT / 2];
}

Player.prototype.create_projectile = function(e) {
  if (this.num_projectiles >= MAX_PROJECTILES || this.rect.collidePoint(e.pos)) {
    return;
  }
  var player_center = this.center();
  var direction = [e.pos[0] + projectile.PROJECTILE_WIDTH / 2 - player_center[0],
                   e.pos[1] + projectile.PROJECTILE_HEIGHT / 2 - player_center[1]];
  var proj = new projectile.Projectile(new gamejs.Rect(player_center), direction);
  game_state.game_state.add_player_projectile(proj);
}

Player.prototype.processUserInput = function(event) {
  switch (event.type) {
    case gamejs.event.KEY_DOWN:
      this.speed_up(event);
      break;
    case gamejs.event.KEY_UP:
      this.slow_down(event);
      break;
    case gamejs.event.MOUSE_DOWN:
      this.create_projectile(event);
      break;
  }
}

Player.prototype.update = function(ms) {
  var dx = this.speed[0] * ms / 1000;
  var dy = this.speed[1] * ms / 1000;
  this._make_sliding_move(dx,dy);
}

exports.Player = Player;
exports.PLAYER_WIDTH = PLAYER_WIDTH;
exports.PLAYER_HEIGHT = PLAYER_HEIGHT;
