import Orbital from './Orbital';
import { circleIntersect, first, randInt, randomPick } from '../../utils';
import Trail from '../Trail';
import game from '../index';
import entityStore from '../EntityStore';
import Key from '../input/Key';
import CollisionWarning from './CollisionWarning';
import EscapeRing from './EscapeRing';
import launchCoordinates from '../../assets/launch-coordinates.json';
import SoundEffect from '../SoundEffect';
import { FuelGauge } from '../FuelGauge';

export default class Satellite extends Orbital {
  /**
   * @abstract
   * @type {number}
   */
  speed = 0.01;

  /**
   * @abstract
   * @type {number}
   */
  fuel = 0;

  /**
   * @abstract
   * @type {constructor<Debris>[]}
   */
  static debris = [];

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

    this.constructor.debris.sort((a, b) => b.price - a.price);

    // for sat 1
    this.sprite.anchor.set(0.6, 0.6);

    SoundEffect.deploy().play();

    entityStore.add(new FuelGauge(this));

    this.registerInteractivity();
  }

  tick (delta) {
    this.trail.tick(delta);
    super.tick(delta);

    if (this.selected) {
      this._handleInput(delta);
    }
  }

  update (delta) {
    super.update(delta);

    this.sprite.alpha = this.fuel < 0 ? 0.8 : 1;
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
    if (this.constructor.debris.length === 0) {
      return;
    }

    while (this.points > 0) {
      const last = this.points;

      for (const _Debris of this.constructor.debris) {
        // replace with while for bias
        if (this.points >= _Debris.price) {
          this.points -= _Debris.price;

          let { x, y, vx, vy } = this.sprite;

          vx += randInt(vx * -0.5, vx * 0.5);
          vy += randInt(vy * -0.5, vy * 0.5);

          setTimeout(() => entityStore.add(new _Debris(x, y, vx, vy)), randInt(0, 300));
        }
      }

      if (last === this.points) {
        return;
      }
    }
  }

  updateCollision () {
    super.updateCollision();

    if (!this.dead) {
      const ring = first(entityStore.getEntitiesForType(EscapeRing));

      const escaped = circleIntersect({
        x: this.sprite.x, y: this.sprite.y, r: this.collisionRadius,
      }, {
        x: ring.sprite.x, y: ring.sprite.y, r: ring.radius,
      });

      if (escaped) {
        this.explode();
      }
    }
  }

  updateCollisionLookahead () {
    super.updateCollisionLookahead();

    const ring = first(entityStore.getEntitiesForType(EscapeRing));

    for (let i = this.lookaheadIndex; i < this.lookahead.length; i++) {
      const escaped = circleIntersect({
        x: this.lookahead[i].x, y: this.lookahead[i].y, r: this.collisionRadius,
      }, {
        x: ring.sprite.x, y: ring.sprite.y, r: ring.radius,
      });

      const ttl = i - this.lookaheadIndex;

      if (escaped) {
        this.nearestCollision = Math.min(ttl, this.nearestCollision);

        entityStore.add(new CollisionWarning(
          [this, ring],
          this.lookahead[i].x,
          this.lookahead[i].y,
          ttl,
        ));

        break;
      }
    }
  }

  moveToSafeCoordinates (safeDistance = 180, maxTries = launchCoordinates.length) {
    const oldRad = this.collisionRadius;
    const possible = Array.from(launchCoordinates);
    const attempts = [];

    this.nearestCollision = 0;

    for (let tries = maxTries; possible.length && tries >= 0 && this.nearestCollision < safeDistance; tries--) {
      const pick = randomPick(possible);
      const [x, y, vx, vy] = pick;

      possible.splice(possible.indexOf(pick), 1);

      this.sprite.x = x;
      this.sprite.y = y;
      this.sprite.vx = vx;
      this.sprite.vy = vy;

      this.collisionRadius = oldRad + (tries / maxTries) * 20;

      this.updateLookaheadSegments();
      this.updateCollisionLookahead();
      attempts.push([this.nearestCollision, pick]);
    }

    this.collisionRadius = oldRad;

    console.log('tries', attempts.length);

    if (this.collisionRadius < safeDistance) {
      const [expected, [x, y, vx, vy]] = attempts.sort((a, b) => b[0] - a[0])[0];

      this.sprite.x = x;
      this.sprite.y = y;
      this.sprite.vx = vx;
      this.sprite.vy = vy;

      console.log('attempts', attempts);

      console.log('nearestCollision[old]', this.nearestCollision, 'expecting', expected);

      this.updateLookaheadSegments();
      this.updateCollisionLookahead();
    }

    console.log('nearestCollision', this.nearestCollision);
    console.log('collisionRadius', oldRad, '=>', this.collisionRadius);

    this.trail.reset();
  }
}
