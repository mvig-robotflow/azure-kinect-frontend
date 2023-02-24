import Vue from "vue";
import VueRouter from "vue-router";
import Dashboard from "./components/Dashboard.vue"
import Home from "@/components/Home.vue";
import Sync from "@/components/Sync.vue";
import Control from "@/components/Control.vue";

Vue.use(VueRouter);

const original = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
    return original.call(this, location).catch(err => err)
}

const routes = [
    {
        path: "/",
        name: "home",
        component: Home,
        redirect: "/dashboard",
        children: [
            {
                path: "/dashboard",
                name: "dashboard",
                component: Dashboard,
            },
            {
                path: "/sync",
                name: "sync",
                component: Sync,
            },
            {
                path: "/control",
                name: "control",
                component: Control,
            }
        ]
    },
    // {
    //     path: "/dashboard",
    //     name: "dashboard",
    //     component: Dashboard,
    // },
    // {
    //     path: "/sync",
    //     name: "sync",
    //     component: Sync,
    // },
    // {
    //     path: "/control",
    //     name: "control",
    //     component: Control,
    // }

];

const router = new VueRouter({
    mode: "history",
    routes,
    base: '/'
});

//
// router.beforeEach((to, from, next) => {
//     let token = localStorage.getItem("token")
//     if (token == null || token === '') {
//         if (to.path === '/' || to.path === '/passwordreset') {
//             next();
//         } else {
//             next({name: 'login'});
//         }
//     } else {
//         if (to.path === '/') {
//             next({name: 'admin'});
//         } else {
//             next();
//         }
//     }
// })

export default router;
