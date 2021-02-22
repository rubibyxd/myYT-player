import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    seletedVideo:''
  },
  mutations: {
    selectVideo(state,video) {
      state.seletedVideo  = video
    }
  },
  actions: {
  },
  modules: {
  }
})
