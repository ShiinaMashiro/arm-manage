import Vue from "vue";
import App from "./App.vue";
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import {postData} from './api.js';
import {uri} from './uri.js';
import * as acName from './action-types';
import * as muName from './mutation-types';
import {myUtil} from './util';
import store from "./store";
import router from "./router";
import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
import axios from 'axios'
import VueDraggableResizable from 'vue-draggable-resizable'
import VueClipboard from 'vue-clipboard2'
import Echarts from 'echarts'

Vue.use(VueClipboard)
Vue.use(mavonEditor)
Vue.use(ElementUI)
Vue.config.productionTip = false
Vue.prototype.$echarts = Echarts
Vue.prototype.$post = postData
Vue.prototype.$uri = uri
Vue.prototype.$axios = axios
Vue.prototype.$filePost = () => {
  return axios.create({
    timeout: 1000,
    headers: {
      "Content-Type": "multipart/form-data",
      "Sec-Fetch-Site": "same-origin",
      ...store.state.userInfo,
      userId: store.state.userInfo.id
    }
  })
}
Vue.prototype.$mutation = muName
Vue.prototype.$action = acName
Vue.prototype.$util = myUtil

Vue.filter("formatDateTime", function(time) {
  if (!time) {
    return ""
  }
  return myUtil.formatDate(new Date(time))
})

Vue.prototype.$formatDate = myUtil.formatDate

Vue.prototype.$enableKey = {
  ipProxy: 'i',
  devMaster: 'd',
  adb: 'a',
  cmdForward: 'c',
  sync: 's',
  live: 'l',
  flowSync: 'f',
  webSsh: 'w',
  remoteCamera: 'r'
}
Vue.prototype.$isEnable = (key) => {
  if (key && process.env.VUE_APP_OREKI) {
    let oreki = process.env.VUE_APP_OREKI.toLowerCase()
    return oreki.indexOf(key) >= 0
  }
  return false
}

Vue.component('vue-draggable-resizable', VueDraggableResizable)


new Vue({
  router,
  store,
  render: h => h(App),
  beforeCreate() {
    if(this.$isEnable(this.$enableKey.ipProxy)) {
      this.$store.commit(this.$mutation.ENABLE_IP_PROXY)
    }

    if(this.$isEnable(this.$enableKey.cmdForward)) {
      this.$store.commit(this.$mutation.ENABLE_CMD_FORWARD)
    }

    if(this.$isEnable(this.$enableKey.devMaster)) {
      this.$store.commit(this.$mutation.ENABLE_DEV_MASTER)
    }
  }
}).$mount("#app");
