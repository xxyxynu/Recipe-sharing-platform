<template>
    <div
        class="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition duration-300 flex flex-col h-full group">
        <div class="relative h-48 overflow-hidden bg-gray-200">

            <img :src="resolvedImageUrl" alt="Recipe Image"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                @error="handleImageError" />

            <span
                class="absolute top-2 left-2 bg-white/90 backdrop-blur text-emerald-700 text-xs font-bold px-2 py-1 rounded-md shadow-sm">
                {{ recipe.category || 'Food' }}
            </span>
            <div
                class="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                <svg class="w-3 h-3 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                    <path
                        d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z">
                    </path>
                </svg>
                <span>{{ recipe.favorites?.length || 0 }}</span>
            </div>
        </div>

        <div class="p-4 flex flex-col flex-grow">
            <h3 class="text-lg font-bold text-gray-900 mb-1 line-clamp-1 group-hover:text-emerald-600">
                {{ recipe.title }}
            </h3>

            <p class="text-sm text-gray-500 mb-4 line-clamp-2 flex-grow">
                {{ recipe.description }}
            </p>

            <div class="border-t pt-3 flex items-center justify-between mt-auto">
                <div class="flex items-center">
                    <div
                        class="h-6 w-6 rounded-full bg-emerald-100 flex items-center justify-center text-xs text-emerald-600 font-bold overflow-hidden">

                        <img v-if="recipe.author?.avatar" :src="getImageUrl(recipe.author.avatar)"
                            class="w-full h-full object-cover">
                        <span v-else>{{ recipe.author?.username?.charAt(0).toUpperCase() || 'U' }}</span>
                    </div>
                    <span class="ml-2 text-xs text-gray-600 truncate max-w-[80px]">
                        {{ recipe.author?.username || 'Unknown' }}
                    </span>
                </div>

                <div class="flex items-center text-xs text-gray-400">
                    <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    {{ (recipe.prepTime || 0) + (recipe.cookTime || 0) }} min

                    <span class="mx-1">•</span>
                    <span>{{ timeAgo(recipe.createdAt) }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import { getImageUrl } from '../utils/imageHelper';
import { useDateFormatter } from '../composables/useDateFormatter';

const { timeAgo } = useDateFormatter();

const props = defineProps({
    recipe: {
        type: Object,
        required: true
    }
});

// 2. 使用 helper 处理主图 URL
const resolvedImageUrl = computed(() => {
    // 如果没有图片，imageHelper 会返回默认图，但如果你想保留 'placehold.co' 的样式，可以先判断
    if (!props.recipe.image) {
        return 'https://placehold.co/400x300?text=No+Image';
    }
    // 使用 helper 处理路径（它会自动根据环境拼接后端地址）
    return getImageUrl(props.recipe.image);
});

// 图片加载失败的兜底处理
const handleImageError = (e) => {
    e.target.src = 'https://placehold.co/400x300?text=Food';
};

// 移除了原来的 getAvatarUrl 函数，因为现在直接在 template 里用 getImageUrl 即可

</script>