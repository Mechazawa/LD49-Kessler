<template>
  <div class="fancyborder fixed">
    <!--    <CloseButton @click="$emit('dismiss')"/>-->
    <img src="images/logo-big.svg"/>
    <h2 class="fancyborder" @click="$emit('dismiss')">Continue</h2>
    <h2 class="fancyborder" @click="$emit('restart')">Restart</h2>
    <h2 class="fancyborder" @click="$emit('controls')">Controls</h2>
    <h2 class="fancyborder" @click="$emit('high-score')">High Score</h2>
    <h2 class="fancyborder" @click="$emit('toggle-music')">Music Toggle</h2>
  </div>
</template>

<script>
import game from '../game';
import SoundEffect from '../game/SoundEffect';

export default {
  name: 'pause-menu',
  components: {
    // CloseButton,
  },
  mounted () {
    game.paused = true;

    SoundEffect.pause().play();
  },
  beforeDestroy () {
    game.paused = false;

    SoundEffect.pause().play();
  },
};
</script>

<style scoped>
.fixed {
  width: 400px;
  height: 550px;
  overflow: hidden;
  position: absolute;
  display: block;

  margin-top: 10vh;
  left: calc(50vw - 200px);

  background: rgba(50, 50, 50, 0.95);
}

img {
  padding: 5px;
}

h2 {
  margin: 10px;
  cursor: pointer;

  border-radius: 20px;
}

h2:hover {
  background: rgba(60, 60, 60, 0.98);
}

h2:before {
  border-radius: 20px;
}
</style>
