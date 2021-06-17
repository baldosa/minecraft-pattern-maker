import Vue from 'vue'
import App from './App.vue'
import VueKonva from 'vue-konva'
import VueHotkey from 'v-hotkey'
import mdiVue from 'mdi-vue/v2'
import * as mdijs from '@mdi/js'


Vue.config.productionTip = false
Vue.use(VueKonva);
Vue.use(VueHotkey);
Vue.use(mdiVue, {icons: mdijs}) 
new Vue({
  render: h => h(App),
}).$mount('#app')
