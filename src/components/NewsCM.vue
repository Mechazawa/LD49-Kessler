<template>
  <div class="snapLeft">
    <h1 class="fancyborder">Latest News</h1>
    <NewsArticle v-for="(article, index) of articles"
                 v-bind="article"
                 :key="index"
                 @dismiss="remove(article)"/>
  </div>
</template>

<script>
import NewsArticle from './NewsArticle';

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

    this.add({ title: 'Hello World!', value: 'Lorum ipsum and stuff ya know? badabing' });
    this.add({ title: 'Hello World!', value: 'Lorum ipsum and stuff ya know? badabing bada bingb ada bingba dabing bad ab ingb adabing', image: 'images/cat.png' });
    this.add({ title: 'Hello World!', value: 'Lorum ipsum and', image: 'images/cat.png' });
  },
  methods: {
    add (article) {
      this.articles.push(article);
    },
    remove (article) {
      const index = this.articles.indexOf(article);

      if (index >= 0) {
        this.articles.splice(index, 1);
      }
    },
  },
};
</script>

<style scoped>
.snapLeft {
  position: absolute;
}
</style>
