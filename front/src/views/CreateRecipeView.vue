<template>
    <div class="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div class="bg-white rounded-xl shadow-lg overflow-hidden">
            <div class="p-8">
                <h1 class="text-3xl font-bold text-gray-900 mb-6">Create New Recipe</h1>

                <!-- 全局错误提示 -->
                <div v-if="recipeStore.error" class="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
                    <p class="text-red-700">{{ recipeStore.error }}</p>
                </div>

                <form @submit.prevent="handleSubmit" class="space-y-8">

                    <!-- 1. 图片上传区域 -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Recipe Image</label>
                        <div class="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md cursor-pointer hover:border-emerald-500 transition"
                            @click="$refs.fileInput.click()" @dragover.prevent @drop.prevent="handleDrop">
                            <div class="space-y-1 text-center">
                                <!-- 图片预览 -->
                                <img v-if="imagePreview" :src="imagePreview"
                                    class="mx-auto h-64 object-cover rounded-md mb-4" />

                                <!-- 上传图标 -->
                                <svg v-else class="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none"
                                    viewBox="0 0 48 48">
                                    <path
                                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                        stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                </svg>

                                <div class="flex text-sm text-gray-600 justify-center">
                                    <span
                                        class="relative bg-white rounded-md font-medium text-emerald-600 hover:text-emerald-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-emerald-500">
                                        <span>Upload a file</span>
                                        <input ref="fileInput" type="file" class="sr-only" @change="handleFileChange"
                                            accept="image/*">
                                    </span>
                                    <p class="pl-1">or drag and drop</p>
                                </div>
                                <p class="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
                            </div>
                        </div>
                    </div>

                    <!-- 2. 基本信息 -->
                    <div class="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                        <div class="sm:col-span-4">
                            <label class="block text-sm font-medium text-gray-700">Title</label>
                            <input v-model="form.title" type="text" required
                                class="mt-1 focus:ring-emerald-500 focus:border-emerald-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2 border"
                                placeholder="e.g. Grandma's Apple Pie">
                        </div>

                        <div class="sm:col-span-2">
                            <label class="block text-sm font-medium text-gray-700">Category</label>
                            <select v-model="form.category"
                                class="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm">
                                <option>Breakfast</option>
                                <option>Lunch</option>
                                <option>Dinner</option>
                                <option>Dessert</option>
                                <option>Snack</option>
                                <option>Vegetarian</option>
                            </select>
                        </div>

                        <div class="sm:col-span-6">
                            <label class="block text-sm font-medium text-gray-700">Description</label>
                            <textarea v-model="form.description" rows="3" required
                                class="mt-1 shadow-sm focus:ring-emerald-500 focus:border-emerald-500 block w-full sm:text-sm border border-gray-300 rounded-md p-2"
                                placeholder="Tell us a bit about this recipe..."></textarea>
                        </div>
                    </div>

                    <!-- 3. 数据统计 (时间/份量) -->
                    <div class="grid grid-cols-2 gap-4 sm:grid-cols-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700">Prep Time (min)</label>
                            <input v-model.number="form.prepTime" type="number" min="0"
                                class="mt-1 focus:ring-emerald-500 focus:border-emerald-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2 border">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700">Cook Time (min)</label>
                            <input v-model.number="form.cookTime" type="number" min="0"
                                class="mt-1 focus:ring-emerald-500 focus:border-emerald-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2 border">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700">Servings</label>
                            <input v-model.number="form.servings" type="number" min="1"
                                class="mt-1 focus:ring-emerald-500 focus:border-emerald-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2 border">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700">Calories</label>
                            <input v-model.number="form.calories" type="number" min="0"
                                class="mt-1 focus:ring-emerald-500 focus:border-emerald-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2 border">
                        </div>
                    </div>

                    <!-- 4. 配料表 (Dynamic Array) -->
                    <div>
                        <label class="block text-lg font-medium text-gray-900 mb-2">Ingredients</label>
                        <div class="space-y-2">
                            <div v-for="(ing, index) in form.ingredients" :key="index" class="flex gap-2">
                                <input v-model="ing.value" type="text"
                                    class="flex-1 focus:ring-emerald-500 focus:border-emerald-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2 border"
                                    placeholder="e.g. 2 cups of flour">
                                <button type="button" @click="removeIngredient(index)"
                                    class="text-red-600 hover:text-red-800 p-2" v-if="form.ingredients.length > 1">
                                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16">
                                        </path>
                                    </svg>
                                </button>
                            </div>
                        </div>
                        <button type="button" @click="addIngredient"
                            class="mt-2 text-sm text-emerald-600 hover:text-emerald-500 font-medium flex items-center">
                            + Add Ingredient
                        </button>
                    </div>

                    <!-- 5. 步骤 (Dynamic Array) -->
                    <div>
                        <label class="block text-lg font-medium text-gray-900 mb-2">Instructions</label>
                        <div class="space-y-4">
                            <div v-for="(inst, index) in form.instructions" :key="index" class="flex gap-2 items-start">
                                <span class="mt-2 text-sm font-bold text-gray-400 w-6">{{ index + 1 }}.</span>
                                <textarea v-model="inst.value" rows="2"
                                    class="flex-1 focus:ring-emerald-500 focus:border-emerald-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2 border"
                                    placeholder="Describe the step..."></textarea>
                                <button type="button" @click="removeInstruction(index)"
                                    class="mt-2 text-red-600 hover:text-red-800 p-2"
                                    v-if="form.instructions.length > 1">
                                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16">
                                        </path>
                                    </svg>
                                </button>
                            </div>
                        </div>
                        <button type="button" @click="addInstruction"
                            class="mt-2 text-sm text-emerald-600 hover:text-emerald-500 font-medium flex items-center">
                            + Add Step
                        </button>
                    </div>

                    <!-- 6. Tags -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700">Tags</label>
                        <div class="flex flex-wrap gap-2 mt-2">
                            <div v-for="(tag, index) in form.tags" :key="index" class="flex items-center">
                                <input v-model="tag.value"
                                    class="w-24 p-1 text-sm border border-gray-300 rounded focus:ring-emerald-500 focus:border-emerald-500"
                                    placeholder="Tag...">
                                <button type="button" @click="removeTag(index)"
                                    class="ml-1 text-gray-400 hover:text-red-500">×</button>
                            </div>
                            <button type="button" @click="addTag"
                                class="text-sm border border-dashed border-gray-400 px-2 py-1 rounded text-gray-500 hover:border-emerald-500 hover:text-emerald-500">+
                                Tag</button>
                        </div>
                    </div>

                    <!-- 提交按钮 -->
                    <div class="pt-5">
                        <div class="flex justify-end">
                            <button type="button"
                                class="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none">
                                Cancel
                            </button>
                            <button type="submit" :disabled="recipeStore.loading"
                                class="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50">
                                {{ recipeStore.loading ? 'Publishing...' : 'Publish Recipe' }}
                            </button>
                        </div>
                    </div>

                </form>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useRecipeStore } from '../stores/recipe';
