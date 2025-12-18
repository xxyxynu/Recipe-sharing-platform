<template>
    <div class="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">

        <!-- 1. 顶部个人信息卡片 (这部分几乎不用变，除了删掉 activeTab 相关逻辑) -->
        <div class="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
            <div class="bg-emerald-600 h-32"></div>
            <div class="px-8 pb-8">
                <div class="relative flex items-end -mt-12 mb-6">
                    <!-- 头像上传 -->
                    <div class="relative group">
                        <div class="h-24 w-24 rounded-full ring-4 ring-white bg-white overflow-hidden cursor-pointer">
                            <img :src="getImageUrl(authStore.user?.avatar)" class="h-full w-full object-cover">
                            <div @click="triggerUpload"
                                class="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-200">
                                <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z">
                                    </path>
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                </svg>
                            </div>
                        </div>
                        <input type="file" ref="fileInput" class="hidden" accept="image/*" @change="handleAvatarChange">
                    </div>

                    <!-- 用户名 -->
                    <div class="ml-6 flex-1">
                        <div v-if="!isEditing" class="flex items-center">
                            <h1 class="text-2xl font-bold text-gray-900">{{ authStore.user?.username }}</h1>
                            <button @click="startEdit" class="ml-3 text-gray-400 hover:text-emerald-600">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z">
                                    </path>
                                </svg>
                            </button>
                        </div>
                        <div v-else class="flex items-center">
                            <input v-model="editName" type="text"
                                class="border rounded px-2 py-1 text-sm focus:ring-emerald-500 focus:border-emerald-500">
                            <button @click="saveProfile" class="ml-2 text-emerald-600 text-sm font-bold">Save</button>
                            <button @click="isEditing = false" class="ml-2 text-gray-500 text-sm">Cancel</button>
                        </div>
                        <p class="text-sm text-gray-500">{{ authStore.user?.email }}</p>
                    </div>

                    <!-- 统计 -->
                    <div class="flex space-x-6 text-center">
                        <div>
                            <span class="block font-bold text-gray-900">{{ recipeStore.myRecipes.length }}</span>
                            <span class="text-xs text-gray-500">Recipes</span>
                        </div>
                        <div>
                            <span class="block font-bold text-gray-900">{{ authStore.user?.followers?.length || 0
                                }}</span>
                            <span class="text-xs text-gray-500">Followers</span>
                        </div>
                        <div>
                            <span class="block font-bold text-gray-900">{{ authStore.user?.following?.length || 0
                                }}</span>
                            <span class="text-xs text-gray-500">Following</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- 2. 🔥🔥🔥 导航 Tabs 改为 RouterLink 🔥🔥🔥 -->
        <div class="border-b border-gray-200 mb-6">
            <nav class="-mb-px flex space-x-8">
                <!-- 
                     active-class="border-emerald-500 text-emerald-600"
                     这个属性让 Vue Router 自动处理激活状态的样式
                -->
                <router-link to="/profile/recipes" active-class="border-emerald-500 text-emerald-600"
                    class="whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300">
                    My Recipes
                </router-link>

                <router-link to="/profile/favorites" active-class="border-emerald-500 text-emerald-600"
                    class="whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300">
                    My Favorites
                </router-link>
            </nav>
        </div>

        <!-- 3. 🔥🔥🔥 嵌套路由出口 🔥🔥🔥 -->
        <!-- 子页面的内容（MyRecipes 或 MyFavorites）会显示在这里 -->
        <router-view></router-view>

    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useAuthStore } from '../stores/auth';
import { useRecipeStore } from '../stores/recipe'; // 依然需要它来显示上面的统计数字
// 引入 helper
import { getImageUrl } from '../utils/imageHelper';

const authStore = useAuthStore();
const recipeStore = useRecipeStore();
// 不需要 useRouter 了，导航交给 router-link
// 不需要 activeTab 了，路由决定显示什么

const fileInput = ref(null);
const isEditing = ref(false);
const editName = ref('');

onMounted(async () => {
    await authStore.fetchUser();
    // 这里的 fetchMyRecipes 可以保留，以便上面显示 Recipes 数量统计
    await recipeStore.fetchMyRecipes();
});

// 头像处理
const triggerUpload = () => fileInput.value.click();
const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
        await authStore.uploadAvatar(file);
    }
};

// 个人信息修改
const startEdit = () => {
    editName.value = authStore.user.username;
    isEditing.value = true;
};
const saveProfile = async () => {
    if (editName.value.trim()) {
        await authStore.updateProfile(editName.value);
        isEditing.value = false;
    }
};
</script>