<template>
    <div class="home">
        <Carousel :items-to-show="1" :wrap-around="true" :autoplay="4000" class="hero-carousel">
            <Slide v-for="(banner, index) in banners" :key="index">
                <div class="hero-slide" :style="{ backgroundImage: `url(${banner.image})` }">
                    <div class="overlay"></div>
                    <div class="hero-content">
                        <h2>{{ banner.title }}</h2>
                        <p>{{ banner.description }}</p>
                        <RouterLink :to="banner.link" class="hero-btn">Explore Recipes</RouterLink>
                    </div>
                </div>
            </Slide>

            <template #addons>
                <Navigation />
                <Pagination />
            </template>
        </Carousel>

        <section class="trending-recipes">
            <div class="trending-header">
                <h2>Trending <span>Recipes</span></h2>
                <div class="trending-pagination">
                    <button @click="prevPage" :disabled="currentPage === 1">&lt;</button>
                    <span>{{ currentPage }} / {{ totalPages }}</span>
                    <button @click="nextPage" :disabled="currentPage === totalPages">&gt;</button>
                </div>
            </div>
            <div class="recipes">
                <RecipeCard v-for="recipe in pagedTrending" :key="recipe.id" :recipe="recipe" />
            </div>
        </section>

        <!-- 分类区域 -->
        <section class="categories">
            <h2 class="title">What to <span>Cook?</span></h2>

            <div class="category-list">
                <div v-for="(cat, i) in categories" :key="i" class="category-item"
                    :class="{ active: selectedCategory === cat.name }" @click="selectCategory(cat.name)">
                    <component :is="cat.icon" class="icon" />
                    <span>{{ cat.label }}</span>
                </div>
            </div>
        </section>

        <div class="recipes">
            <RecipeCard v-for="recipe in filteredRecipes" :key="recipe.id" :recipe="recipe" />
        </div>
    </div>
</template>

<script setup>
import RecipeCard from "../components/RecipeCard.vue";
import { ref, computed, onMounted } from "vue";
import "vue3-carousel/dist/carousel.css";
import { Carousel, Slide, Pagination, Navigation } from "vue3-carousel";
import { Flame, Cake, Salad, Drumstick, Leaf, Globe, Heart, Clock } from "lucide-vue-next";

import { RouterLink } from "vue-router";
import meal1 from "../assets/meal1.jpg";
import meal2 from "../assets/meal2.jpg";
import meal3 from "../assets/meal3.jpg";
import { getAllRecipesAPI } from '@/api/recipe';

const recipes = ref([]);
const loading = ref(false);
const error = ref('');

const banners = ref([
    {
        image: meal1,
        title: "Discover Delicious Recipes",
        description: "Join our community and share your favorite dishes!",
        link: "/recipes"
    },
    {
        image: meal2,
        title: "Cook with Passion",
        description: "Get inspired by creative chefs from around the world.",
        link: "/recipes"
    },
    {
        image: meal3,
        title: "Your Kitchen, Your Story",
        description: "Share your unique recipes and connect with food lovers.",
        link: "/recipes"
    },
]);

const selectedCategory = ref("All Types");

const categories = [
    { name: "All Types", label: "All Types", icon: Flame },
    { name: "Appetizers", label: "Appetizers", icon: Drumstick },
    { name: "Main Courses", label: "Main Courses", icon: Salad },
    { name: "Salads & Sides", label: "Salads & Sides", icon: Leaf },
    { name: "Vegetarian Delights", label: "Vegetarian Delights", icon: Heart },
    { name: "International Flavors", label: "International Flavors", icon: Globe },
    { name: "Desserts & Sweets", label: "Desserts & Sweets", icon: Cake },
    { name: "Healthy Eats", label: "Healthy Eats", icon: Heart },
    { name: "Quick & Easy Supper", label: "Quick & Easy Supper", icon: Clock },
];

const fetchRecipes = async () => {
    loading.value = true;
    error.value = '';
    try {
        const res = await getAllRecipesAPI(); // 也可以加分页参数
        console.log(res);
        recipes.value = res.recipes.map(r => ({
            ...r,
        }));
    } catch (err) {
        error.value = err.response?.data?.message || err.message || 'Failed to load recipes';
    } finally {
        loading.value = false;
    }
};

