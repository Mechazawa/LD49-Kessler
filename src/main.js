import Vue from 'vue';
import App from './App.vue';
import * as TWEEN from '@tweenjs/tween.js';
import { env } from './utils';

Vue.config.productionTip = false;

function animate (time) {
  requestAnimationFrame(animate);
  TWEEN.update(time);
}

animate();

console.log('env', env);

new Vue({
  render: h => h(App),
}).$mount('#app');
