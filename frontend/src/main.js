import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './assets/global.css'
import App from './App.vue'
import router from './router'
import { useUserStore } from '@/stores/userStore'

const app = createApp(App)

app.use(createPinia())
app.use(router)

const userStore = useUserStore()
userStore.loadLocalStorage()

router.beforeEach((to, from, next) => {
    const userStore = useUserStore()
    const loggedIn = !!userStore.userInfo?.token

    if ((to.path === '/login' || to.path === '/register') && loggedIn) {
        return next('/profile') // 已登录用户访问登录或注册，跳到 profile
    }

    if (to.meta.requiresAuth && !loggedIn) {
        return next('/login') // 需要登录但未登录，跳到 login
    }

    next()
})

app.mount('#app')
