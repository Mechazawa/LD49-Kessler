import AbstractEntity from './entities/AbstractEntity';
import game from '../game';
import { Graphics } from 'pixi.js';

export class FuelGauge extends AbstractEntity {
  constructor (parent, offset = parent.collisionRadius + 10) {
    super();

    this.parent = parent;
    this.offset = offset;

    this.background = new Graphics();
    // this.background.lineStyle({ width: 1, color: 0x99CCFF, alpha: 1 });
    this.background.beginFill(0xFF9933);
    // this.background.anchor.set(0.5, 0.5);
    this.background.drawRoundedRect(this.parent.sprite.x, this.parent.sprite.y + offset, parent.collisionRadius * 2, 10, 2);
    this.background.endFill();

    this.indicator = new Graphics();
    this.indicator.beginFill(0x00DA22);
    // this.indicator.anchor.set(0.5, 0.5);
    this.indicator.drawRoundedRect(0, 0, parent.collisionRadius * 2, 10, 10);
    this.indicator.endFill();

    game.stage.addChild(this.background);
    game.stage.addChild(this.indicator);

    window.fuel = this;
  }

  destroy () {
    if (!this.dead) {
      game.stage.removeChild(this.background);
      game.stage.removeChild(this.indicator);

      this.background.destroy();
      this.indicator.destroy();
    }

    super.destroy();
  }

  tick (delta) {
    this.dead |= this.parent.dead;

    super.tick(delta);

    if (!this.parent.dead) {
      this.background.x = this.parent.sprite.x;
      this.background.y = this.parent.sprite.y + this.offset;
      this.indicator.x = this.parent.sprite.x;
      this.indicator.y = this.parent.sprite.y + this.offset;

      // lazy
      this.indicator.scale.x = Math.min(0, this.parent.fuel / 200);
    }
  }
}
