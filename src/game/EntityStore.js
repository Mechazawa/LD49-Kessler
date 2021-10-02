import EventEmitter from 'events';
import RBush from 'rbush';

class EntityStore extends EventEmitter {
  store = new Map();

  tree = new RBush(9);

  add (entity) {
    const constructor = entity.constructor;

    if (!this.store.has(constructor)) {
      this.store.set(entity.constructor, new Set());
    }

    this.store.get(constructor).add(entity);
  }

  remove (entity) {
    const constructor = entity.constructor;

    if (this.store.has(constructor)) {
      this.store.get(constructor).delete(entity);
    }
  }

  forEach (fn, type = null) {
    const types = type ? [type] : this.store.keys();

    for (const _type of types) {
      for (const entity of this.store.get(_type)) {
        fn(entity);
      }
    }
  }

  tick (delta) {
    this.forEach(entity =>{
      entity.tick(delta)

      if (entity.dead) {
        entity.destroy();
        this.remove(entity);
      }
    });
  }

  update (delta) {
    this.forEach(entity => entity.update(delta));
  }

  getEntitiesForType (type) {
    return new Set(this.store.get(type));
  }
}

export default new EntityStore();
