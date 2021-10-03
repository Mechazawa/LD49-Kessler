<template>
  <div id="app">
    <NewsCM/>
    <PauseCM v-if="paused" @toggle-music="toggleMusic"/>
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
import NewsCM from './components/NewsCM';
import EscapeRing from './game/entities/EscapeRing';
import Orbital from './game/entities/Orbital';
import PauseCM from './components/PauseCM';


export default {
  name: 'app',
  components: {
    NewsCM, PauseCM,
  },
  data () {
    return {
      paused: false,
      music: false,
    };
  },
  mounted () {
    window.addEventListener('keydown', ({ key }) => {
      if (key === 'Escape') {
        this.paused = !this.paused;
      }
    }, false);

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
            EscapeRing.texture,
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
      entityStore.add(new EscapeRing());
      entityStore.add(new Planet(game.screen.width / 2, game.screen.height / 2));
      // entityStore.add(new Satelite1(200, 400, -1, -0.6));
      // entityStore.add(new Satelite3(400, 600, 1.2, 0));
      // entityStore.add(new Sputnik(300, 400, 0, 1.3));

      window.spawn = (x, y, vx, vy) => entityStore.add(new Satelite1(x, y, vx, vy));
      window.reset = () => Array.from(entityStore.getEntitiesForType(Orbital)).forEach(e => e.destroy());

      if (!this.music) {
        SoundEffect.ambient().play();
        this.music = true;
      }
    },
    toggleMusic () {
      if (this.music) {
        SoundEffect.ambient().pause();
      } else {
        SoundEffect.ambient().play();
      }

      this.music = !this.music;
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
  color: #fff;
  margin: auto;
}

body {
  padding: 0;
  margin: 0;
  background: #36333f;
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

.fancyborder {
  border-radius: 6px;
  border: 8px solid #550593;

  position: relative;
}

.fancyborder:before {
  content: "";
  display: block;
  position: absolute;
  z-index: 1;
  top: -5px;
  left: -5px;
  right: -5px;
  bottom: -5px;

  box-sizing: border-box;
  -moz-box-sizing: border-box;
  -webkit-box-sizing: border-box;

  border-radius: 6px;
  border: 2px solid #8100cc;
}
</style>
