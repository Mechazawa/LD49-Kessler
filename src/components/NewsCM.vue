<template>
  <div class="snapLeft">
    <h1 class="fancyborder">Margoba News</h1>
    <NewsArticle v-for="(article, index) of articles"
                 v-bind="article"
                 :key="index"
                 @dismiss="remove(article)"/>
  </div>
</template>

<script>
import NewsArticle from './NewsArticle';
import texts from '../assets/text.json';
import { randomPick } from '../utils';
import SoundEffect from '../game/SoundEffect';

export default {
  name: 'news-c-m',
  components: {
    NewsArticle,
  },
  data () {
    return {
      articles: [],
    };
  },
  mounted () {
    window.news = this;
  },
  methods: {
    add (article) {
      this.articles.unshift({
        value: this.fillTemplate(article.value || ''),
        title: this.fillTemplate(article.title || ''),
        image: this.fillTemplate(article.image || ''),
      });

      if (this.articles.length > 6) this.articles.shift();
    },
    remove (article) {
      const index = this.articles.indexOf(article);

      if (index >= 0) {
        this.articles.splice(index, 1);

        SoundEffect.newsDismiss().play();
      }
    },
    fillTemplate (text) {
      return text.replace(/\[(\w+)]/g, (_, key) => randomPick(texts[key]));
    },
    clear () {
      this.articles = [];
    },
  },
};
</script>

<style scoped>
.snapLeft {
  position: absolute;
  width: 300px;
}
</style>
