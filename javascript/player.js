var gamejs = require('gamejs');
var drawing = require('gamejs/draw');

var START_X = 312;
var START_Y = 312;

var PLAYER_WIDTH = 40;
var PLAYER_HEIGHT = 40;

var MAX_SPEED = 4; // pixels per second

gamejs.preload(['graphics/wizard/left.png']);

function Player() {
  Player.superConstructor.apply(this, arguments);
  this.image = gamejs.image.load("graphics/wizard/left.png");
  this.rect = new gamejs.Rect([START_X - PLAYER_WIDTH / 2, START_Y - PLAYER_HEIGHT / 2],
                              [PLAYER_WIDTH, PLAYER_HEIGHT]);
  this.speed = [0, 0];
}

gamejs.utils.objects.extend(Player, gamejs.sprite.Sprite);

Player.prototype.speed_up = function(e) {
  switch (e.key) {
    case gamejs.event.K_w:
      if (this.speed[1] > -MAX_SPEED) {
        this.speed[1]--;
      }
      break;
    case gamejs.event.K_s:
      if (this.speed[1] < MAX_SPEED) {
        this.speed[1]++;
      }
      break;
    case gamejs.event.K_a:
      if (this.speed[0] > -MAX_SPEED) {
        this.speed[0]--;
      }
      break;
    case gamejs.event.K_d:
      if (this.speed[0] < MAX_SPEED) {
        this.speed[0]++;
      }
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

Player.prototype.processUserInput = function(event) {
  if (event.type === gamejs.event.KEY_DOWN) {
    this.speed_up(event);
  } else if (event.type === gamejs.event.KEY_UP) {
    this.slow_down(event);
  }
}

exports.Player = Player;

