<template>
    <div
        class="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition duration-300 flex flex-col h-full group">
        <!-- 图片区域 -->
        <div class="relative h-48 overflow-hidden bg-gray-200">
            <img :src="imageUrl" alt="Recipe Image"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                @error="handleImageError" />
            <!-- 分类标签 -->
            <span
                class="absolute top-2 left-2 bg-white/90 backdrop-blur text-emerald-700 text-xs font-bold px-2 py-1 rounded-md shadow-sm">
                {{ recipe.category || 'Food' }}
            </span>
            <!-- 收藏/点赞数 -->
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

        <!-- 内容区域 -->
        <div class="p-4 flex flex-col flex-grow">
            <!-- 标题 -->
            <h3 class="text-lg font-bold text-gray-900 mb-1 line-clamp-1 group-hover:text-emerald-600">
                {{ recipe.title }}
            </h3>

            <!-- 描述简略 -->
            <p class="text-sm text-gray-500 mb-4 line-clamp-2 flex-grow">
                {{ recipe.description }}
            </p>

            <!-- 底部信息 -->
            <div class="border-t pt-3 flex items-center justify-between mt-auto">
                <!-- 作者 -->
                <div class="flex items-center">
                    <div
                        class="h-6 w-6 rounded-full bg-emerald-100 flex items-center justify-center text-xs text-emerald-600 font-bold overflow-hidden">
                        <!-- 如果作者有头像显示头像，否则显示首字母 -->
                        <img v-if="recipe.author?.avatar" :src="getAvatarUrl(recipe.author.avatar)"
                            class="w-full h-full object-cover">
                        <span v-else>{{ recipe.author?.username?.charAt(0).toUpperCase() || 'U' }}</span>
                    </div>
                    <span class="ml-2 text-xs text-gray-600 truncate max-w-[80px]">
                        {{ recipe.author?.username || 'Unknown' }}
                    </span>
                </div>

                <!-- 时间信息 -->
                <div class="flex items-center text-xs text-gray-400">
                    <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    {{ (recipe.prepTime || 0) + (recipe.cookTime || 0) }} min
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
    recipe: {
        type: Object,
        required: true
    }
});

const imageUrl = computed(() => {
    if (!props.recipe.image) return 'https://placehold.co/400x300?text=No+Image';
    if (props.recipe.image.startsWith('http')) return props.recipe.image;
    return `http://localhost:5000${props.recipe.image}`;
});

const handleImageError = (e) => {
    e.target.src = 'https://placehold.co/400x300?text=Food';
};

const getAvatarUrl = (path) => {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    return `http://localhost:5000${path}`;
}

</script>