var gamejs = require('gamejs');
var drawing = require('gamejs/draw');

// type is poor man's enum
// 0 - small x small (small square wall)
// 1 - big x small (horizontal wall)
// 2 - small x big (vertical wall)
// 3 - big x big (big open room)
function Wall(type, rect) {
  Wall.superConstructor.apply(this, arguments);
  this._type = type;
  switch (this._type) {
    case 0:
      // not supported
      this.image = gamejs.image.load("graphics/walls/brick3.png");
      break;
    case 1:
      this.image = gamejs.image.load("graphics/walls/brick2.png");
      break;
    case 2:
      this.image = gamejs.image.load("graphics/walls/brick1.png");
      break;
    case 3:
      // not supported
      this.image = gamejs.image.load("graphics/walls/brick1.png");
      break;
  }
  this.rect = new gamejs.Rect(rect);
}

gamejs.utils.objects.extend(Wall, gamejs.sprite.Sprite);

exports.Wall = Wall;

