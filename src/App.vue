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
import CollisionWarning from './game/entities/CollisionWarning';
import Stats from 'stats.js';
import Highlight from './game/entities/Highlight';
import TrailPrediction from './game/TrailPrediction';
import Prediction from './game/entities/Prediction';
import Explosion from './game/entities/Explosion';
import SoundEffect from './game/SoundEffect';
import { sounds } from './game/sound';
import Satelite1 from './game/entities/Satellite1';
import Sputnik from './game/entities/Sputnik';
import Satelite3 from './game/entities/Satellite3';
import Satelite2 from './game/entities/Satellite2';


export default {
  name: 'app',
  mounted () {
    this.$refs.game.appendChild(game.view);

    game.renderer.backgroundColor = 0x061639;

    window.entityStore = entityStore;
    window.game = game;
    // window.sound = sound;

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

    this.loadSounds()
      .then(() => this.loadGame())
      .then(() => this.startGame())
      .catch(e => console.error(e));
  },
  methods: {
    loadSounds () {
      return new Promise(resolve => {
        const fn = sounds.whenLoaded;

        sounds.whenLoaded = () => {
          fn?.();
          resolve();
        };

        sounds.load(Object.keys(SoundEffect).map(x => SoundEffect[x].path ?? `sounds/${x}.wav`));
      });
    },
    loadGame () {
      return new Promise(resolve => {
        game.loader
          .add(unique([
            Planet.texture,
            Cat.texture,
            Satelite1.texture,
            Satelite1.debris.map(d => d.texture).flat(),
            Satelite2.texture,
            Satelite2.debris.map(d => d.texture).flat(),
            Satelite3.texture,
            Satelite3.debris.map(d => d.texture).flat(),
            Sputnik.texture,
            Sputnik.debris.map(d => d.texture).flat(),
            'images/trail.png',
            CollisionWarning.texture,
            Highlight.texture,
            TrailPrediction.texture,
            Prediction.texture,
            Explosion.texture,
          ].flat()))
          .load(() => {
            const stats = new Stats();

            this.$refs.game.appendChild(stats.dom);

            game.ticker.add(delta => {
              stats.begin();

              if (!game.paused) {
                entityStore.tick(delta);
                entityStore.update(delta);
              }

              stats.end();
            });

            resolve();
          });
      });
    },
    startGame () {
      // entityStore.add(new Cat());
      entityStore.add(new Planet(game.screen.width / 2, game.screen.height / 2));
      entityStore.add(new Satelite1(200, 400, -1, -0.6));
      entityStore.add(new Satelite3(400, 600, 1.2, 0));
      entityStore.add(new Sputnik(300, 400, 0, 1.3));

      SoundEffect.ambient().play();
    },
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
  margin: auto;
}

body {
  padding: 0;
  margin: 0;
}

#game canvas {
  background-image: url("assets/background.svg");
  background-size: cover;
  background-position-x: 50%;

  /*cursor: url("assets/cursor-pointer.svg") pointer;*/
  /*cursor: url("assets/cursor-click.svg") click;*/
  /*cursor: url("assets/cursor-default.svg") default;*/
  /*cursor: url("assets/cursor-wait.svg") wait;*/
}
</style>
