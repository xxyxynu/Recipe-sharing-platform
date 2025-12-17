<template>
<<<<<<< HEAD:frontend/src/views/ChefsView.vue
    <div class="page-root chefs-page">
        <div class="page-header">
            <h1 class="page-title">Discover <span class="accent">Chefs</span></h1>
            <p class="page-subtitle">Find and follow your favorite recipe creators</p>
        </div>

        <!-- Search Bar -->
        <div class="search-section">
            <div class="search-wrapper">
                <Search class="search-icon" />
                <input 
                    v-model="searchQuery" 
                    @input="handleSearch" 
                    type="text" 
                    placeholder="Search chefs by name..." 
                    class="search-input"
                />
            </div>
            <div class="filter-tabs">
                <button 
                    :class="['filter-tab', { active: activeTab === 'all' }]"
                    @click="activeTab = 'all'"
                >
                    All Chefs
                </button>
                <button 
                    :class="['filter-tab', { active: activeTab === 'following' }]"
                    @click="activeTab = 'following'"
                >
                    Following
                </button>
                <button 
                    :class="['filter-tab', { active: activeTab === 'recipes' }]"
                    @click="activeTab = 'recipes'"
                >
                    Find by Recipe
                </button>
            </div>
        </div>

        <!-- Find by Recipe Section -->
        <div v-if="activeTab === 'recipes'" class="find-by-recipe">
            <h3>Search for chefs by recipe</h3>
            <div class="recipe-search-wrapper">
                <input 
                    v-model="recipeSearchQuery" 
                    @input="handleRecipeSearch" 
                    type="text" 
                    placeholder="Type recipe name..." 
                    class="recipe-search-input"
                />
            </div>
            <div v-if="matchingRecipes.length" class="recipe-suggestions">
                <div 
                    v-for="recipe in matchingRecipes" 
                    :key="recipe._id"
                    @click="findChefsByRecipe(recipe._id)"
                    class="recipe-suggestion-item"
                >
                    <img :src="recipe.image?.startsWith('http') ? recipe.image : (recipe.image?.startsWith('/') ? recipe.image : `/src/assets${recipe.image}`)" alt="" class="recipe-thumb" />
                    <div class="recipe-info">
                        <div class="recipe-name">{{ recipe.title }}</div>
                        <div class="recipe-author">by {{ recipe.author?.username }}</div>
                    </div>
                </div>
            </div>
            <div v-if="chefsByRecipe.length" class="chefs-found">
                <h4>Chefs with similar recipes:</h4>
                <div class="chefs-grid">
                    <ChefCard 
                        v-for="chef in chefsByRecipe" 
                        :key="chef._id" 
                        :chef="chef"
                        @follow="handleFollow"
                        @unfollow="handleUnfollow"
                    />
                </div>
            </div>
        </div>

        <!-- Chefs Grid -->
        <div v-else class="chefs-section">
            <div v-if="loading" class="loading-state">
                <LoadingSpinner />
                <p>Loading chefs...</p>
            </div>

            <div v-else-if="error" class="error-state">
                <p>{{ error }}</p>
            </div>

            <div v-else-if="displayedChefs.length === 0" class="empty-state">
                <Users class="empty-icon" />
                <p>No chefs found</p>
                <p class="empty-subtitle">Try adjusting your search</p>
            </div>

            <div v-else class="chefs-grid">
                <ChefCard 
                    v-for="chef in displayedChefs" 
                    :key="chef._id" 
                    :chef="chef"
                    :is-following="followingMap[chef._id]"
                    @follow="handleFollow"
                    @unfollow="handleUnfollow"
                    @view-profile="viewChefProfile"
                />
            </div>
