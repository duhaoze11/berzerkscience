var gamejs = require('gamejs');
var mixer = require('gamejs/mixer');
var assert = require('assert');

var sound_files = new Array();
var ENEMY_SHOT = exports.ENEMY_SHOT = 0;
var FIREBALL_SHOT = exports.FIREBALL_SHOT = 1;
var LIGHTNING_SHOT = exports.LIGHTNING_SHOT = 2;
var FIREBALL_EXPLODE = exports.FIREBALL_EXPLODE = 3;
var LIGHTNING_EXPLODE = exports.LIGHTNING_EXPLODE = 4;
var SCREEN_CHANGE = exports.SCREEN_CHANGE = 5;
var FIRE_BOOK_PICKED_UP = exports.FIRE_BOOK_PICKED_UP = 6;
var LIGHTNING_BOOK_PICKED_UP = exports.LIGHTNING_BOOK_PICKED_UP = 7;
var UNICORN_PICKED_UP = exports.UNICORN_PICKED_UP = 8;
var PLAYER_HIT = exports.PLAYER_HIT = 9;
var PLAYER_COLLIDED_WITH_ENEMY = exports.PLAYER_COLLIDED_WITH_ENEMY = 10;
sound_files[ENEMY_SHOT] = 'sounds/enemy_shot.wav';
sound_files[FIREBALL_SHOT] = 'sounds/fireball_shot.wav';
sound_files[LIGHTNING_SHOT] = 'sounds/lightning_shot.wav';
sound_files[FIREBALL_EXPLODE] = 'sounds/explode.wav';
sound_files[LIGHTNING_EXPLODE] = 'sounds/explode.wav';
sound_files[SCREEN_CHANGE] = 'sounds/screen_change.wav';
sound_files[FIRE_BOOK_PICKED_UP] = 'sounds/pickup.wav';
sound_files[LIGHTNING_BOOK_PICKED_UP] = 'sounds/pickup.wav';
sound_files[UNICORN_PICKED_UP] = 'sounds/pickup.wav';
sound_files[PLAYER_HIT] = 'sounds/player_hit.wav';
sound_files[PLAYER_COLLIDED_WITH_ENEMY] = 'sounds/player_collided_with_enemy.wav';
gamejs.preload(sound_files);

function PlaySound(type) {
  assert.assert(type >= 0 && type < sound_files.length);
  var s = new mixer.Sound(sound_files[type]);
  s.play();
}

exports.PlaySound = PlaySound;
