import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '@/views/Home.vue'
import VideoPlayer from '@/views/VideoPlayer.vue'
import Collection from '@/views/Collection.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/videoPlayer',
    name: 'VideoPlayer',
    component: VideoPlayer
  },
  {
    path: '/collection',
    name: 'Collection',
    component: Collection
  }
]

const router = new VueRouter({
  mode: 'history',
  routes
})

export default router