=======
    <div class="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">

        <!-- 1. 顶部标题与搜索 -->
        <div class="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
            <h1 class="text-3xl font-bold text-gray-900">Meet Our Chefs</h1>

            <!-- 搜索框 -->
            <div class="relative w-full md:w-72">
                <input v-model="searchQuery" @keyup.enter="handleSearch" type="text"
                    placeholder="Search chefs by name..."
                    class="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition shadow-sm">
                <button @click="handleSearch"
                    class="absolute right-2 top-1.5 bg-gray-100 p-1 rounded-full text-gray-500 hover:text-emerald-600">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                    </svg>
                </button>
                <div class="absolute left-3 top-2.5 text-gray-400">
                    <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                    </svg>
                </div>
            </div>
        </div>

        <!-- 2. 分类 Tabs (All / Following) -->
        <div class="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit mb-8 mx-auto md:mx-0">
            <button @click="activeTab = 'all'" class="px-6 py-2 rounded-md text-sm font-bold transition-all"
                :class="activeTab === 'all' ? 'bg-white text-emerald-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'">
                All Chefs
            </button>
            <button @click="activeTab = 'following'" class="px-6 py-2 rounded-md text-sm font-bold transition-all"
                :class="activeTab === 'following' ? 'bg-white text-emerald-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'">
                Following
            </button>
        </div>

        <!-- 加载状态 -->
        <div v-if="chefStore.loading" class="flex justify-center py-20">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
        </div>

        <!-- 3. 厨师列表 Grid -->
        <div v-else>

            <!-- 空状态提示 -->
            <div v-if="filteredChefs.length === 0"
                class="text-center py-20 text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                <p v-if="activeTab === 'following' && !authStore.isAuthenticated">
                    Please <router-link to="/login"
                        class="text-emerald-600 font-bold hover:underline">login</router-link> to see chefs you follow.
                </p>
                <p v-else-if="activeTab === 'following'">
                    You are not following anyone yet. Go explore "All Chefs"!
                </p>
                <p v-else>
                    No chefs found matching "{{ searchQuery }}".
                </p>
            </div>

            <!-- 列表内容 -->
            <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                <div v-for="chef in filteredChefs" :key="chef._id"
                    class="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-lg transition flex flex-col items-center group">

                    <!-- 头像 -->
                    <div class="relative w-24 h-24 mb-4">
                        <img :src="getAvatarUrl(chef.avatar)"
                            class="w-full h-full rounded-full object-cover border-4 border-emerald-50 transition transform group-hover:scale-105">
                    </div>

                    <!-- 名字 -->
                    <h3 class="text-xl font-bold text-gray-900 group-hover:text-emerald-600 transition">{{ chef.username
                        }}</h3>

                    <!-- 简介 -->
                    <p class="text-gray-500 text-sm mt-2 mb-4 line-clamp-2 h-10 w-full px-2">
                        "{{ chef.bio || 'Passionate about food.' }}"
                    </p>

                    <!-- 统计 -->
                    <div class="flex justify-center gap-4 text-sm text-gray-400 mb-6 bg-gray-50 px-4 py-1 rounded-full">
                        <div class="flex items-center gap-1">
                            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path
                                    d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z">
                                </path>
                            </svg>
                            <span class="font-bold text-gray-800">{{ chef.followers?.length || 0 }}</span>
                        </div>
                    </div>

                    <!-- 按钮组 (推到底部) -->
                    <div class="flex justify-center gap-2 mt-auto w-full">
                        <button @click="$router.push(`/chef/${chef._id}`)"
                            class="flex-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm font-medium transition">
                            Profile
                        </button>

                        <!-- 关注按钮 -->
                        <button v-if="authStore.user?._id !== chef._id" @click="handleFollow(chef)"
                            class="flex-1 px-3 py-2 rounded-lg text-sm font-medium transition border flex items-center justify-center gap-1"
                            :class="isFollowing(chef)
                                ? 'bg-white text-emerald-600 border-emerald-600 hover:bg-red-50 hover:text-red-600 hover:border-red-600'
                                : 'bg-emerald-600 text-white border-transparent hover:bg-emerald-700'">
                            <span v-if="isFollowing(chef)">Following</span>
                            <span v-else>+ Follow</span>
                        </button>
                    </div>
                </div>
            </div>

>>>>>>> f806cdb (updated front and back):front/src/views/ChefsView.vue
        </div>
    </div>
</template>

<script setup>
<<<<<<< HEAD:frontend/src/views/ChefsView.vue
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { Search, Users } from 'lucide-vue-next'
import { getAllChefsAPI, getFollowingAPI, getChefsByRecipeAPI, followChefAPI, unfollowChefAPI } from '@/api/chef'
import { getAllRecipesAPI } from '@/api/recipe'
import { mockRecipes } from '@/mocks/mockData'
import ChefCard from '@/components/ChefCard.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'

const router = useRouter()

const chefs = ref([])
const following = ref([])
const chefsByRecipe = ref([])
const loading = ref(false)
const error = ref('')
const searchQuery = ref('')
const recipeSearchQuery = ref('')
const matchingRecipes = ref([])
const activeTab = ref('all')

const followingMap = computed(() => {
    const map = {}
    following.value.forEach(chef => {
        map[chef._id] = true
    })
    return map
})