import { useRouter } from 'vue-router';

const recipeStore = useRecipeStore();
const router = useRouter();

const form = reactive({
    title: '',
    category: 'Dinner',
    description: '',
    prepTime: 15,
    cookTime: 30,
    servings: 2,
    calories: 0,
    ingredients: [{ value: '' }, { value: '' }],
    instructions: [{ value: '' }, { value: '' }],
    tags: [{ value: '' }],
    imageFile: null
});

const imagePreview = ref(null);

// --- 图片处理 ---
const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
        processFile(file);
    }
};

const handleDrop = (e) => {
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
        processFile(file);
    }
};

const processFile = (file) => {
    form.imageFile = file;
    const reader = new FileReader();
    reader.onload = (e) => {
        imagePreview.value = e.target.result;
    };
    reader.readAsDataURL(file);
};

const addIngredient = () => form.ingredients.push({ value: '' });
const removeIngredient = (index) => form.ingredients.splice(index, 1);

const addInstruction = () => form.instructions.push({ value: '' });
const removeInstruction = (index) => form.instructions.splice(index, 1);

const addTag = () => form.tags.push({ value: '' });
const removeTag = (index) => form.tags.splice(index, 1);

const handleSubmit = async () => {
    const cleanData = {
        ...form,
        ingredients: form.ingredients.filter(i => i.value.trim() !== ''),
        instructions: form.instructions.filter(i => i.value.trim() !== ''),
        tags: form.tags.filter(t => t.value.trim() !== '')
    };

    if (!cleanData.title || !cleanData.description || cleanData.ingredients.length === 0) {
        alert('Please fill in required fields (Title, Description, Ingredients)');
        return;
    }

    const result = await recipeStore.createRecipe(cleanData);

    if (result) {
        alert('Recipe Created Successfully!');
        router.push('/');
    }
};
</script>