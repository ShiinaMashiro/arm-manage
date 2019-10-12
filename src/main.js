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

Vue.use(ElementUI);
Vue.config.productionTip = false;
Vue.prototype.$post = postData
Vue.prototype.$uri = uri
Vue.prototype.$mutation = muName
Vue.prototype.$action = acName
Vue.prototype.$util = myUtil

Vue.filter("formatDateTime", function(time) {
  return myUtil.formatDate(new Date(time))
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
