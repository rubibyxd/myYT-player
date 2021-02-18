import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './assets/reset.css';
import axios from 'axios'
import VueAxios from 'vue-axios'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faCaretLeft, faCaretRight, faCheckCircle, faDizzy, faPlayCircle, faSearch, faTrashAlt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import VuePlyr from 'vue-plyr'
import 'vue-plyr/dist/vue-plyr.css'
import moment from 'moment-timezone'
 
Vue.filter('dateFormat', function (daraStr, pattern = 'YYYY-MM-DD HH:mm:ss') {
  return moment(daraStr).format(pattern)
})

Vue.use(VuePlyr, {
  plyr: {}
})

library.add(faPlayCircle,faSearch,faCaretLeft,faCaretRight,faTrashAlt,faDizzy,faCheckCircle)

Vue.use(VueAxios, axios)

Vue.component('font-awesome-icon', FontAwesomeIcon)

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
