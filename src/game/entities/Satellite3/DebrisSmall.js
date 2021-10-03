import Debris from '../Debris';
import { first } from '../../../utils';

export default class DebrisSmall extends Debris {
  static price = 3;
  static texture = [
    first(require('svg-to-png-loader?width=20&height=10&name=images/[name]-[width]x[height].png!@/assets/satellite-debris-small-1.svg')),
    first(require('svg-to-png-loader?width=20&height=10&name=images/[name]-[width]x[height].png!@/assets/satellite-debris-small-2.svg')),
    first(require('svg-to-png-loader?width=20&height=10&name=images/[name]-[width]x[height].png!@/assets/satellite-debris-small-3.svg')),
    first(require('svg-to-png-loader?width=20&height=10&name=images/[name]-[width]x[height].png!@/assets/satellite-debris-small-4.svg')),
    first(require('svg-to-png-loader?width=20&height=10&name=images/[name]-[width]x[height].png!@/assets/satellite-debris-small-5.svg')),
    first(require('svg-to-png-loader?width=20&height=10&name=images/[name]-[width]x[height].png!@/assets/satellite-3-debris-small-1.svg')),
    first(require('svg-to-png-loader?width=20&height=10&name=images/[name]-[width]x[height].png!@/assets/satellite-3-debris-small-1.svg')),
  ]

  collisionRadius = 7;
}
