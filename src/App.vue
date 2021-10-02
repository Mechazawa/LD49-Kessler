<template>
  <div id="app">
    <div id="game" ref="game"/>
  </div>
</template>

<script>
import game from './game';
import Cat from './game/entities/Cat';
import Planet from './game/entities/Planet';

export default {
  name: 'app',
  mounted () {
    this.$refs.game.appendChild(game.view);

    game.renderer.backgroundColor = 0x061639;

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
      .add([...new Set([
        Planet.texture,
        Cat.texture,
      ])])
      .load(() => {
        const cat = new Cat();
        const planet = new Planet();

        game.ticker.add(delta => {
          cat.tick(delta);
          planet.tick(delta);

          cat.update(delta);
          planet.update(delta);
        });

        window.entities = { cat, planet };
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
