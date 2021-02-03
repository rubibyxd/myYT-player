import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './assets/reset.css';
import axios from 'axios'
import VueAxios from 'vue-axios'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faCaretLeft, faCaretRight, faPlayCircle, faSearch } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faPlayCircle,faSearch,faCaretLeft,faCaretRight)

Vue.use(VueAxios, axios)

Vue.component('font-awesome-icon', FontAwesomeIcon)

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
