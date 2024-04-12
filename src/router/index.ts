import { createRouter, createWebHistory } from "vue-router";

export default createRouter({

    history: createWebHistory(),

    routes: [
        {
            path: '/exploer',
            component: () => import('../components/stage/exploer/index.vue')
        },
        {
            path: '/playing',
            component: () => import('../components/stage/playing/index.vue')
        },
        {
            path:'/',
            redirect:'exploer'
        }
    ]
});