onMounted(() => {
    fetchRecipes();
});

const trendingRecipes = computed(() => {
    return [...recipes.value].sort((a, b) => b.views - a.views).slice(0, 3);
});

const pageSize = 3;
const currentPage = ref(1);

const totalPages = computed(() => Math.ceil(trendingRecipes.value.length / pageSize));

const pagedTrending = computed(() => {
    const start = (currentPage.value - 1) * pageSize;
    return trendingRecipes.value.slice(start, start + pageSize);
});

const nextPage = () => {
    if (currentPage.value < totalPages.value) currentPage.value++;
};

const prevPage = () => {
    if (currentPage.value > 1) currentPage.value--;
};

const filteredRecipes = computed(() => {
    if (selectedCategory.value === "All Types") return recipes.value;
    return recipes.value.filter(r => r.category === selectedCategory.value);
});

const selectCategory = (category) => {
    selectedCategory.value = category;
};

</script>

<style scoped>
.home {
    padding: 20px 40px;
}

.hero-carousel {
    margin-bottom: 50px;
    border-radius: 16px;
    overflow: hidden;
    position: relative;
}

.hero-slide {
    height: 420px;
    width: 100%;
    background-size: cover;
    background-position: center;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
}

.overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.35);
}

.hero-content {
    position: relative;
    text-align: center;
    color: #fff;
    max-width: 600px;
    z-index: 2;
    padding: 0 20px;
}

.hero-content h2 {
    font-size: 40px;
    font-weight: 700;
    margin-bottom: 12px;
}

.hero-content p {
    font-size: 18px;
    opacity: 0.9;
    margin-bottom: 20px;
}

.hero-btn {
    display: inline-block;
    background: var(--btn-color);
    color: #fff;
    padding: 10px 22px;
    border-radius: 30px;
    text-decoration: none;
    font-weight: 600;
    transition: all 0.3s ease;
}

.hero-btn:hover {
    background: var(--btn-color-hover);
    transform: translateY(-2px);
}

h1 {
    font-size: 24px;
    margin-bottom: 20px;
    color: var(--text-color);
}

.recipes {
    margin-top: 30px;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 20px;
}

.categories {
    text-align: center;
    margin-top: 120px;
}

.categories .title {
    font-size: 28px;
    font-weight: 700;
    margin-bottom: 25px;
    color: #333;
}

.categories .title span {
    color: var(--primary-color, #ff7f50);
}

.category-list {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 15px;
}

.category-item {
    display: flex;
    align-items: center;
    gap: 8px;
    background: var(--card-bg);
    border-radius: 30px;
    padding: 10px 18px;
    cursor: pointer;
    transition: all 0.25s ease;
    color: #444;
    font-weight: 500;
}

.category-item .icon {
    width: 18px;
    height: 18px;
    color: var(--primary-color, #ff7f50);
}

.category-item:hover {
    background: rgba(255, 127, 80, 0.1);
    transform: translateY(-2px);
}

.category-item.active {
    background: #333;
    color: #fff;
}

.category-item.active .icon {
    color: #fff;
}

.trending-recipes {
    margin: 50px 0;
}

.trending-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
}

.trending-header h2 {
    font-size: 28px;
    font-weight: 700;
}

.trending-header h2 span {
    color: var(--primary-color, #ff7f50);
}

.trending-pagination {
    display: flex;
    align-items: center;
    gap: 8px;
    font-weight: 500;
}

.trending-pagination button {
    padding: 4px 8px;
    border: none;
    background: none;
    color: var(--primary-color);
    border-radius: 4px;
    cursor: pointer;
    font-weight: 600;
}

.trending-pagination button:disabled {
    opacity: 0.4;
    cursor: default;
}

@media (max-width: 768px) {
    .hero-slide {
        height: 300px;
    }

    .hero-content h2 {
        font-size: 22px;
    }

    .hero-content p {
        font-size: 14px;
    }

    .categories .title {
        font-size: 22px;
    }

    .category-item {
        padding: 8px 14px;
        font-size: 13px;
    }

}
</style>
