<template>
  <div class="fancyborder fixed">
    <!--    <CloseButton @click="$emit('dismiss')"/>-->
    <h1>PAUSED</h1>
    <h2 class="fancyborder" @click="$emit('dismiss')">Continue</h2>
    <h2 class="fancyborder" @click="$emit('restart')">Restart</h2>
    <h2 class="fancyborder" @click="$emit('controls')">Controls</h2>
    <h2 class="fancyborder" @click="$emit('high-score')">High Score</h2>
    <h2 class="fancyborder" @click="$emit('toggle-music')">Music Toggle</h2>
  </div>
</template>

<script>
import game from '../game';

export default {
  name: "pause-c-m",
  components: {
    // CloseButton,
  },
  mounted () {
    game.paused = true;
  },
  beforeDestroy () {
    game.paused = false;
  },
};
</script>

<style scoped>
.fixed {
  width: 400px;
  height: 80vh;
  overflow: hidden;
  position: absolute;
  display: block;

  margin-top: 10vh;
  left: calc(40vw - 60px);

  background: rgba(50, 50, 50, 0.95);
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
