var gamejs = require('gamejs');
var drawing = require('gamejs/draw');
var sprite = require('gamejs/sprite');
var assert = require('assert');
var font = require('font');
var main = require('main');
var game_state = require('game_state');

var GAMESTATE_GAMEOVER = 1;
var GAMESTATE_GAMEWIN = 2;
var GAMESTATE_PLAYING = 1000;
var GAMESTATE_SCREENS = 1001;
var GAMESTATE_INITIALIZING = 6;

var state_machine = [
  // 0th game state is always the start screen
  new GameScreen(undefined, 'start screen',
    [[5, 'BERZERK SCIENCE', -1],
     [15, 'START', GAMESTATE_INITIALIZING],
     [17, 'INSTRUCTIONS', 3],
     [19, 'CREDITS', 5]]),
  // 1th game state is GAMESTATE_GAMEOVER
  new GameScreen(undefined, 'game over screen',
     [[1, 'GAME OVER', -1],
      [20, 'NEXT', 0]]),
  // 2th game state is GAMESTATE_GAMEWIN
  new GameScreen(undefined, 'game win screen',
     [[1, 'YOU HAVE DONE IT', -1],
      [20, 'ONCE MORE', 0]]),
  new GameScreen(undefined, 'instructions 1',
     [[1, 'Some evil scientist', -1],
      [3, 'Has stolen your unicorn', -1],
      [5, 'Your mission is to rescue him', -1],
      [20, 'NEXT', 4]]),
  new GameScreen(undefined, 'instructions 2',
     [[1, 'Use WASD or arrow keys to control', -1],
      [3, 'Cast spells using mouse', -1],
      [5, 'Collect spell books', -1],
      [20, 'DONE', 0]]),
  new GameScreen(undefined, 'credits',
     [[3, 'Programming', -1],
      [5, 'nkurtov', -1],
      [6, 'zvold', -1],
      [10, 'Art', -1],
      [12, 'yuliya', -1],
      [20, 'DONE', 0]]),
  new GameScreen(undefined, 'initializing',
      [[10, 'INITIALIZING', -1]])
  ];

function GameScreen(image_file, name, transitions) {
  this.name = name;
  this.image_file = image_file;
  this.transitions = transitions;
  this.surface = undefined;
}

GameScreen.prototype.generate_surface = function(add_text) {
  if (this.surface != undefined && add_text == undefined) {
    return;
  }
  this.surface = new gamejs.Surface(new gamejs.Rect([0, 0], [main.SCREEN_WIDTH, main.SCREEN_HEIGHT]));
  for (var i = 0; i < this.transitions.length; i++) {
    var transition = this.transitions[i];
    var line_num = transition[0];
    var text = transition[1];
    var surf = font.global_font.generate_surface(text);
    this.surface.blit(surf, [(main.SCREEN_WIDTH - surf.rect.width ) / 2, line_num * surf.rect.height]);
  }

  if (add_text != undefined) {
    for (var j = 0; j < add_text.length; j++) {
      var line_num = add_text[j][0];
      var text = add_text[j][1];
      var surf = font.global_font.generate_surface(text);
      this.surface.blit(surf, [(main.SCREEN_WIDTH - surf.rect.width ) / 2, line_num * surf.rect.height]);
    }
  }
}

GameScreen.prototype.draw = function(display, add_text) {
  var mainSurface = gamejs.display.getSurface();
  this.generate_surface(add_text);
  mainSurface.blit(this.surface);
}

GameScreen.prototype.processUserInput = function(event) {
  switch (event.type) {
    case gamejs.event.MOUSE_DOWN:
      for (var i = 0; i < this.transitions.length; i++) {
        var transition = this.transitions[i];
        if (transition[2] == -1) {
          continue;
        }
        var y_coord = transition[0] * font.LETTER_HEIGHT;
        if (event.pos[1] > y_coord && event.pos[1] < y_coord + font.LETTER_HEIGHT) {
          var next_state = transition[2];
          if (next_state == GAMESTATE_INITIALIZING) {
            game_state.game_state.machine_state = GAMESTATE_INITIALIZING;
          } else {
            game_state.game_state.machine_state = GAMESTATE_SCREENS;
            window.console.log('next state: ' + next_state);
            game_state.game_state.machine_screen_id = next_state;
          }
        }
      }
      break;
  }
}

exports.GameScreen = GameScreen;

exports.GAMESTATE_GAMEOVER = GAMESTATE_GAMEOVER;
exports.GAMESTATE_GAMEWIN = GAMESTATE_GAMEWIN;
exports.GAMESTATE_PLAYING = GAMESTATE_PLAYING;
exports.GAMESTATE_SCREENS = GAMESTATE_SCREENS;
exports.GAMESTATE_INITIALIZING = GAMESTATE_INITIALIZING;
exports.state_machine = state_machine;
