var gamejs = require('gamejs');
var drawing = require('gamejs/draw');

var START_X = 312;
var START_Y = 312;

var PLAYER_WIDTH = 40;
var PLAYER_HEIGHT = 40;

gamejs.preload(['graphics/wizard/left.png']);

function Player() {
  Player.superConstructor.apply(this, arguments);
  this.image = gamejs.image.load("graphics/wizard/left.png");
  this.rect = new gamejs.Rect([START_X - PLAYER_WIDTH / 2, START_Y - PLAYER_HEIGHT / 2],
                              [PLAYER_WIDTH, PLAYER_HEIGHT]);
}

gamejs.utils.objects.extend(Player, gamejs.sprite.Sprite);

exports.Player = Player;

