var gamejs = require('gamejs');
var drawing = require('gamejs/draw');
var sprite = require('gamejs/sprite');
var game_state = require('game_state');

function Unit() {
}

gamejs.utils.objects.extend(Unit, sprite.Sprite);

Unit.prototype._can_be_placed = function(pos) {
  var m = game_state.game_state.map;
  var room_id = game_state.game_state.current_room_id;
  var r = m.get(room_id);

  var rect = new gamejs.Rect(pos[0], pos[1], this.rect.width, this.rect.height);
  for (var i = 0; i < r._walls_to_draw.length; i++) {
    if (rect.collideRect(r._walls_to_draw[i].rect)) {
      return false;
    }
  }
  return true;
}

exports.Unit = Unit;
