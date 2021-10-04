<template>
  <div class="fancyborder fixed">
    <!--    <CloseButton @click="$emit('dismiss')"/>-->
    <div style="width: 60%">
      <img src="images/logo-big.svg" width="80%" style="float:left;padding-right:100%;"/>
      <p>
        The Margobians of Starburst IX need you! All
        the planet's states are racing to get satellites
        in orbit. But with so much traffic in space any
        collision can tip the balance and cause a cascade
        of destruction. You have been assigned as the
        sole protector of these satellites. Can you
        prevent chaos and make the Margobians prosper?
        Use the controls at your disposal to guide the
        satellites out of harms way. Get points for
        protecting satellites as long as possible.
      </p>
      <h2 class="fancyborder" @click="$emit('dismiss')">Ok</h2>
    </div>
    <div style="width: 40%">
      <div style="width: 100%; height:45%;padding-top:20px;padding-bottom:10px">
        <img src="images/controls-mouse.svg" width="80">
      </div>
      Selects satellites to control them. This will also
      show their heading and collision points.
      <div style="width: 100%; height:45%;padding-top:20px;">
        <img src="images/controls-keyboard.svg" width="130">
      </div>
      <p>
        Move satellites in specified direction. Some
        satellites have more fuel or are faster then
        others. Fuel supply is indicated by the blue
        bar.
      </p>
    </div>
  </div>
</template>

<script>
import game from '../game';
import SoundEffect from '../game/SoundEffect';

export default {
  name: 'controls',
  mounted () {
    game.paused = true;

    SoundEffect.pause()?.play();
  },
  beforeDestroy () {
    game.paused = false;

    SoundEffect.pause().play();
  },
};
</script>

<style scoped>
div {
  display: inline-block;
}

.fixed {
  width: 800px;

  overflow: hidden;
  position: absolute;
  display: block;

  max-height: 80vh;
  margin-top: 10vh;
  left: calc(50vw - 400px);

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

p {
  text-align: justify;
  padding: 0 2em;
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
