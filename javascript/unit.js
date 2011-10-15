var gamejs = require('gamejs');
var drawing = require('gamejs/draw');
var sprite = require('gamejs/sprite');
var game_state = require('game_state');
var assert = require('assert');
var main = require('main');

function Unit() {
}

gamejs.utils.objects.extend(Unit, sprite.Sprite);

Unit.prototype._can_be_placed = function(pos_x, pos_y) {
  var m = game_state.game_state.map;
  var room_id = game_state.game_state.current_room_id();
  var r = m.get(room_id);

  var rr = new gamejs.Rect(pos_x, pos_y, this.rect.width, this.rect.height);
  for (var i = 0; i < r._walls_to_draw.length; i++) {
    if (rr.collideRect(r._walls_to_draw[i].rect)) {
      return false;
    }
  }
  return true;
}

Unit.prototype._make_sliding_move = function(dx, dy) {
  var cur_pos = [this.rect.left, this.rect.top];
  if (!this._can_be_placed(cur_pos[0], cur_pos[1])) {
    for (var tries = 0; tries < 50; tries++) {
      var x = Math.random * main.SCREEN_WIDTH * 0.3 + main.SCREEN_WIDTH * 0.5;
      var y = Math.random * main.SCREEN_HEIGHT * 0.3 + main.SCREEN_HEIGHT * 0.5;
      if (this._can_be_placed(x,y)) {
        cur_pos = [x,y];
        break;
      }
    }
  }
  assert.assert(this._can_be_placed(cur_pos[0], cur_pos[1]), "must be able to place itself");
  if (!this._can_be_placed(cur_pos[0]+dx, cur_pos[1] )) {
    var l = 0;
    var r = dx;
    for (var t = 0; t < 5; t++) {
      var m = (l+r)*0.5;
      if (!this._can_be_placed(cur_pos[0]+m,cur_pos[1])) {
        r = m;
      } else {
        l = m;
      }
    }
    dx = l;
  }
  this.rect.left += dx;
  if (!this._can_be_placed(cur_pos[0], cur_pos[1]+dy)) {
    var l = 0;
    var r = dy;
    for (var t = 0; t < 5; t++) {
      var m = (l+r)*0.5;
      if (!this._can_be_placed(cur_pos[0], cur_pos[1]+m)) {
        r = m;
      } else {
        l = m;
      }
    }
    dy = l;
  }
  this.rect.top += dy;
}

exports.Unit = Unit;