const displayedChefs = computed(() => {
    if (activeTab.value === 'following') {
        return following.value
    }
    return chefs.value
})

// Load all chefs
const loadChefs = async () => {
    loading.value = true
    error.value = ''
    try {
        const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true' || !import.meta.env.VITE_API_URL
        if (USE_MOCK) {
            chefs.value = await getAllChefsAPI(searchQuery.value)
        } else {
            const res = await getAllChefsAPI(searchQuery.value)
            chefs.value = Array.isArray(res) ? res : res.chefs || []
        }
    } catch (err) {
        error.value = err.message || 'Failed to load chefs'
        console.error('Error loading chefs:', err)
    } finally {
        loading.value = false
    }
}

// Load following
const loadFollowing = async () => {
    try {
        const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true' || !import.meta.env.VITE_API_URL
        if (USE_MOCK) {
            following.value = await getFollowingAPI()
        } else {
            const res = await getFollowingAPI()
            following.value = Array.isArray(res) ? res : res.chefs || []
        }
    } catch (err) {
        console.error('Error loading following:', err)
    }
}

// Search handler
const handleSearch = () => {
    loadChefs()
}

// Recipe search handler
const handleRecipeSearch = () => {
    if (!recipeSearchQuery.value.trim()) {
        matchingRecipes.value = []
        chefsByRecipe.value = []
        return
    }
    
    const query = recipeSearchQuery.value.toLowerCase()
    matchingRecipes.value = mockRecipes
        .filter(r => r.title.toLowerCase().includes(query))
        .slice(0, 5)
}

// Find chefs by recipe
const findChefsByRecipe = async (recipeId) => {
    loading.value = true
    try {
        const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true' || !import.meta.env.VITE_API_URL
        if (USE_MOCK) {
            chefsByRecipe.value = await getChefsByRecipeAPI(recipeId)
        } else {
            const res = await getChefsByRecipeAPI(recipeId)
            chefsByRecipe.value = Array.isArray(res) ? res : res.chefs || []
        }
    } catch (err) {
        console.error('Error finding chefs by recipe:', err)
    } finally {
        loading.value = false
    }
}

// Follow chef
const handleFollow = async (chefId) => {
    try {
        await followChefAPI(chefId)
        await loadFollowing()
        // Update chef in list
        const chef = chefs.value.find(c => c._id === chefId)
        if (chef) {
            chef.followers = (chef.followers || 0) + 1
        }
    } catch (err) {
        console.error('Error following chef:', err)
        alert('Failed to follow chef')
    }
}

// Unfollow chef
const handleUnfollow = async (chefId) => {
    try {
        await unfollowChefAPI(chefId)
        await loadFollowing()
        // Update chef in list
        const chef = chefs.value.find(c => c._id === chefId)
        if (chef && chef.followers > 0) {
            chef.followers = chef.followers - 1
        }
    } catch (err) {
        console.error('Error unfollowing chef:', err)
        alert('Failed to unfollow chef')
    }
}

// View chef profile
const viewChefProfile = (chefId) => {
    router.push(`/chef/${chefId}`)
}

// Watch active tab
watch(activeTab, (newTab) => {
    if (newTab === 'following') {
        loadFollowing()
    } else if (newTab === 'all') {
        loadChefs()
    }
})

onMounted(() => {
    loadChefs()
    loadFollowing()
})
</script>

<style scoped>
.chefs-page {
    padding: 40px;
    max-width: 1400px;
    margin: 0 auto;
}

.page-header {
    text-align: center;
    margin-bottom: 40px;
}

.page-title {
    font-size: 42px;
    font-weight: 700;
    margin-bottom: 10px;
    color: #333;
}

