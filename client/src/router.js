import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

export default new VueRouter({
    routes: [
        {
            path: '/',
            name: 'main',
            component: () => import(/* webpackChunkName: "about" */ './views/Filebrowser.vue'),
        },
        {
            path: '/:hash',
            name: 'main',
            component: () => import(/* webpackChunkName: "about" */ './views/Filebrowser.vue'),
            props: route => ({rootHash: route.params.hash}),
        },
    ],
});
