import Vue from 'vue';
import App from './App.vue';
import * as TWEEN from '@tweenjs/tween.js';
import { debug, env } from './utils';

Vue.config.productionTip = false;

function animate (time) {
  requestAnimationFrame(animate);
  TWEEN.update(time);
}

animate();

debug('env', env);

new Vue({
  render: h => h(App),
}).$mount('#app');
