import AbstractEntity from './AbstractEntity';
import game from '../index';
import Key from '../input/Key';
import Mouse from '../input/Mouse';

export default class Cat extends AbstractEntity {
  static texture = 'images/cat.png';

  controls = {
    up: new Key('ArrowUp'),
    down: new Key('ArrowDown'),
    left: new Key('ArrowLeft'),
    right: new Key('ArrowRight'),
    mouse: new Mouse(),
  };

  constructor () {
    super();

    game.stage.addChild(this.sprite);
  }

  destroy () {
    Object
      .values(this.controls)
      .forEach(c => c.destroy?.());
  }

  tick (delta) {
    this.sprite.vx = 0;
    this.sprite.vy = 0;

    if (this.controls.mouse.buttons[0]) {
      this.sprite.x = this.controls.mouse.x;
      this.sprite.y = this.controls.mouse.y;
    } else {
      if (this.controls.up.pressed) this.sprite.vy -= 3;

      if (this.controls.down.pressed) this.sprite.vy += 3;

      if (this.controls.left.pressed) this.sprite.vx -= 3;

      if (this.controls.right.pressed) this.sprite.vx += 3;
    }
  }
}
