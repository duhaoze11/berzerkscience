var gamejs = require('gamejs');
var drawing = require('gamejs/draw');
var sprite = require('gamejs/sprite');
var assert = require('assert');

var alphabet = 'abcdefghijklmnopqrstuvwxyz0123456789 ';
var LETTER_WIDTH = 13;
var LETTER_HEIGHT = 21;

gamejs.preload(['graphics/screens/alphabet.png']);

var global_font = new Font();

function Font() {
}

Font.prototype.Init = function() {
  this.image = gamejs.image.load('graphics/screens/alphabet.png');
}

Font.prototype.generate_surface = function(text) {
  text = text.toLowerCase();
  var rect = new gamejs.Rect([0, 0], [text.length * LETTER_WIDTH, LETTER_HEIGHT]);
  var surface = new gamejs.Surface(rect);
  for (var i = 0; i < text.length; i++) {
    var letter = text.charAt(i);
    var index = alphabet.indexOf(letter);
    if (index == -1) {
      index = alphabet.length;
    }
    surface.blit(this.image,
                 new gamejs.Rect([i * LETTER_WIDTH, 0], [LETTER_WIDTH, LETTER_HEIGHT]),
                 new gamejs.Rect([index * (LETTER_WIDTH-1), 0], [LETTER_WIDTH, LETTER_HEIGHT]))
  }
  return surface;
}

exports.global_font = global_font;
exports.LETTER_HEIGHT = LETTER_HEIGHT;
exports.LETTER_WIDTH = LETTER_WIDTH;
