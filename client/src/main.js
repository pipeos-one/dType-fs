import Vue from 'vue';
import './plugins/vuetify';
import App from './App.vue';

import router from './router';
import StoreFS from './StoreFS.js';

Vue.config.productionTip = false;

new Vue({
    router,
    store: StoreFS,
    render: h => h(App),
}).$mount('#app');
