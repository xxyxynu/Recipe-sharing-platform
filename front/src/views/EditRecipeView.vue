<template>
    <div class="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div v-if="loading" class="flex justify-center">
            <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600"></div>
        </div>

        <div v-else class="bg-white rounded-xl shadow-lg p-8">
            <h1 class="text-3xl font-bold mb-6">Edit Recipe</h1>
            <form @submit.prevent="handleUpdate" class="space-y-6">
                <!-- 标题 -->
                <div>
                    <label class="block text-sm font-medium text-gray-700">Title</label>
                    <input v-model="form.title" type="text" required class="w-full border p-2 rounded">
                </div>

                <!-- 描述 -->
                <div>
                    <label class="block text-sm font-medium text-gray-700">Description</label>
                    <textarea v-model="form.description" rows="3" required class="w-full border p-2 rounded"></textarea>
                </div>

                <div class="flex justify-end gap-4">
                    <button type="button" @click="$router.back()" class="text-gray-500">Cancel</button>
                    <button type="submit" class="bg-emerald-600 text-white px-4 py-2 rounded">Update Recipe</button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useRecipeStore } from '../stores/recipe';
import api from '../utils/api';

const route = useRoute();
const router = useRouter();
const recipeStore = useRecipeStore();
const loading = ref(true);

const form = reactive({
    title: '',
    description: '',
    category: '',
    prepTime: 0,
    cookTime: 0,
    servings: 0,
    calories: 0,
    ingredients: [],
    instructions: [],
    tags: [],
    imageFile: null
});

// 初始化：获取旧数据并回填
onMounted(async () => {
    try {
        const { data } = await api.get(`/recipes/${route.params.id}`);

        form.title = data.title;
        form.description = data.description;
        form.category = data.category;
        form.prepTime = data.prepTime;
        form.cookTime = data.cookTime;
        form.servings = data.servings;
        form.calories = data.calories;

        // 转换格式以适配 UI (例如 { value: '...' })
        form.ingredients = data.ingredients.map(i => ({ value: i }));
        form.instructions = data.instructions.map(i => ({ value: i }));
        form.tags = data.tags.map(t => ({ value: t }));

    } catch (err) {
        alert('Failed to load recipe');
        router.push('/profile');
    } finally {
        loading.value = false;
    }
});

const handleUpdate = async () => {
    const formData = new FormData();
    formData.append('title', form.title);
    formData.append('description', form.description);

    form.ingredients.forEach(i => formData.append('ingredients', i.value));
    form.instructions.forEach(i => formData.append('instructions', i.value));
    const tagValues = form.tags.map(t => t.value);
    formData.append('tags', JSON.stringify(tagValues));

    if (form.imageFile) {
        formData.append('image', form.imageFile);
    }

    try {
        await api.put(`/recipes/${route.params.id}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        alert('Updated successfully');
        router.push('/profile');
    } catch (err) {
        alert('Update failed');
    }
};
</script>