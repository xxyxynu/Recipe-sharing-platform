<template>
    <!-- 1. 加载中状态 (Loading) -->
    <div v-if="loading" class="flex justify-center items-center min-h-[50vh]">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
    </div>

    <!-- 2. 错误状态 (Error) -->
    <!-- 如果 store 里有 error，或者 recipe 是空的，显示错误信息 -->
    <div v-else-if="error || !recipe" class="flex flex-col items-center justify-center min-h-[50vh] text-center px-4">
        <div class="text-red-500 text-6xl mb-4">⚠️</div>
        <h2 class="text-2xl font-bold text-gray-800 mb-2">Oops! Something went wrong</h2>
        <p class="text-gray-600 mb-6">{{ error || 'Recipe not found' }}</p>
        <router-link to="/" class="px-6 py-2 bg-emerald-600 text-white rounded-full hover:bg-emerald-700 transition">
            Go Back Home
        </router-link>
    </div>

    <!-- 3. 正常内容状态 (Content) -->
    <!-- 只有当 loading 为 false 且 recipe 存在且没有 error 时才渲染 -->
    <div v-else class="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">

        <!-- 顶部大图与标题 -->
        <div class="bg-white rounded-xl shadow-lg overflow-hidden mb-8 group">
            <div class="relative h-64 sm:h-96 bg-gray-200">
                <img :src="getImageUrl(recipe.image)" @error="handleImageError" alt="Recipe Image"
                    class="w-full h-full object-cover transition transform duration-700 group-hover:scale-105">
                <!-- 渐变遮罩 -->
                <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>

                <div class="absolute bottom-0 left-0 p-6 sm:p-8 text-white w-full">
                    <div class="flex justify-between items-end">
                        <div>
                            <span
                                class="bg-emerald-600 text-xs font-bold px-2 py-1 rounded mb-2 inline-block uppercase tracking-wider">
                                {{ recipe.category || 'General' }}
                            </span>
                            <h1 class="text-3xl sm:text-5xl font-bold mb-2 shadow-sm">{{ recipe.title }}</h1>
                            <div class="flex items-center text-sm sm:text-base text-gray-200 font-medium">
                                <div class="flex items-center">
                                    <div
                                        class="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center text-xs font-bold text-gray-600 overflow-hidden mr-2">
                                        <img v-if="recipe.author?.avatar" :src="getImageUrl(recipe.author.avatar)"
                                            class="w-full h-full object-cover">
                                        <span v-else>{{ recipe.author?.username?.charAt(0).toUpperCase() }}</span>
                                    </div>
                                    <span>By {{ recipe.author?.username || 'Unknown' }}</span>
                                </div>
                                <span class="mx-3">•</span>
                                <span>{{ formatDate(recipe.createdAt) }}</span>
                            </div>
                        </div>

                        <!-- 收藏按钮 (带动画) -->
                        <button @click="handleFavorite"
                            class="p-3 rounded-full backdrop-blur-md transition-all duration-300 shadow-lg transform active:scale-95"
                            :class="isFavorited ? 'bg-white text-red-500 scale-110' : 'bg-black/40 text-white hover:bg-white hover:text-red-500'"
                            title="Add to Favorites">
                            <svg class="w-7 h-7" :fill="isFavorited ? 'currentColor' : 'none'" stroke="currentColor"
                                viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z">
                                </path>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            <!-- 数据统计栏 -->
            <div class="grid grid-cols-2 sm:grid-cols-4 border-b divide-x divide-gray-100 text-center py-5 bg-gray-50">
                <div class="p-2">
                    <span class="block text-gray-400 text-xs uppercase tracking-wider font-semibold">Prep Time</span>
                    <span class="font-bold text-gray-800 text-lg">{{ recipe.prepTime || 0 }} min</span>
                </div>
                <div class="p-2">
                    <span class="block text-gray-400 text-xs uppercase tracking-wider font-semibold">Cook Time</span>
                    <span class="font-bold text-gray-800 text-lg">{{ recipe.cookTime || 0 }} min</span>
                </div>
                <div class="p-2">
                    <span class="block text-gray-400 text-xs uppercase tracking-wider font-semibold">Servings</span>
                    <span class="font-bold text-gray-800 text-lg">{{ recipe.servings || 1 }} ppl</span>
                </div>
                <div class="p-2">
                    <span class="block text-gray-400 text-xs uppercase tracking-wider font-semibold">Calories</span>
                    <span class="font-bold text-gray-800 text-lg">{{ recipe.calories || 0 }} kcal</span>
                </div>
            </div>

            <!-- 描述 -->
            <div class="p-6 sm:p-10">
                <p class="text-gray-700 leading-relaxed text-lg mb-6 italic border-l-4 border-emerald-500 pl-4">
                    "{{ recipe.description }}"
                </p>

                <!-- Tags -->
                <div class="flex flex-wrap gap-2">
                    <span v-for="tag in (recipe.tags || [])" :key="tag"
                        class="text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                        #{{ tag }}
                    </span>
                </div>
            </div>
        </div>

        <!-- 下方两列布局 -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">

            <!-- 左侧：配料表 -->
            <div class="md:col-span-1">
                <div class="bg-white rounded-xl shadow-lg p-6 sticky top-6">
                    <h3 class="text-xl font-bold text-gray-900 mb-6 flex items-center">
                        <span class="text-2xl mr-2">🥕</span> Ingredients
                    </h3>
                    <ul class="space-y-4">
                        <li v-for="(item, index) in (recipe.ingredients || [])" :key="index"
                            class="flex items-start group">
                            <span
                                class="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mt-0.5 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3"
                                        d="M5 13l4 4L19 7"></path>
                                </svg>
                            </span>
                            <span
                                class="ml-3 text-gray-700 font-medium border-b border-transparent group-hover:border-gray-200 transition-all">{{
                                    item }}</span>
                        </li>
                    </ul>
                </div>
            </div>

            <!-- 右侧：步骤和评论 -->
            <div class="md:col-span-2 space-y-8">

                <!-- 步骤 -->
                <div class="bg-white rounded-xl shadow-lg p-8">
                    <h3 class="text-xl font-bold text-gray-900 mb-6 flex items-center">
                        <span class="text-2xl mr-2">🍳</span> Instructions
                    </h3>
                    <div class="space-y-8">
                        <div v-for="(step, index) in (recipe.instructions || [])" :key="index" class="flex">
                            <div class="flex-shrink-0 mr-5">
                                <span
                                    class="flex items-center justify-center h-10 w-10 rounded-full bg-emerald-600 text-white font-bold text-lg shadow-md">
                                    {{ index + 1 }}
                                </span>
                            </div>
                            <div class="pt-1">
                                <p class="text-gray-700 leading-relaxed text-lg">{{ step }}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 评论区 -->
                <div class="bg-white rounded-xl shadow-lg p-8">
                    <h3 class="text-xl font-bold text-gray-900 mb-6 flex items-center">
                        <span class="text-2xl mr-2">💬</span> Reviews ({{ recipe.reviews?.length || 0 }})
                    </h3>

                    <!-- 评论列表 -->
                    <div v-if="recipe.reviews && recipe.reviews.length > 0"
                        class="space-y-6 mb-8 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                        <div v-for="review in recipe.reviews" :key="review._id" class="bg-gray-50 p-4 rounded-lg">
                            <div class="flex items-center justify-between mb-3">
                                <div class="flex items-center">
                                    <div
                                        class="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center text-xs font-bold text-gray-600 overflow-hidden">
                                        <img v-if="review.user?.avatar" :src="getImageUrl(review.user.avatar)"
                                            class="w-full h-full object-cover">
                                        <span v-else>{{ review.user?.username?.charAt(0).toUpperCase() }}</span>
                                    </div>
                                    <span class="ml-2 font-bold text-gray-800 text-sm">{{ review.user?.username ||
                                        'Anonymous' }}</span>
                                </div>
                                <div class="flex text-yellow-400 text-sm">
                                    <span v-for="n in 5" :key="n">{{ n <= review.rating ? '★' : '☆' }}</span>
                                </div>
                            </div>
                            <p class="text-gray-600 text-sm pl-10">{{ review.comment }}</p>
                        </div>
                    </div>

                    <div v-else class="text-center py-8 text-gray-400 bg-gray-50 rounded-lg mb-6">
                        No reviews yet. Be the first to try this recipe!
                    </div>

                    <!-- 写评论 -->
                    <div v-if="authStore.isAuthenticated" class="border-t pt-6">
                        <h4 class="font-bold text-sm text-gray-700 mb-3 uppercase tracking-wide">Leave a Review</h4>
                        <form @submit.prevent="submitReview">
                            <div class="mb-4">
                                <div class="flex space-x-1">
                                    <button type="button" v-for="star in 5" :key="star"
                                        @click="reviewForm.rating = star"
                                        class="text-2xl focus:outline-none transition transform hover:scale-110"
                                        :class="star <= reviewForm.rating ? 'text-yellow-400' : 'text-gray-300'">★</button>
                                </div>
                            </div>
                            <div class="mb-4">
                                <textarea v-model="reviewForm.comment" rows="3" required
                                    class="w-full text-sm border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 p-3 border shadow-sm"
                                    placeholder="How was it? Write your opinion..."></textarea>
                            </div>
                            <button type="submit"
                                class="bg-emerald-600 text-white text-sm font-bold px-6 py-2.5 rounded-lg hover:bg-emerald-700 transition shadow-md">
                                Post Review
                            </button>
                        </form>
                    </div>
                    <div v-else
                        class="text-center py-4 bg-emerald-50 text-emerald-800 rounded-lg border border-emerald-100">
                        <router-link to="/login" class="font-bold underline">Log in</router-link> to leave a review.
                    </div>
                </div>

            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted, computed, reactive, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useRecipeStore } from '../stores/recipe';
