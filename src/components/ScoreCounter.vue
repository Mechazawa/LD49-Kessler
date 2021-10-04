<template>
  <div class="fancyborder fixed">
    <h1>{{ output }}</h1>
  </div>
</template>

<script>

import { Tween } from '@tweenjs/tween.js';

export default {
  name: 'score-counter',
  props: {
    value: {
      type: Number,
      required: true,
    },
    speed: {
      type: Number,
      default: 800,
    },
  },
  data () {
    return {
      output: 0,
      timer: 0,
      tween: new Tween({ value: 0 })
        .onUpdate(({ value }) => {
          this.output = Math.round(value ?? this.output);
        }).start(),
    };
  },
  watch: {
    value (v) {
      this.tween.to({ value: v }, this.speed).start();
    },
  },
};
</script>

<style scoped>
.fixed {
  position: absolute;
  display: block;
  min-width: 180px;
  background: rgba(50, 50, 50, 0.8);

  top: 8px;
  right: 4px;
}

h1 {
  margin: 0;
  padding: 0;
}
</style>
