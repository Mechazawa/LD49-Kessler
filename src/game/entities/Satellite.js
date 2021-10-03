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

const hashSpeed = Number.parseFloat(new URLSearchParams(location.hash.substr(1)).get('speed') ?? 0.3);

console.log('🚀 speed: ' + hashSpeed);

export default class Satellite extends Orbital {
  static texture = first(textures);

  speed = hashSpeed;

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
    this.trail.tick();
    super.tick(delta);

    if (this.selected) {
      this._handleInput();
    }
  }

  _handleInput () {
    if (this.controls.up.pressed) this.sprite.vy += this.speed;

    if (this.controls.down.pressed) this.sprite.vy -= this.speed;

    if (this.controls.left.pressed) this.sprite.vx += this.speed;

    if (this.controls.right.pressed) this.sprite.vx -= this.speed;
  }

  destroy () {
    super.destroy();

    this.trail.destroy();

    Object
      .values(this.controls)
      .forEach(c => c.destroy?.());
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