.page-title .accent {
    color: var(--primary-color, #ff7f50);
}

.page-subtitle {
    font-size: 18px;
    color: #666;
}

.search-section {
    margin-bottom: 40px;
}

.search-wrapper {
    position: relative;
    max-width: 600px;
    margin: 0 auto 20px;
}

.search-icon {
    position: absolute;
    left: 16px;
    top: 50%;
    transform: translateY(-50%);
    width: 20px;
    height: 20px;
    color: #999;
}

.search-input {
    width: 100%;
    padding: 14px 16px 14px 48px;
    border: 2px solid #e0e0e0;
    border-radius: 30px;
    font-size: 16px;
    transition: all 0.3s ease;
}

.search-input:focus {
    outline: none;
    border-color: var(--primary-color, #ff7f50);
    box-shadow: 0 0 0 3px rgba(255, 127, 80, 0.1);
}

.filter-tabs {
    display: flex;
    justify-content: center;
    gap: 10px;
    flex-wrap: wrap;
}

.filter-tab {
    padding: 10px 24px;
    border: 2px solid #e0e0e0;
    background: white;
    border-radius: 25px;
    font-size: 15px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
    color: #666;
}

.filter-tab:hover {
    border-color: var(--primary-color, #ff7f50);
    color: var(--primary-color, #ff7f50);
}

.filter-tab.active {
    background: var(--primary-color, #ff7f50);
    border-color: var(--primary-color, #ff7f50);
    color: white;
}

.find-by-recipe {
    background: #f9f9f9;
    padding: 30px;
    border-radius: 16px;
    margin-bottom: 30px;
}

.find-by-recipe h3 {
    margin-bottom: 20px;
    color: #333;
}

.recipe-search-wrapper {
    margin-bottom: 20px;
}

.recipe-search-input {
    width: 100%;
    max-width: 500px;
    padding: 12px 16px;
    border: 2px solid #e0e0e0;
    border-radius: 12px;
    font-size: 15px;
}

.recipe-suggestions {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-bottom: 30px;
}

.recipe-suggestion-item {
    display: flex;
    align-items: center;
    gap: 15px;
    padding: 12px;
    background: white;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.2s ease;
}

.recipe-suggestion-item:hover {
    transform: translateX(5px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.recipe-thumb {
    width: 60px;
    height: 60px;
    object-fit: cover;
    border-radius: 8px;
}

.recipe-info {
    flex: 1;
}

.recipe-name {
    font-weight: 600;
    color: #333;
    margin-bottom: 4px;
}

.recipe-author {
    font-size: 14px;
    color: #666;
}

.chefs-found h4 {
    margin-bottom: 20px;
    color: #333;
}

.chefs-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 24px;
    margin-top: 30px;
}

.loading-state,
.error-state,
.empty-state {
    text-align: center;
    padding: 60px 20px;
}

.empty-icon {
    width: 80px;
    height: 80px;
    color: #ccc;
    margin-bottom: 20px;
}

.empty-state p {
    font-size: 18px;
    color: #666;
    margin-bottom: 8px;
}

.empty-subtitle {
    font-size: 14px;
    color: #999;
}

@media (max-width: 768px) {
    .chefs-page {
        padding: 20px;
    }

    .page-title {
        font-size: 32px;
    }

    .chefs-grid {
        grid-template-columns: 1fr;
    }
}
</style>
=======
import { onMounted, ref, computed } from 'vue';
import { useChefStore } from '../stores/chef';
import { useAuthStore } from '../stores/auth';
import { useRouter } from 'vue-router';

const chefStore = useChefStore();
const authStore = useAuthStore();
const router = useRouter();

const searchQuery = ref('');
const activeTab = ref('all'); // all | following

// 🔥 核心逻辑：根据 Tab 筛选显示的厨师
const filteredChefs = computed(() => {
    // 1. 获取所有（可能是搜索后的结果）
    let list = chefStore.chefs;

    // 2. 如果当前 Tab 是 'following'，则只过滤出我关注的
    if (activeTab.value === 'following') {
        if (!authStore.isAuthenticated || !authStore.user?.following) {
            return []; // 没登录或没关注，返回空
        }
        // 筛选逻辑：厨师的 ID 必须在我的 following 数组里
        list = list.filter(chef => authStore.user.following.includes(chef._id));
    }

    return list;
});

onMounted(() => {
    // 初始加载所有厨师
    chefStore.fetchAllChefs();
});

const handleSearch = () => {
    // 搜索时，无论在哪个 Tab，都去后端搜，搜完后 computed 会自动过滤
    chefStore.fetchAllChefs(searchQuery.value);
};

const getAvatarUrl = (path) => {
    if (!path) return 'https://placehold.co/150x150?text=Chef';
    if (path.startsWith('http')) return path;
    return `http://localhost:5000${path}`;
};

const isFollowing = (chef) => {
    if (!authStore.user || !authStore.user.following) return false;
    // 使用“我的关注列表”来判断，比用“厨师的粉丝列表”更准确，因为这是我们 store 里实时更新的数据
    return authStore.user.following.includes(chef._id);
};

const handleFollow = async (chef) => {
    if (!authStore.isAuthenticated) {
        router.push('/login');
        return;
    }
    await chefStore.toggleFollow(chef._id);
};
</script>
>>>>>>> f806cdb (updated front and back):front/src/views/ChefsView.vue
