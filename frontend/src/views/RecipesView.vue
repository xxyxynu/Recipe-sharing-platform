<template>
    <div class="page-root">
        <aside class="left-col">
            <section class="rank-list">
                <div class="section-title small">Popular</div>
                <ol>
                    <li v-for="(item, idx) in mostViewed" :key="item.id" class="rank-item">
                        <div class="rank-index">{{ (idx + 1).toString().padStart(2, '0') }}</div>
                        <div class="rank-body">
                            <div class="rank-meta">
                                <div class="rank-title">{{ item.title }}</div>
                                <div class="rank-sub">{{ item.author?.username }} · {{ item.date }}</div>
                            </div>
                        </div>
                    </li>
                </ol>
            </section>

            <section class="tags-section">
                <div class="section-title">Popular Tags</div>
                <div class="tags-wrap">
                    <button v-for="t in popularTags" :key="t" class="tag-btn"># {{ t }}</button>
                </div>
            </section>
        </aside>

        <main class="right-col">
            <div class="grid-main">
                <section class="featured-card">
                    <div class="featured-thumb-wrap">
                        <img :src="`http://localhost:5001${featured.image}`" alt="featured" class="featured-image" />
                    </div>
                    <div class="featured-body">
                        <div class="title-row">
                            <h2 class="featured-title">{{ featured.title }}</h2>
                            <div class="featured-actions">
                                <Heart class="icon-btn" />
                                <Share2 class="icon-btn" />
                            </div>
                        </div>

                        <p class="featured-desc">{{ featured.description }}</p>
                        <div class="featured-meta">
                            <div class="author">
                                <img :src="`http://localhost:5001${featured.author?.avatar}`" class="avatar" />
                                <div>
                                    <div class="author-name">{{ featured.author?.username }}</div>
                                    <div class="author-date">{{ new Date(featured.createdAt).toLocaleDateString() }}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section class="latest-section">
                    <div class="latest-header">
                        <h3>Latest Recipes</h3>
                    </div>

                    <div class="latest-grid">
                        <article v-for="r in latest" :key="r.id" class="article-card">
                            <img :src="`http://localhost:5001${r.image}`" class="article-thumb" />
                            <div class="article-body">
                                <h4 class="article-title">{{ r.title }}</h4>
                                <div class="article-meta">{{ r.author?.username }} · {{ r.date }}</div>
                            </div>
                        </article>
                    </div>
                </section>

                <aside class="recommended">
                    <h3 class="rec-title">Recommended Recipes</h3>
                    <ol class="rec-list">
                        <li v-for="(it, i) in recommended" :key="it.id" class="rec-item">
                            <span class="rec-num">{{ (i + 1).toString().padStart(2, '0') }}</span>
                            <div class="rec-text">
                                <div class="rec-head">{{ it.title }}</div>
                                <div class="rec-date">{{ it.date }}</div>
                            </div>
                        </li>
                    </ol>
                </aside>
            </div>
        </main>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Heart, Share2 } from 'lucide-vue-next'
import { getPopularRecipesAPI, getLatestRecipesAPI, getAllRecipesAPI } from '@/api/recipe'

const mostViewed = ref([])
const latest = ref([])
const featured = ref({})
const recommended = ref([])
const popularTags = ref([])

onMounted(async () => {
    try {
        // 热门菜谱
        const popularRes = await getPopularRecipesAPI(5)
        mostViewed.value = popularRes.map(r => ({
            id: r._id,
            title: r.title,
            author: r.author,
            date: new Date(r.createdAt).toLocaleDateString(),
            image: r.image
        }))


        // 最新菜谱
        const latestRes = await getLatestRecipesAPI()
        latest.value = latestRes.recipes.map(r => ({
            ...r,
            date: new Date(r.createdAt).toLocaleDateString(),
        }))
        console.log('Latest recipes:', latest.value)

        // 取最新一条作为 featured
        featured.value = latest.value[0] || {}

        // 推荐菜谱（随便取 2 条）
        recommended.value = latest.value.slice(1, 2)

        // popularTags 可以从所有菜谱里提取 tags
        const allRes = await getAllRecipesAPI(1, 50)
        const tagsSet = new Set()
        allRes.recipes.forEach(r => r.tags?.forEach(t => tagsSet.add(t)))
        popularTags.value = Array.from(tagsSet).slice(0, 10)

    } catch (err) {
        console.error('Failed to load recipes:', err)
    }
})


</script>

<style scoped>
.left-col {
    width: 300px;
    float: left;
    margin-right: 28px;
    display: flex;
    flex-direction: column;
    gap: 28px;
}

.right-col {
    margin-left: 328px;
}

.section-title {
    font-size: 12px;
    font-weight: 700;
    color: var(--text-color);
    margin-bottom: 10px;
    text-transform: uppercase;
}

.section-title.small {
    font-size: 12px;
    color: var(--text-color);
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-bottom: 12px;
}

