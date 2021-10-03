<template>
  <div :class="{ fancyborder: true, hasImage: !!image }">
    <span class="clickable fancyborder dismiss" @click="$emit('dismiss')">X</span>
    <div v-if="image" class="fancyborder fixed">
      <img :src="image" width="80%"/>
    </div>
    <h1 v-if="title" v-text="title"/>
    <p v-if="value" v-text="value"/>
  </div>
</template>

<script>
export default {
  name: 'news-article',
  props: {
    image: {
      default: '',
      type: String,
    },
    title: {
      default: '',
      type: String,
    },
    value: {
      default: '',
      type: String,
    },
  },
};
</script>

<style scoped>
img {
  padding: 5px;
}

.fixed {
  position: relative;
  display: block;
  width: 80px;
  height: 80px;
  margin-right: 5px;
  float: left;
  text-align: center;
}

.clickable:hover {
  cursor: pointer;
}

div {
  background: #333;
  width: 300px;
}

h1, p {
  margin-top: 0.2em;
  margin-bottom: 0.1em;
  font-family: Helvetica, sans-serif;
}

p {
  text-align: justify;
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
  z-index: 2;

  text-align: center;
}

.dismiss:before {
  border-radius: 20px;
}

.hasImage {
  min-height: 106px;
  text-align: left;
}
</style>
