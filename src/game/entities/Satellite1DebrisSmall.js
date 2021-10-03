import Debris from './Debris';
import { first } from '../../utils';

export default class Satellite1DebrisSmall extends Debris {
  static price = 3;
  static texture = [
    first(require('svg-to-png-loader?width=20&height=10&name=images/[name]-[width]x[height].png!@/assets/satellite-1-debris-small-1.svg')),
    first(require('svg-to-png-loader?width=20&height=10&name=images/[name]-[width]x[height].png!@/assets/satellite-1-debris-small-2.svg')),
    first(require('svg-to-png-loader?width=20&height=10&name=images/[name]-[width]x[height].png!@/assets/satellite-1-debris-small-3.svg')),
    first(require('svg-to-png-loader?width=20&height=10&name=images/[name]-[width]x[height].png!@/assets/satellite-1-debris-small-4.svg')),
    first(require('svg-to-png-loader?width=20&height=10&name=images/[name]-[width]x[height].png!@/assets/satellite-1-debris-small-5.svg')),
  ]

  collisionRadius = 7;
}
