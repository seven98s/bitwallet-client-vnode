import Vue from 'vue';
import App from './App.vue';
import './uni.promisify.adaptor';
import {http} from '@/utils/http'

declare module 'vue/types/vue' {
  interface Vue {
    $http: typeof http;
  }
}

import PasswordPopup from '@/components/password/index';

import store from '@/store';
import walletTabbar from "@/components/walletTabbar.vue";
import navigationBar from "@/components/navigationBar.vue";
import titleBar from "@/components/titleBar.vue";
Vue.component('walletTabbar', walletTabbar);
Vue.component('navigationBar', navigationBar);
Vue.component('titleBar', titleBar);
Vue.prototype.$store = store;

Vue.config.productionTip = false;
Vue.prototype.$PasswordPopup = PasswordPopup;
Vue.prototype.$http = http;
const app = new (typeof App === 'function' ? App : Vue.extend(Object.assign({ mpType: 'app', store }, App)));
app.$mount();
