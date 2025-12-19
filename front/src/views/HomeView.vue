<template>
    <div class="page-container">
        <div class="header-section">
            <h1>Discover Recipes</h1>
            <div class="search-wrapper">
                <input v-model="searchQuery" @keyup.enter="handleSearch" type="text" placeholder="Search recipes..."
                    class="search-input">
                <span class="search-icon">🔍</span>
            </div>
        </div>

        <div class="filter-section">
            <div class="categories">
                <button v-for="cat in categories" :key="cat" @click="selectCategory(cat)"
                    :class="['cat-btn', { active: selectedCategory === cat }]">
                    {{ cat }}
                </button>
            </div>

            <button @click="toggleSort" :class="['sort-btn', { active: currentSort === 'popular' }]">
                <span v-if="currentSort === 'popular'">🔥 Popular</span>
                <span v-else>🕒 Latest</span>
            </button>
        </div>

        <div v-if="recipeStore.loading && recipeStore.recipes.length === 0" class="loading-container">
            <div class="spinner"></div>
        </div>

        <TransitionGroup v-else name="list" tag="div" class="recipe-grid">
            <RecipeCard v-for="recipe in recipeStore.recipes" :key="recipe._id" :recipe="recipe" class="grid-item"
                @click="goToDetail(recipe._id)" />
        </TransitionGroup>

        <div v-if="!recipeStore.loading && recipeStore.recipes.length === 0" class="empty-state">
            <p>No recipes found.</p>
        </div>

        <div v-if="hasMore" class="load-more-container">
            <button @click="loadMore" :disabled="recipeStore.loading" class="btn-outline">
                Load More
            </button>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue';
import { useRecipeStore } from '../stores/recipe';
import { useRouter } from 'vue-router';
import RecipeCard from '../components/RecipeCard.vue';

const recipeStore = useRecipeStore();
const router = useRouter();
const searchQuery = ref('');
const categories = ['All', 'Breakfast', 'Lunch', 'Dinner', 'Dessert', 'Snack', 'Vegetarian'];
const selectedCategory = ref('All');
const currentSort = ref('latest');

const hasMore = computed(() => recipeStore.recipes.length < recipeStore.total);

const fetchData = (resetPage = true) => {
    recipeStore.fetchAllRecipes(resetPage ? 1 : recipeStore.page + 1, searchQuery.value, selectedCategory.value, currentSort.value);
};

onMounted(() => fetchData(true));
const selectCategory = (cat) => { selectedCategory.value = cat; fetchData(true); };
const toggleSort = () => { currentSort.value = currentSort.value === 'latest' ? 'popular' : 'latest'; fetchData(true); };
const handleSearch = () => fetchData(true);
const loadMore = () => fetchData(false);
const goToDetail = (id) => router.push(`/recipe/${id}`);
</script>

<style scoped>
.page-container {
    max-width: 80rem;
    margin: 0 auto;
    padding: 2rem 1rem;
}

.header-section {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-bottom: 2rem;
}

@media (min-width: 768px) {
    .header-section {
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
    }
}

.header-section h1 {
    font-size: 1.875rem;
    font-weight: 800;
    margin: 0;
}

/* Search */
.search-wrapper {
    position: relative;
    width: 100%;
}

@media (min-width: 768px) {
    .search-wrapper {
        width: 16rem;
    }
}

.search-input {
    width: 100%;
    padding: 0.5rem 1rem 0.5rem 2.5rem;
    border-radius: var(--radius-full);
    border: 1px solid var(--border-color);
    outline: none;
    transition: border-color 0.2s;
    box-sizing: border-box;
}

.search-input:focus {
    border-color: var(--primary-color);
    box-shadow: 0 0 0 1px var(--primary-color);
}

.search-icon {
    position: absolute;
    left: 0.75rem;
    top: 50%;
    transform: translateY(-50%);
    font-size: 0.875rem;
    color: var(--text-light);
}

/* Filters */
.filter-section {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-bottom: 2rem;
}

@media (min-width: 640px) {
    .filter-section {
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
    }
}

.categories {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
}

.cat-btn {
    padding: 0.375rem 1rem;
    border-radius: var(--radius-full);
    font-size: 0.875rem;
    font-weight: 500;
    border: 1px solid var(--border-color);
    background: var(--bg-white);
    color: var(--text-secondary);
    transition: all 0.2s;
}

.cat-btn:hover {
    color: var(--primary-color);
    border-color: var(--primary-color);
}

.cat-btn.active {
    background: var(--primary-color);
    color: white;
    border-color: var(--primary-color);
    box-shadow: var(--shadow-md);
}

.sort-btn {
    padding: 0.375rem 1rem;
    border-radius: var(--radius-full);
    font-size: 0.875rem;
    font-weight: 700;
    border: 1px solid var(--border-color);
    background: var(--bg-white);
    color: var(--text-secondary);
    transition: all 0.2s;
}

.sort-btn.active {
    background: #f97316;
    /* orange-500 */
    color: white;
    border-color: #f97316;
}

/* Grid & Loading */
.loading-container,
.empty-state,
.load-more-container {
    text-align: center;
    padding: 5rem 0;
}

.spinner {
    display: inline-block;
    width: 3rem;
    height: 3rem;
    border: 3px solid rgba(0, 0, 0, 0.1);
    border-radius: 50%;
    border-top-color: var(--primary-color);
    animation: spin 1s linear infinite;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

.recipe-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1.5rem;
    position: relative;
    /* for transition group */
}

@media (min-width: 640px) {
    .recipe-grid {
        grid-template-columns: repeat(2, 1fr);
    }
}

@media (min-width: 1024px) {
    .recipe-grid {
        grid-template-columns: repeat(3, 1fr);
    }
}

@media (min-width: 1280px) {
    .recipe-grid {
        grid-template-columns: repeat(4, 1fr);
    }
}

.btn-outline {
    padding: 0.5rem 1.5rem;
    border: 1px solid var(--primary-color);
    color: var(--primary-color);
    background: transparent;
    border-radius: var(--radius-full);
    transition: background 0.2s;
}

.btn-outline:hover {
    background: #ecfdf5;
}

.btn-outline:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.list-enter-active,
.list-leave-active {
    transition: all 0.5s ease;
}

.list-enter-from,
.list-leave-to {
    opacity: 0;
    transform: translateY(30px);
}

.list-leave-active {
    position: absolute;
    width: 100%;
    z-index: -1;
}

.list-move {
    transition: all 0.5s ease;
}
</style>