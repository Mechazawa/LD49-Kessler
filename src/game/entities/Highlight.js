import AbstractEntity from './AbstractEntity';
import game from '../index';
import textures from 'svg-to-png-loader?width=100&height=100&name=images/[name]-[width]x[height].png!@/assets/highlight.svg';
import { first } from '../../utils';

export default class Highlight extends AbstractEntity {
  static texture = first(textures);

  /**
   * @type {Orbital}
   */
  target;

  constructor (target) {
    super();

    this.target = target;

    this.sprite.anchor.set(0.5, 0.5);
    this.sprite.position.set(target.sprite.x, target.sprite.y);
    this.sprite.scale.x = (target.collisionRadius + 50) / 100;
    this.sprite.scale.y = (target.collisionRadius + 50) / 100;

    game.stage.addChildAt(this.sprite, 0);

    this.sprite.interactive = true;
    this.sprite.buttonMode = true;

    this.sprite.on('pointerdown', () => this.destroy());
  }

  tick (delta) {
    this.dead |= this.target.dead;
  }

  update (delta) {
    super.update(delta);

    this.sprite.x = this.target.sprite.x;
    this.sprite.y = this.target.sprite.y;
  }
}
