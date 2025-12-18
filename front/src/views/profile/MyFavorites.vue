<template>
    <div>
        <div v-if="loading" class="flex justify-center py-10">
            <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600"></div>
        </div>

        <div v-else>
            <div v-if="recipeStore.myFavorites.length === 0" class="text-center py-12 text-gray-500">
                No favorites yet. Go explore!
            </div>
            <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                <RecipeCard v-for="recipe in recipeStore.myFavorites" :key="recipe._id" :recipe="recipe"
                    @click="$router.push(`/recipe/${recipe._id}`)" class="cursor-pointer" />
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted, computed } from 'vue';
import { useRecipeStore } from '../../stores/recipe'; // 注意路径层级
import RecipeCard from '../../components/RecipeCard.vue';

const recipeStore = useRecipeStore();
const loading = computed(() => recipeStore.loading);

onMounted(() => {
    recipeStore.fetchMyFavorites();
});
</script>