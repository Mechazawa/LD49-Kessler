import Vue from 'vue';
import App from './App.vue';
import * as TWEEN from '@tweenjs/tween.js';

Vue.config.productionTip = false;

function animate (time) {
  requestAnimationFrame(animate);
  TWEEN.update(time);
}

animate();

new Vue({
  render: h => h(App),
}).$mount('#app');
