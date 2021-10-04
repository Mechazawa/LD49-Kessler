import { first, randInt } from '../../utils';
import Comet from './Comet';
import entityStore from '../EntityStore';

export default class CometMoon extends Comet {
  static price = 5;

  static texture = [
    first(require('svg-to-png-loader?width=40&height=40&name=images/[name]-[width]x[height].png!@/assets/comet-moon-1.svg')),
    first(require('svg-to-png-loader?width=40&height=40&name=images/[name]-[width]x[height].png!@/assets/comet-moon-2.svg')),
    first(require('svg-to-png-loader?width=40&height=40&name=images/[name]-[width]x[height].png!@/assets/comet-moon-3.svg')),
  ]

  collisionRadius = 10;

  explode () {
    for (let i = Math.floor(randInt(3, 6)); !this.dead && !this.invincible && i > 0; i--) {
      let { x, y, vx, vy } = this.sprite;

      vx += randInt(vx * -0.5, vx * 0.5);
      vy += randInt(vy * -0.5, vy * 0.5);

      setTimeout(() => entityStore.add(new Comet(x, y, vx, vy)), randInt(0, 400));
    }

    super.explode();
  }
}
