<template>
  <div class="fancyborder fixed">
    <!--    <CloseButton @click="$emit('dismiss')"/>-->
    <h1>High Scores</h1>
    <table>
      <tr>
        <th>name</th>
        <th>score</th>
        <th>time</th>
      </tr>
      <tr v-for="(score, index) of value" :key="index">
        <td v-text="score.name"/>
        <td v-text="score.score"/>
        <td>{{ Math.floor(score.time / 60) }}:{{ `0${Math.floor(score.time % 60)}`.substr(-2) }}</td>
      </tr>
    </table>
    <h2 class="fancyborder" @click="$emit('dismiss')">Close</h2>
  </div>
</template>

<script>
import game from '../game';
import SoundEffect from '../game/SoundEffect';

export default {
  name: 'high-score',
  props: {
    value: {
      required: true,
      validator: x => Array.isArray(x),
    },
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
  width: 300px;

  overflow: hidden;
  position: absolute;
  display: block;

  max-height: 80vh;
  margin-top: 10vh;
  margin-bottom: 10vh;
  left: calc(50vw - 150px);

  background: rgba(50, 50, 50, 0.95);
}

img {
  padding: 5px;
}

h2, input {
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

input {
  background: transparent;
  color: white;
  padding: 3px 10px;
  font-family: Helvetica, Arial, sans-serif;
  width: 230px;
  font-size: 20px;
}

table {
  width: 100%;
}
</style>
