<template>
    <div class="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">

        <!-- 顶部区域 -->
        <div class="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
            <h1 class="text-3xl font-extrabold text-gray-900 tracking-tight">
                Discover Recipes
            </h1>

            <!-- 搜索框 -->
            <div class="relative w-full md:w-64">
                <input v-model="searchQuery" @keyup.enter="handleSearch" type="text" placeholder="Search recipes..."
                    class="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition">
                <div class="absolute left-3 top-2.5 text-gray-400">
                    <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                    </svg>
                </div>
            </div>
        </div>

        <!-- 🔥 筛选工具栏 (分类 + 热门按钮) -->
        <div class="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">

            <!-- 分类按钮组 -->
            <div class="flex flex-wrap gap-2 justify-center sm:justify-start">
                <button v-for="cat in categories" :key="cat" @click="selectCategory(cat)"
                    class="px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 border" :class="selectedCategory === cat
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-md'
                        : 'bg-white text-gray-600 border-gray-300 hover:border-emerald-500 hover:text-emerald-500'">
                    {{ cat }}
                </button>
            </div>

            <!-- 🔥🔥🔥 热门切换按钮 🔥🔥🔥 -->
            <button @click="toggleSort"
                class="flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-bold transition-all duration-300 shadow-sm border"
                :class="currentSort === 'popular'
                    ? 'bg-orange-500 text-white border-orange-500 ring-2 ring-orange-200 transform scale-105'
                    : 'bg-white text-gray-500 border-gray-300 hover:text-orange-500 hover:border-orange-500'">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5"
                    :class="currentSort === 'popular' ? 'animate-pulse' : ''" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd"
                        d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z"
                        clip-rule="evenodd" />
                </svg>
                {{ currentSort === 'popular' ? 'Popular' : 'Latest' }}
            </button>

        </div>

        <!-- 加载状态 -->
        <div v-if="recipeStore.loading && recipeStore.recipes.length === 0" class="flex justify-center py-20">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
        </div>

        <!-- 列表 -->
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <RecipeCard v-for="recipe in recipeStore.recipes" :key="recipe._id" :recipe="recipe" class="cursor-pointer"
                @click="goToDetail(recipe._id)" />
        </div>

        <!-- 空状态 -->
        <div v-if="!recipeStore.loading && recipeStore.recipes.length === 0" class="text-center py-20">
            <p class="text-gray-500 text-lg">No recipes found.</p>
        </div>

        <!-- 加载更多 -->
        <div v-if="hasMore" class="mt-12 text-center">
            <button @click="loadMore" :disabled="recipeStore.loading"
                class="px-6 py-2 border border-emerald-600 text-emerald-600 rounded-full hover:bg-emerald-50 transition disabled:opacity-50">
                Load More
            </button>
        </div>

    </div>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue';
import { useRecipeStore } from '../stores/recipe';
import { useRouter } from 'vue-router';
import RecipeCard from '../components/RecipeCard.vue';

const recipeStore = useRecipeStore();
const router = useRouter();
const searchQuery = ref('');

const categories = ['All', 'Breakfast', 'Lunch', 'Dinner', 'Dessert', 'Snack', 'Vegetarian'];
const selectedCategory = ref('All');
// 🔥 新增排序状态
const currentSort = ref('latest');

const hasMore = computed(() => {
    return recipeStore.recipes.length < recipeStore.total;
});

// 通用的获取数据函数
const fetchData = (resetPage = true) => {
    recipeStore.fetchAllRecipes(
        resetPage ? 1 : recipeStore.page + 1,
        searchQuery.value,
        selectedCategory.value,
        currentSort.value // 🔥 传入排序
    );
};

onMounted(() => {
    fetchData(true);
});

const selectCategory = (cat) => {
    selectedCategory.value = cat;
    fetchData(true);
};

// 🔥 切换排序逻辑
const toggleSort = () => {
    if (currentSort.value === 'latest') {
        currentSort.value = 'popular';
    } else {
        currentSort.value = 'latest';
    }
    fetchData(true);
};

const handleSearch = () => {
    fetchData(true);
};

const loadMore = () => {
    fetchData(false);
};

const goToDetail = (id) => {
    router.push(`/recipe/${id}`);
};
</script>