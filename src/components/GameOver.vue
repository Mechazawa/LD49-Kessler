<template>
  <div class="fancyborder fixed">
    <h1>Game Over</h1>
    <div class="fancyborder" id="score">
      Time: {{ Math.floor(time / 60) }}:{{ `0${Math.floor(time % 60)}`.substr(-2) }}<br>
      Score: {{ score }}
    </div>
    <input class="fancyborder" v-model="name" type="text" placeholder="Name..."/>
    <h2 class="fancyborder" @click="$emit('submit', name)">Submit Local High Score</h2>
    <h2 class="fancyborder" @click="$emit('restart')">Restart</h2>
  </div>
</template>

<script>
import game from '../game';
import texts from '../assets/text.json';
import { randomPick } from '../utils';

export default {
  name: 'game-over',
  props: {
    score: {
      required: true,
      type: Number,
    },
    time: {
      required: true,
      type: Number,
    },
  },
  data () {
    return {
      name: randomPick(texts.alien),
    };
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
  height: 350px;
  overflow: hidden;
  position: absolute;
  display: block;

  left: calc(50vw - 200px);
  top: calc(50vh - 250px);

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

#score {
  width: 50%;
  margin: auto;
}

input {
  z-index: 100;
}

input:focus {
outline: solid 3px #00e5d2;
}

input {
  background: transparent;
  color: white;
  padding: 3px 10px;
  font-family: Helvetica, Arial, sans-serif;
  width: 230px;
  font-size: 20px;
}
</style>
