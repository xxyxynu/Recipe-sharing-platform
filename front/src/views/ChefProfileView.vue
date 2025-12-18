<template>
    <div class="max-w-6xl mx-auto py-8 px-4">

        <div v-if="chefStore.loading || !chef" class="flex justify-center py-20">
            <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600"></div>
        </div>

        <div v-else>
            <!-- 头部信息 -->
            <div
                class="bg-white rounded-xl shadow-lg p-8 mb-8 text-center sm:text-left flex flex-col sm:flex-row items-center gap-8">
                <img :src="getImageUrl(chef.avatar)"
                    class="w-32 h-32 rounded-full object-cover border-4 border-emerald-100">

                <div class="flex-1">
                    <h1 class="text-3xl font-bold text-gray-900 mb-2">{{ chef.username }}</h1>
                    <p class="text-gray-600 italic mb-4">"{{ chef.bio || 'No bio yet.' }}"</p>

                    <div class="flex justify-center sm:justify-start gap-6 mb-4">
                        <div class="text-center sm:text-left">
                            <span class="block font-bold text-xl">{{ chef.followers.length }}</span>
                            <span class="text-gray-500 text-xs uppercase">Followers</span>
                        </div>
                        <div class="text-center sm:text-left">
                            <span class="block font-bold text-xl">{{ chef.following.length }}</span>
                            <span class="text-gray-500 text-xs uppercase">Following</span>
                        </div>
                        <div class="text-center sm:text-left">
                            <span class="block font-bold text-xl">{{ chefStore.chefRecipes.length }}</span>
                            <span class="text-gray-500 text-xs uppercase">Recipes</span>
                        </div>
                    </div>

                    <button v-if="authStore.user?._id !== chef._id" @click="handleFollow"
                        class="px-8 py-2 rounded-full font-bold transition shadow-sm"
                        :class="amIFollowing ? 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50' : 'bg-emerald-600 text-white hover:bg-emerald-700'">
                        {{ amIFollowing ? 'Unfollow' : 'Follow' }}
                    </button>
                </div>
            </div>

            <!-- 他的菜单 (Recipes) -->
            <h2 class="text-2xl font-bold mb-6 border-b pb-2">Recipes by {{ chef.username }}</h2>

            <div v-if="chefStore.chefRecipes.length === 0" class="text-center py-10 text-gray-500">
                This chef hasn't posted any recipes yet.
            </div>

            <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                <!-- 复用 RecipeCard -->
                <RecipeCard v-for="recipe in chefStore.chefRecipes" :key="recipe._id" :recipe="recipe"
                    @click="$router.push(`/recipe/${recipe._id}`)" class="cursor-pointer" />
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useChefStore } from '../stores/chef';
import { useAuthStore } from '../stores/auth';
import RecipeCard from '../components/RecipeCard.vue';
import { getImageUrl } from '../utils/imageHelper';

const route = useRoute();
const router = useRouter();
const chefStore = useChefStore();
const authStore = useAuthStore();

const chef = computed(() => chefStore.currentChef);

const amIFollowing = computed(() => {
    if (!authStore.user || !chef.value) return false;
    return chef.value.followers.includes(authStore.user.id || authStore.user._id);
});

onMounted(() => {
    chefStore.fetchChefDetail(route.params.id);
});

const handleFollow = async () => {
    if (!authStore.isAuthenticated) {
        router.push('/login');
        return;
    }
    await chefStore.toggleFollow(chef.value._id);
};
</script>