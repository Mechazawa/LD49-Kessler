<template>
  <span class="clickable fancyborder dismiss" @click="$emit('click')">X</span>
</template>

<script>
export default {
  name: "close-button",
};
</script>

<style scoped>

.clickable:hover {
  cursor: pointer;
}

.dismiss {
  border-radius: 20px;
  font-size: 13pt;
  font-weight: bold;
  position: absolute;

  width: 1.3em;
  height: 1.3em;

  top: -20px;
  right: -20px;
  background: inherit;
  z-index: 10;

  text-align: center;
}

.dismiss:before {
  border-radius: 20px;
  z-index: 11;
}
</style>
