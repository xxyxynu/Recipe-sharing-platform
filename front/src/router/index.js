import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const routes = [
    {
        path: '/',
        name: 'Home',
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
    {
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        component: () => import('../views/NotFoundView.vue')
    }
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