import { useAuthStore } from '../stores/auth'; // 🔴 必须引入，否则收藏功能报错

const route = useRoute();
const router = useRouter();
const recipeStore = useRecipeStore();
const authStore = useAuthStore();

// 1. 获取 ID，如果没有 ID，store 可能会报错，所以要小心
const recipeId = route.params.id;

const reviewForm = reactive({
    rating: 5,
    comment: ''
});

// 从 store 获取状态
const recipe = computed(() => recipeStore.currentRecipe);
const loading = computed(() => recipeStore.loading);
const error = computed(() => recipeStore.error);

// 2. 初始化获取数据
onMounted(() => {
    if (recipeId && recipeId !== 'undefined') {
        recipeStore.fetchRecipeById(recipeId);
    } else {
        // 如果 URL 是 /recipe/undefined，直接报错，不要请求后端
        recipeStore.error = "Invalid Recipe ID";
        recipeStore.loading = false;
    }
});

// 监听路由变化（比如从热门点击推荐菜谱）
watch(() => route.params.id, (newId) => {
    if (newId && newId !== 'undefined') {
        recipeStore.fetchRecipeById(newId);
    }
});

// 3. 收藏状态计算属性 (防御性编程)
const isFavorited = computed(() => {
    // 如果没登录，或者菜谱没加载完，或者菜谱本身没有 favorites 字段
    if (!authStore.user || !recipe.value || !recipe.value.favorites) return false;

    // 确保它是数组
    if (!Array.isArray(recipe.value.favorites)) return false;

    const currentUserId = authStore.user.id || authStore.user._id;
    if (!currentUserId) return false;

    return recipe.value.favorites.some(id => id.toString() === currentUserId.toString());
});

