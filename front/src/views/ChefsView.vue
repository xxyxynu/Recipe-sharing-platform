<template>
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
                        <img :src="getImageUrl(chef.avatar)"
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

        </div>
    </div>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue';
import { useChefStore } from '../stores/chef';
import { useAuthStore } from '../stores/auth';
import { useRouter } from 'vue-router';
import { getImageUrl } from '../utils/imageHelper';

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
