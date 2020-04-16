import Vue from 'vue'
import App from './App.vue'
import flvjs from 'flv.js/dist/flv.js';
Vue.use(flvjs);
Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
