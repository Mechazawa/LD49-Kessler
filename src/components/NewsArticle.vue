<template>
  <div class="fancyborder">
    <span class="clickable fancyborder dismiss" @click="$emit('dismiss')">X</span>
    <h1 v-if="title" v-text="title"/>
    <p v-if="value"  v-text="value"/>
  </div>
</template>

<script>
export default {
  name: 'news-article',
  props: {
    image: {
      optional: true,
      type: String
    },
    title: {
      optional: true,
      type: String
    },
    value: {
      optional: true,
      type: String
    }
  }
};
</script>

<style scoped>
 .clickable:hover {
   cursor: pointer;
 }

 div {
   background: #333;
 }

 .dismiss {
   border-radius: 20px;
   font-size: 10pt;
   font-weight: bold;
   position: absolute;

   width: 1.3em;
   height: 1.3em;

   top: -20px;
   right: -20px;
   background: inherit;
   z-index: 2;
 }

 .dismiss:before {
   border-radius: 20px;
 }
</style>
