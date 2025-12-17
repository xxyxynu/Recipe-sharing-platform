<template>
    <div class="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">

        <!-- 1. 顶部个人信息卡片 -->
        <div class="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
            <div class="bg-emerald-600 h-32"></div> <!-- 背景条 -->
            <div class="px-8 pb-8">
                <div class="relative flex items-end -mt-12 mb-6">
                    <!-- 头像上传区域 -->
                    <div class="relative group">
                        <div class="h-24 w-24 rounded-full ring-4 ring-white bg-white overflow-hidden cursor-pointer">
                            <img :src="getAvatarUrl(authStore.user?.avatar)" class="h-full w-full object-cover">
                            <!-- 悬停显示上传图标 -->
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

                    <!-- 用户名与修改 -->
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

                    <!-- 统计数据 (Followers 暂时只能展示假数据或 0，因为后端没做) -->
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

        <!-- 2. Tab 切换 -->
        <div class="border-b border-gray-200 mb-6">
            <nav class="-mb-px flex space-x-8">
                <button @click="activeTab = 'recipes'"
                    :class="activeTab === 'recipes' ? 'border-emerald-500 text-emerald-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'"
                    class="whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm">
                    My Recipes
                </button>
                <button @click="activeTab = 'favorites'"
                    :class="activeTab === 'favorites' ? 'border-emerald-500 text-emerald-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'"
                    class="whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm">
                    My Favorites
                </button>
            </nav>
        </div>

        <!-- 3. 内容列表 -->
        <div v-if="loading" class="flex justify-center py-10">
            <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600"></div>
        </div>

        <div v-else>
            <!-- My Recipes 列表 -->
            <div v-if="activeTab === 'recipes'">
                <div v-if="recipeStore.myRecipes.length === 0" class="text-center py-12 text-gray-500">
                    You haven't posted any recipes yet.
                    <router-link to="/create-recipe" class="text-emerald-600 font-bold ml-1">Create one!</router-link>
                </div>
                <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    <div v-for="recipe in recipeStore.myRecipes" :key="recipe._id" class="relative group">
                        <!-- 复用之前的 RecipeCard -->
                        <RecipeCard :recipe="recipe" @click="goToDetail(recipe._id)" class="cursor-pointer" />

                        <!-- 操作按钮 (Edit/Delete) - 悬停显示 -->
                        <div
                            class="absolute top-2 right-2 flex space-x-2 opacity-0 group-hover:opacity-100 transition duration-200">
                            <button @click.stop="goToEdit(recipe._id)"
                                class="bg-white p-2 rounded-full shadow hover:bg-emerald-50 text-emerald-600"
                                title="Edit">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z">
                                    </path>
                                </svg>
                            </button>
                            <button @click.stop="deleteRecipe(recipe._id)"
                                class="bg-white p-2 rounded-full shadow hover:bg-red-50 text-red-600" title="Delete">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16">
                                    </path>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Favorites 列表 -->
            <div v-if="activeTab === 'favorites'">
                <div v-if="recipeStore.myFavorites.length === 0" class="text-center py-12 text-gray-500">
                    No favorites yet. Go explore!
                </div>
                <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    <RecipeCard v-for="recipe in recipeStore.myFavorites" :key="recipe._id" :recipe="recipe"
                        @click="goToDetail(recipe._id)" class="cursor-pointer" />
                </div>
            </div>
        </div>

    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useAuthStore } from '../stores/auth';
import { useRecipeStore } from '../stores/recipe';
import { useRouter } from 'vue-router';
import RecipeCard from '../components/RecipeCard.vue';

const authStore = useAuthStore();
const recipeStore = useRecipeStore();
const router = useRouter();

const activeTab = ref('recipes');
const fileInput = ref(null);
const isEditing = ref(false);
const editName = ref('');

const loading = computed(() => recipeStore.loading || authStore.loading);

onMounted(async () => {
    // 获取最新用户信息
    await authStore.fetchUser();
    // 获取列表
    await recipeStore.fetchMyRecipes();
    await recipeStore.fetchMyFavorites();
});

// 头像处理
const triggerUpload = () => fileInput.value.click();
const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
        await authStore.uploadAvatar(file);
    }
};

const getAvatarUrl = (path) => {
    if (!path) return 'https://placehold.co/150x150?text=Avatar';
    if (path.startsWith('http')) return path;
    return `http://localhost:5000${path}`;
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

// 跳转与操作
const goToDetail = (id) => router.push(`/recipe/${id}`);
const goToEdit = (id) => router.push(`/edit-recipe/${id}`); // 👈 需要新建这个页面
const deleteRecipe = async (id) => {
    await recipeStore.deleteRecipe(id);
};
</script>