import AbstractEntity from './entities/AbstractEntity';
import game from '../game';
import { Sprite } from 'pixi.js';
import backTexture
  from 'svg-to-png-loader?width=379&height=38&name=images/[name]-[width]x[height].png!@/assets/fuel-gauge-back.svg';
import frontTexture
  from 'svg-to-png-loader?width=380&height=38&name=images/[name]-[width]x[height].png!@/assets/fuel-gauge-front.svg';
import { blockObserver, first } from '../utils';


export class FuelGauge extends AbstractEntity {
  static texture = first(backTexture);
  static texture2 = first(frontTexture);

  constructor (parent, offset = parent.collisionRadius + 20) {
    super();

    this.parent = parent;
    this.offset = offset;

    this.sprite2 = blockObserver(new Sprite(game.loader.resources[first(frontTexture)].texture));

    this.sprite.scale.set(0.2, 0.2);
    this.sprite2.scale.set(0.2, 0.2);
    this.sprite.anchor.set(0.5, 0.5);
    this.sprite2.anchor.set(0.5, 0.5);

    game.stage.addChild(this.sprite);
    game.stage.addChild(this.sprite2);

    window.fuel = this;
  }

  destroy () {
    if (!this.dead) {
      game.stage.removeChild(this.sprite);
      game.stage.removeChild(this.sprite2);

      this.sprite.destroy();
      this.sprite2.destroy();
    }

    super.destroy();
  }

  tick (delta) {
    if (this.parent.dead) {
      this.destroy();
    }
  }

  update (delta) {
    super.update(delta);

    if (!this.parent.dead) {
      this.sprite.x = this.parent.sprite.x;
      this.sprite.y = this.parent.sprite.y + this.offset;
      this.sprite2.x = this.parent.sprite.x;
      this.sprite2.y = this.parent.sprite.y + this.offset;

      // lazy
      this.sprite2.scale.x = Math.max(0, (this.parent.fuel / 200) * this.sprite2.scale.y);
    }
  }
}
