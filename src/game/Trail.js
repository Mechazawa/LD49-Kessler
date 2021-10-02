import { Point, SimpleRope } from 'pixi.js';
import { arrGen, cubicInterpolation } from '../utils';
import game from './index';

export default class Trail {
  points = [];
  history = {
    x: [],
    y: [],
  };

  maxPoints;
  maxHistory;

  constructor (parent, texture, length, historyLength) {
    this.maxPoints = length;
    this.maxHistory = historyLength;
    this.parent = parent;

    this.points = arrGen(() => new Point(parent.x ?? 0, parent.y ?? 0), length);
    this.history.x = arrGen(() => parent.x ?? 0, length);
    this.history.y = arrGen(() => parent.y ?? 0, length);

    this.rope = new SimpleRope(texture, this.points);

    game.stage.addChild(this.rope);
  }

  destroy () {
    game.stage.removeChild(this.rope);
  }

  tick () {
    if (this.history.x.length >= this.maxHistory) {
      this.history.x.pop();
      this.history.y.pop();
    }

    this.history.x.unshift(this.parent.sprite.x);
    this.history.y.unshift(this.parent.sprite.y);

    for (let i = 0; i < this.maxPoints; i++) {
      this.points[i] = new Point(
        this.history.x[Math.round(i / this.maxPoints * this.history.x.length)],
        this.history.y[Math.round(i / this.maxPoints * this.history.y.length)],
      );
    }
  }
}
