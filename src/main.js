import Vue from 'vue'
import App from './App.vue'
import VueKonva from 'vue-konva'
import VueHotkey from 'v-hotkey'

Vue.config.productionTip = false
Vue.use(VueKonva);
Vue.use(VueHotkey);
new Vue({
  render: h => h(App),
}).$mount('#app')
