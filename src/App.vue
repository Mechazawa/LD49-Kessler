<template>
  <div id="app">
    <div id="game" ref="game"/>
  </div>
</template>

<script>
import game from './game';
import Cat from './game/entities/Cat';
import Planet from './game/entities/Planet';
import entityStore from './game/EntityStore';
import { unique } from './utils';
import Satellite from './game/entities/Satellite';
import CollisionWarning from './game/entities/CollisionWarning';
import Stats from 'stats.js';
import Satellite1DebrisBig from './game/entities/Satellite1DebrisBig';
import Satellite1DebrisSmall from './game/entities/Satellite1DebrisSmall';
import Satellite1DebrisTiny from './game/entities/Satellite1DebrisTiny';
import Highlight from './game/entities/Highlight';

export default {
  name: 'app',
  mounted () {
    this.$refs.game.appendChild(game.view);

    game.renderer.backgroundColor = 0x061639;

    window.entityStore = entityStore;
    window.game = game;

    game.loader.onProgress.add((loader, resource) => {
      // Display the file `url` currently being loaded
      console.log(`loading: ${resource.url}`);

      // Display the percentage of files currently loaded
      console.log(`progress: ${loader.progress}%`);

      // If you gave your files names as the first argument
      // of the `add` method, you can access them like this
      // However, I recommend you don't use this feature!
      // That's because you'll have to remember all names
      // you gave each loaded files, as well as make sure
      // you don't accidentally use the same name more than
      // once. Using the file path name, is simpler and
      // less error prone.
      // console.log("loading: " + resource.name);
    });

    game.loader
      .add(unique([
        Planet.texture,
        Cat.texture,
        Satellite.texture,
        'images/trail.png',
        CollisionWarning.texture,
        Satellite1DebrisBig.texture,
        Satellite1DebrisSmall.texture,
        Satellite1DebrisTiny.texture,
        Highlight.texture,
      ].flat()))
      .load(() => {
        // entityStore.add(new Cat());
        entityStore.add(new Planet(400, 300));
        entityStore.add(new Satellite(250, 400, -1, -0.5));
        entityStore.add(new Satellite(400, 500, 1.2, 0));
        entityStore.add(new Satellite(500, 500, 1, 0));

        const stats = new Stats();

        this.$refs.game.appendChild(stats.dom);

        game.ticker.add(delta => {
          stats.begin();
          entityStore.tick(delta);
          entityStore.update(delta);
          stats.end();
        });
      });
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
