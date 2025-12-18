<template>
    <div>
        <div v-if="loading" class="flex justify-center py-10">
            <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600"></div>
        </div>

        <div v-else>
            <div v-if="recipeStore.myRecipes.length === 0" class="text-center py-12 text-gray-500">
                You haven't posted any recipes yet.
                <router-link to="/create-recipe" class="text-emerald-600 font-bold ml-1">Create one!</router-link>
            </div>

            <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                <div v-for="recipe in recipeStore.myRecipes" :key="recipe._id" class="relative group">
                    <!-- RecipeCard -->
                    <RecipeCard :recipe="recipe" @click="$router.push(`/recipe/${recipe._id}`)"
                        class="cursor-pointer" />

                    <!-- Edit/Delete Buttons -->
                    <div
                        class="absolute top-2 right-2 flex space-x-2 opacity-0 group-hover:opacity-100 transition duration-200">
                        <button @click.stop="$router.push(`/edit-recipe/${recipe._id}`)"
                            class="bg-white p-2 rounded-full shadow hover:bg-emerald-50 text-emerald-600" title="Edit">
                            <!-- Edit Icon -->
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z">
                                </path>
                            </svg>
                        </button>
                        <button @click.stop="deleteRecipe(recipe._id)"
                            class="bg-white p-2 rounded-full shadow hover:bg-red-50 text-red-600" title="Delete">
                            <!-- Delete Icon -->
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
    </div>
</template>

<script setup>
import { onMounted, computed } from 'vue';
import { useRecipeStore } from '../../stores/recipe'; // 注意路径层级
import RecipeCard from '../../components/RecipeCard.vue';

const recipeStore = useRecipeStore();
const loading = computed(() => recipeStore.loading);

onMounted(() => {
    recipeStore.fetchMyRecipes();
});

const deleteRecipe = async (id) => {
    await recipeStore.deleteRecipe(id);
};
</script>