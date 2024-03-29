import Orbital from './Orbital';
import Trail from '../Trail';
import game from '../index';

export default class Debris extends Orbital {
  static price = 1;

  /**
   * @type {Trail}
   */
  trail;

  invincible = true;

  constructor (x, y, vx, vy) {
    super(x, y, vx, vy);

    const trailTexture = game.loader.resources['images/trail.png'].texture;

    this.trail = new Trail(this, trailTexture, 17, 70);

    setTimeout(() => {
      this.invincible = false;
    }, 1500);
  }

  tick (delta) {
    this.trail.tick();
    super.tick(delta);
  }

  destroy () {
    super.destroy();

    this.trail.destroy();
  }

  testCollisionLookahead (target) {
    // todo maybe cheat a bit and move to orbital
    //  code to make it work for prediction when
    //  selected.
    if (target instanceof Debris) {
      return null;
    }

    return super.testCollisionLookahead(target);
  }

  explode () {
    if (this.invincible && !this.isCrashedIntoPlanet()) {
      return;
    }

    super.explode();
  }
}