// 4. 图片处理 (带默认值)
const getImageUrl = (path) => {
    if (!path) return 'https://placehold.co/800x600?text=No+Image'; // 默认图
    if (path.startsWith('http')) return path; // 网络图片
    return `http://localhost:5000${path}`; // 本地上传图片
};

// 图片加载失败的回退
const handleImageError = (e) => {
    e.target.src = 'https://placehold.co/800x600?text=Food';
};

// 格式化日期
const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric'
    });
};

// 5. 交互动作
const handleFavorite = async () => {
    if (!authStore.isAuthenticated) {
        if (confirm('You need to login to add favorites. Go to login?')) {
            router.push('/login');
        }
        return;
    }
    await recipeStore.toggleFavorite(recipe.value._id);
};

const submitReview = async () => {
    if (!reviewForm.comment.trim()) return;

    // 乐观更新或等待刷新
    const success = await recipeStore.addReview(recipe.value._id, {
        rating: reviewForm.rating,
        comment: reviewForm.comment
    });

    if (success) {
        reviewForm.comment = '';
        reviewForm.rating = 5;
        alert('Review posted successfully!');
    } else {
        alert('Failed to post review. You might have already reviewed this recipe.');
    }
};
</script>

<style scoped>
/* 自定义滚动条样式 */
.custom-scrollbar::-webkit-scrollbar {
    width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
    background: #f1f1f1;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
    background: #d1d5db;
    border-radius: 4px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #9ca3af;
}
</style>