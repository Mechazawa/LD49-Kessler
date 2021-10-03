import Orbital from './Orbital';
import textures
  from 'svg-to-png-loader?width=50&height=50&name=images/[name]-[width]x[height].png!@/assets/satellite-1.svg';
import { first, randInt } from '../../utils';
import Trail from '../Trail';
import game from '../index';
import Satellite1DebrisTiny from './Satellite1DebrisTiny';
import Satellite1DebrisSmall from './Satellite1DebrisSmall';
import Satellite1DebrisBig from './Satellite1DebrisBig';
import entityStore from '../EntityStore';
import Key from '../input/Key';

export default class Satellite extends Orbital {
  static texture = first(textures);

  speed = 0.05;

  fuel = 200;

  debris = [
    Satellite1DebrisBig,
    Satellite1DebrisSmall,
    Satellite1DebrisTiny,
  ];

  collisionRadius = 15;

  trail;

  controls = {
    up: new Key('w'),
    down: new Key('s'),
    left: new Key('a'),
    right: new Key('d'),
  };

  constructor (x, y, vx, vy, points = 10) {
    super(x, y, vx, vy);

    const trailTexture = game.loader.resources['images/trail.png'].texture;

    this.trail = new Trail(this, trailTexture, 20, 100);
    this.points = points;

    this.debris.sort((a, b) => b.price - a.price);

    // for sat 1
    this.sprite.anchor.set(0.6, 0.6);
  }

  tick (delta) {
    this.trail.tick(delta);
    super.tick(delta);

    if (this.selected) {
      this._handleInput(delta);
    }

  }

  _handleInput (delta) {
    let usesFuel = false;
    const applySpeed = (what, amount, button) => {
      if (this.fuel > 0 && this.controls[button].pressed) {
        this.sprite[what] += amount;

        usesFuel = true;
      }
    };

    applySpeed('vy', this.speed, 'up');
    applySpeed('vy', -this.speed, 'down');
    applySpeed('vx', this.speed, 'left');
    applySpeed('vx', -this.speed, 'right');

    if (usesFuel) {
      this.fuel -= delta;
    }
  }

  destroy () {
    super.destroy();

    this.trail.destroy();

    Object
      .values(this.controls)
      .forEach(c => c.destroy?.());

    this.controls = {}; // otherwise it's going to do it again 😢
  }

  explode () {
    this._buyDebris();

    super.explode();
  }

  _buyDebris () {
    if (this.debris.length === 0) {
      return;
    }

    while (this.points > 0) {
      for (const _Debris of this.debris) {
        // replace with while for bias
        if (this.points >= _Debris.price) {
          this.points -= _Debris.price;

          let { x, y, vx, vy } = this.sprite;

          vx += randInt(vx * -0.5, vx * 0.5);
          vy += randInt(vy * -0.5, vy * 0.5);

          setTimeout(() => entityStore.add(new _Debris(x, y, vx, vy)), randInt(0, 300));
        }
      }
    }
  }
}
