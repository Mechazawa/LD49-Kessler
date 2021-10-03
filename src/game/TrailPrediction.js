import game from './index';
import { SimpleRope } from 'pixi.js';
import textures
  from 'svg-to-png-loader?width=15&height=15&name=images/[name]-[width]x[height].png!@/assets/trail-arrow.svg';
import { first } from '../utils';
import Prediction from './entities/Prediction';
import entityStore from './EntityStore';
import CollisionWarning from './entities/CollisionWarning';

export default class TrailPrediction {
  static texture = first(textures);

  rope;

  predictions = [];

  updateDebounceTime = 10;
  updateDebounce = 0;

  constructor (parent, slave = false) {
    this.parent = parent;
    this.slave = slave;

    const texture = game.loader.resources[this.constructor.texture].texture;

    this.rope = new SimpleRope(texture, this.parent.lookahead, 1);
    // this.rope.blendMode = PIXI.BLEND_MODES.ADD;

    game.stage.addChildAt(this.rope, 0);
  }

  destroy () {
    game.stage.removeChild(this.rope);

    this.clearPredictions();

    this.rope?.destroy();
    this.rope = null;
  }

  tick (delta) {
    this.setPredictions(CollisionWarning.findForOrbital(this.parent).map(o => ({
      ttl: o.ttl,
      point: { x: o.x, y: o.y },
    })));
  }

  clearPredictions () {
    this.predictions.forEach(x => x.destroy());
    this.predictions = [];
  }

  addPrediction (point, ttl) {
    const p = new Prediction(this.parent, point.x, point.y, ttl);

    this.predictions.push(p);
    entityStore.add(p);
  }

  setPredictions (predictions) {
    this.predictions = this.predictions.filter(x => !x.dead);

    this.predictions.sort(x => x.sprite.position.x ** 2 + x.sprite.position.y ** 2);
    predictions.sort(x => x.point.x ** 2 + x.point.y ** 2);

    while (this.predictions.length > predictions.length) {
      this.predictions.shift().destroy();
    }

    for (let i = 0; predictions.length && i < this.predictions.length; i++) {
      const { point, ttl } = predictions.shift();

      this.predictions[i].sprite.position.set(point.x, point.y);
      this.predictions[i].ttl = ttl;
    }

    while (predictions.length) {
      const { point, ttl } = predictions.shift();

      this.addPrediction(point, ttl);
    }
  }
}
