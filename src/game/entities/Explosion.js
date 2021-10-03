import AbstractEntity from './AbstractEntity';
import game from '../index';
import textures
  from 'svg-to-png-loader?width=41&height=56&name=images/[name]-[width]x[height].png!@/assets/explosion.svg';
import { first } from '../../utils';

export default class Explosion extends AbstractEntity {
  static texture = first(textures);

  ttl = 40;

  constructor (x, y) {
    super();

    this.sprite.anchor.set(0.5, 0.5);
    this.sprite.position.set(x, y);
    this.sprite.scale.set(1, 1);

    game.stage.addChild(this.sprite);
  }

  tick (delta) {
    this.ttl -= delta;

    this.dead |= this.ttl < 0;
  }
}
