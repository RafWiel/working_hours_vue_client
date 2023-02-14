import Vue from 'vue';
import { sync } from 'vuex-router-sync';
import App from './App.vue';
import router from './router';
import store from './plugins/store';
import vuetify from './plugins/vuetify';
import i18n from './plugins/i18n';
import './assets/main.scss';
import './misc/directives';

Vue.config.productionTip = false;
document.title = 'Settlement';

sync(store, router);

new Vue({
  router,
  store,
  vuetify,
  i18n,
  render: (h) => h(App),
}).$mount('#app');
