import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import axios from './http/index'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import VueVideoPlayer from 'vue-video-player'
import 'video.js/dist/video-js.css' 
import 'vue-video-player/src/custom-theme.css' 
import 'videojs-flash'


Vue.prototype.axios = axios;
Vue.use(VueVideoPlayer)
Vue.use(ElementUI)

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
