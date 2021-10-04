import { first } from '../../utils';
import Debris from './Debris';

export default class Comet extends Debris {
  static price = 1;

  static texture = [
    first(require('svg-to-png-loader?width=10&height=10&name=images/[name]-[width]x[height].png!@/assets/comet-1.svg')),
    first(require('svg-to-png-loader?width=10&height=10&name=images/[name]-[width]x[height].png!@/assets/comet-2.svg')),
    first(require('svg-to-png-loader?width=10&height=10&name=images/[name]-[width]x[height].png!@/assets/comet-3.svg')),
    first(require('svg-to-png-loader?width=10&height=10&name=images/[name]-[width]x[height].png!@/assets/comet-4.svg')),
    first(require('svg-to-png-loader?width=10&height=10&name=images/[name]-[width]x[height].png!@/assets/comet-5.svg')),
    first(require('svg-to-png-loader?width=10&height=10&name=images/[name]-[width]x[height].png!@/assets/comet-6.svg')),
    first(require('svg-to-png-loader?width=10&height=10&name=images/[name]-[width]x[height].png!@/assets/comet-7.svg')),
    first(require('svg-to-png-loader?width=10&height=10&name=images/[name]-[width]x[height].png!@/assets/comet-8.svg')),
    first(require('svg-to-png-loader?width=10&height=10&name=images/[name]-[width]x[height].png!@/assets/comet-9.svg')),
    first(require('svg-to-png-loader?width=10&height=10&name=images/[name]-[width]x[height].png!@/assets/comet-10.svg')),
  ]

  collisionRadius = 5;
}
