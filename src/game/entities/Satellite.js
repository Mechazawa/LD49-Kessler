import AbstractEntity from './AbstractEntity';
import game from '../index';
import textures from 'svg-to-png-loader?width=80&height=80&name=[name]-[width]x[height].png!@/assets/statellite1.svg';
import { first } from '../../utils';

export default class Satellite extends AbstractEntity {
  static texture = first(textures);

  constructor () {
    super();

    this.sprite.anchor.set(0.5, 0.5);
    this.sprite.position.set(400, 300);

    game.stage.addChild(this.sprite);
  }

  destroy () {

  }

  tick (delta) {

  }
}
