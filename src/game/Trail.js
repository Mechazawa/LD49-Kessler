import { Point, SimpleRope } from 'pixi.js';
import { arrGen } from '../utils';
import game from './index';
import * as PIXI from 'pixi.js';

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

    const { x = 0, y = 0 } = parent.sprite;

    this.points = arrGen(() => new Point(x, y), length);
    this.history.x = arrGen(x, length);
    this.history.y = arrGen(y, length);

    this.rope = new SimpleRope(texture, this.points);
    this.rope.blendMode = PIXI.BLEND_MODES.ADD;

    game.stage.addChildAt(this.rope, 0);
  }

  destroy () {
    game.stage.removeChild(this.rope);

    this.rope?.destroy();
    this.rope = null;
  }

  tick () {
    if (this.history.x.length >= this.maxHistory) {
      this.history.x.pop();
      this.history.y.pop();
    }

    this.history.x.unshift(this.parent.sprite.x);
    this.history.y.unshift(this.parent.sprite.y);

    for (let i = 0; i < this.maxPoints; i++) {
      this.points[i].set(
        this.history.x[Math.round(i / this.maxPoints * this.history.x.length)],
        this.history.y[Math.round(i / this.maxPoints * this.history.y.length)],
      );
    }
  }
}
