import AbstractEntity from './AbstractEntity';
import game from '../index';
import textures from 'svg-to-png-loader?width=50&height=50&name=[name]-[width]x[height].png!@/assets/satellite1.svg';
import { first } from '../../utils';
import entityStore from '../EntityStore';
import Planet from './Planet';

export default class Satellite extends AbstractEntity {
  static texture = first(textures);

  _angle = 0;
  _gravAccel = 0;
  _radius = 0;

  constructor () {
    super();

    this.sprite.anchor.set(0.5, 0.5);
    this.sprite.position.set(400, 500);

    this.sprite.vx = 1.2;
    this.sprite.vy = 0;

    game.stage.addChild(this.sprite);
  }

  destroy () {

  }

  tick (delta) {
    const planet = Array.from(entityStore.getEntitiesForType(Planet))[0];
    const scale = 10_000;

    const rx = this.sprite.x - planet.sprite.x
    const ry = this.sprite.y - planet.sprite.y

    this._radius = Math.sqrt(rx ** 2 + ry ** 2) * scale;
    this._gravAccel = planet.gravity * (planet.mass / this._radius ** 2);
    this._angle = Math.atan2(rx * scale, ry * scale);

    this.sprite.vx += (Math.sin(this._angle) * this._gravAccel) / scale;
    this.sprite.vy += (Math.cos(this._angle) * this._gravAccel) / scale;
  }

  update (delta) {
    this.sprite.x -= this.sprite.vx;
    this.sprite.y -= this.sprite.vy;
  }
}