.rank-list ol {
    list-style: none;
    padding: 0;
    margin: 0;
}

.rank-item {
    display: flex;
    gap: 12px;
    align-items: center;
    padding: 10px 0;
    border-bottom: 1px solid rgba(20, 20, 20, 0.03);
}

.rank-index {
    min-width: 36px;
    font-weight: 800;
    color: var(--primary-color);
    font-size: 18px;
}

.rank-body {
    display: flex;
    gap: 10px;
    align-items: center;
}

.rank-thumb {
    width: 74px;
    height: 54px;
    object-fit: cover;
    border-radius: 8px;
    box-shadow: var(--shadow);
}

.rank-meta {
    max-width: 170px;
}

.rank-title {
    font-weight: 600;
    font-size: 16px;
    line-height: 1.1;
    margin-bottom: 6px;
}

.rank-sub {
    font-size: 13px;
    color: var(--muted);
}

.tags-section {
    padding-top: 6px;
}

.tags-wrap {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 8px;
}

.page-header {
    margin-bottom: 18px;
}

.page-h1 {
    margin: 0;
    font-size: 28px;
    font-weight: 800;
    letter-spacing: -0.4px;
}

.sub {
    margin-top: 6px;
    color: var(--muted);
}

.grid-main {
    display: flex;
    flex-direction: column;
    gap: 24px;
}

.featured-card {
    background: #fff;
    border-radius: 20px;
    overflow: hidden;
    display: flex;
    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);
    flex-direction: column;
    gap: 20px;
    padding: 18px;
}

.featured-thumb-wrap {
    position: relative;
    width: 100%;
    min-width: 340px;
    border-radius: 10px;
    overflow: hidden;
}

.featured-image {
    width: 100%;
    height: 420px;
    object-fit: cover;
    display: block;
}

.title-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.featured-actions {
    display: flex;
    gap: 10px;
}

.icon-btn {
    width: 20px;
    height: 20px;
    cursor: pointer;
    stroke: #222;
    /* 或 var(--text-color) */
}


.featured-body {
    padding: 6px 4px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: calc(100% - 20px);
}

.featured-title {
    margin: 0;
    font-size: 26px;
    line-height: 1.15;
    font-weight: 800;
}

.featured-desc {
    margin-top: 0px;
    color: #444;
    font-size: 14px;
    line-height: 1.45;
}

.featured-meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 14px;
}

.author {
    display: flex;
    gap: 10px;
    align-items: center;
}

.author-name {
    font-size: 16px;
    font-weight: 500;
    color: var(--text-color);
}

.author-date {
    font-size: 13px;
    color: #555;
}

.avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    object-fit: cover;
}

.latest-section {
    margin-top: 20px;
}

.latest-header {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    margin-bottom: 12px;
}

.latest-header h3 {
    margin: 0;
    font-size: 18px;
    font-weight: 700;
}

.accent {
    color: var(--text-color);
    font-weight: 800;
}

.latest-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 14px;
}

.article-card {
    background: #fff;
    border-radius: 12px;
    overflow: hidden;
    display: flex;
    gap: 12px;
    padding: 10px;
    box-shadow: 0 4px 14px rgba(10, 10, 10, 0.04);
    align-items: center;
}

.article-thumb {
    width: 110px;
    height: 76px;
    object-fit: cover;
    border-radius: 8px;
}

.article-body {
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.article-title {
    font-size: 14px;
    margin: 0;
    font-weight: 700;
    line-height: 1.15;
}

.article-meta {
    font-size: 12px;
    color: var(--muted);
}

.recommended {
    background: transparent;
    padding-top: 6px;
}

.rec-title {
    font-size: 18px;
    font-weight: 800;
    margin-bottom: 10px;
}

.rec-list {
    list-style: none;
    padding: 0;
    margin: 0;
}

.rec-item {
    display: flex;
    gap: 12px;
    align-items: flex-start;
    padding: 12px 0;
    border-top: 1px dashed rgba(0, 0, 0, 0.04);
}

.rec-num {
    min-width: 34px;
    font-weight: 800;
    color: var(--accent);
}

.rec-head {
    font-weight: 700;
    font-size: 14px;
}

.rec-date {
    font-size: 12px;
    color: var(--muted);
    margin-top: 4px;
}

/* 小屏适配（简单） */
@media (max-width: 1100px) {
    .page-root {
        padding: 18px;
    }

    .left-col {
        display: none;
    }

    .right-col {
        margin-left: 0;
    }

    .grid-main {
        grid-template-columns: 1fr;
    }

    .featured-thumb-wrap {
        min-width: auto;
        width: 100%;
    }

    .featured-card {
        flex-direction: column;
        gap: 12px;
    }

    .featured-body {
        width: 100%;
    }

    .latest-grid {
        grid-template-columns: 1fr;
    }
}
</style>
