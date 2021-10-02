import EventEmitter from 'events';

class EntityStore extends EventEmitter {
  store = new Map();

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
      this.store.get(constructor).remove(entity);
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
    this.forEach(entity => entity.tick(delta));
  }

  update (delta) {
    this.forEach(entity => entity.update(delta));
  }

  getEntitiesForType (type) {
    return new Set(this.store.get(type));
  }
}

export default new EntityStore();
