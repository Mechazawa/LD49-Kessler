import AbstractEntity from './AbstractEntity';
import game from '../index';
import textures from 'svg-to-png-loader?width=20&height=40&name=images/[name]-[width]x[height].png!@/assets/warning.svg';
import { degToRad, first } from '../../utils';
import entityStore from '../EntityStore';

export default class CollisionWarning extends AbstractEntity {
  static texture = first(textures);

  ttl;
  satellites = [];

  constructor (satellites, x, y, ttl) {
    super();

    this.sprite.anchor.set(0.75, 0.9);
    this.sprite.position.set(x, y);

    this.ttl = ttl;
    this.satellites = satellites;

    game.stage.addChild(this.sprite);
  }

  destroy () {
    super.destroy();
    this.ttl = 0;
  }

  tick (delta) {
    this.sprite.vx = 0;
    this.sprite.vy = 0;

    this.ttl--;
    this.dead = this.ttl <= 0 || this.satellites.some(x => x.dead);
  }

  update (delta) {
    super.update(delta);

    this.sprite.rotation = degToRad(15 * Math.sin(this.ttl / 7));
    this.sprite.x = this.satellites[0].sprite.x;
    this.sprite.y = this.satellites[0].sprite.y;
  }

  static findForCollision (collision, satellites = []) {
    return Array.from(entityStore.getEntitiesForType(CollisionWarning)).find(warning => {
      if (warning.ttl !== collision.ttl && warning.ttl - 1 !== collision.ttl && warning.ttl + 1 !== collision.ttl) {
        return false;
      }

      // todo might be insufficient
      return satellites.some(sat => warning.satellites.includes(sat));
    });
  }

  static findForOrbital (satellite) {
    return Array.from(entityStore.getEntitiesForType(CollisionWarning)).filter(warning => warning.satellites.includes(satellite));
  }
}
