import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/auth';

// 这里不需要再定义 const Home = { template: ... } 这种代码了
// 我们直接在 routes 里引入 .vue 文件

const routes = [
    {
        path: '/',
        name: 'Home',
        // 使用懒加载引入我们在 views 文件夹下创建的 HomeView.vue
        component: () => import('../views/HomeView.vue')
    },
    {
        path: '/login',
        name: 'Login',
        component: () => import('../views/LoginView.vue')
    },
    {
        path: '/register',
        name: 'Register',
        component: () => import('../views/RegisterView.vue')
    },
    {
        path: '/create-recipe',
        name: 'CreateRecipe',
        component: () => import('../views/CreateRecipeView.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/recipe/:id',
        name: 'RecipeDetail',
        component: () => import('../views/RecipeDetailView.vue')
    },
    {
        path: '/profile',
        name: 'Profile',
        component: () => import('../views/ProfileView.vue'),
        meta: { requiresAuth: true },
        children: [
            {
                path: '',
                redirect: '/profile/recipes'
            },
            {
                path: 'recipes',
                component: () => import('../views/profile/MyRecipes.vue')
            },
            {
                path: 'favorites',
                component: () => import('../views/profile/MyFavorites.vue')
            }
        ]
    },
    {
        path: '/edit-recipe/:id',
        name: 'EditRecipe',
        component: () => import('../views/EditRecipeView.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/chefs',
        name: 'Chefs',
        component: () => import('../views/ChefsView.vue')
    },
    {
        path: '/chef/:id',
        name: 'ChefProfile',
        component: () => import('../views/ChefProfileView.vue')
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

// 路由守卫
router.beforeEach(async (to, from, next) => {
    const authStore = useAuthStore();

    // 简单的鉴权逻辑
    if (to.meta.requiresAuth && !authStore.isAuthenticated) {
        next('/login');
    } else {
        next();
    }
});

export default router;