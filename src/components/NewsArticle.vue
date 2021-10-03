<template>
  <div :class="{ fancyborder: true, hasImage: !!image }">
    <CloseButton @click="$emit('dismiss')"/>
    <div v-if="image" class="fancyborder fixed">
      <img :src="image" width="80%"/>
    </div>
    <h1 v-if="title" v-text="title"/>
    <p v-if="value" v-text="value"/>
  </div>
</template>

<script>
import CloseButton from './CloseButton';

export default {
  name: 'news-article',
  components: { CloseButton },
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

div {
  background: rgba(50,50,50,0.95);
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


.hasImage {
  min-height: 106px;
  text-align: left;
}
</style>
