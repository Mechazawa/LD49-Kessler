import Debris from '../Debris';
import { first, randInt } from '../../../utils';
import entityStore from '../../EntityStore';
import DebrisTiny from '../Satellite1/DebrisTiny';

export default class DebrisBig extends Debris {
  static price = 5;
  static texture = [
    first(require('svg-to-png-loader?width=20&height=20&name=images/[name]-[width]x[height].png!@/assets/satellite-1-debris-big-1.svg')),
    first(require('svg-to-png-loader?width=20&height=20&name=images/[name]-[width]x[height].png!@/assets/satellite-1-debris-big-2.svg')),
    first(require('svg-to-png-loader?width=20&height=20&name=images/[name]-[width]x[height].png!@/assets/satellite-debris-big-1.svg')),
  ]

  collisionRadius = 10;

  explode () {
    for (let i = Math.floor(randInt(1, 4)); !this.dead && !this.invincible && i > 0; i--) {
      let { x, y, vx, vy } = this.sprite;

      vx += randInt(vx * -0.5, vx * 0.5);
      vy += randInt(vy * -0.5, vy * 0.5);

      setTimeout(() => entityStore.add(new DebrisTiny(x, y, vx, vy)), randInt(0, 300));
    }

    super.explode();
  }
}
