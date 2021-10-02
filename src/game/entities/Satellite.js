import Orbital from './Orbital';
import textures from 'svg-to-png-loader?width=50&height=50&name=[name]-[width]x[height].png!@/assets/satellite-1.svg';
import { first, randInt } from '../../utils';
import Trail from '../Trail';
import game from '../index';
import Satellite1DebrisTiny from './Satellite1DebrisTiny';
import Satellite1DebrisSmall from './Satellite1DebrisSmall';
import Satellite1DebrisBig from './Satellite1DebrisBig';
import entityStore from '../EntityStore';

export default class Satellite extends Orbital {
  static texture = first(textures);

  debris = [
    Satellite1DebrisBig,
    Satellite1DebrisSmall,
    Satellite1DebrisTiny,
  ];

  collisionRadius = 15;

  trail;

  constructor (x, y, vx, vy, points = 30) {
    super(x, y, vx, vy);

    const trailTexture = game.loader.resources['images/trail.png'].texture;

    this.trail = new Trail(this, trailTexture, 20, 100);
    this.points = points;

    this.debris.sort((a, b) => b.price - a.price);
  }

  tick (delta) {
    this.trail.tick();
    super.tick(delta);
  }

  destroy () {
    super.destroy();

    this.trail.destroy();
  }

  explode () {
    this._buyDebris();

    super.explode();
  }

  _buyDebris () {
    while (this.points > 0) {
      for (const _Debris of this.debris) {
        // replace with while for bias
        if (this.points >= _Debris.price) {
          this.points -= _Debris.price;

          let { x, y, vx, vy } = this.sprite;

          vx += randInt(vx * -0.5, vx * 0.5);
          vy += randInt(vy * -0.5, vy * 0.5);

          entityStore.add(new _Debris(x, y, vx, vy));
        }
      }
    }
  }
}
