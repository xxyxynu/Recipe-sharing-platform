<template>
    <div class="review-card">
        <div class="review-header">
            <div class="user-meta">
                <div class="avatar-circle">
                    <img v-if="review.user?.avatar" :src="getImageUrl(review.user.avatar)" alt="User">
                    <span v-else>{{ review.user?.username?.charAt(0).toUpperCase() || 'U' }}</span>
                </div>

                <div class="user-info">
                    <span class="username">{{ review.user?.username || 'Anonymous' }}</span>
                    <span class="review-date" v-if="review.createdAt">{{ timeAgo(review.createdAt) }}</span>
                </div>
            </div>

            <div class="stars">
                <span v-for="n in 5" :key="n" :class="{ 'star-filled': n <= review.rating }">★</span>
            </div>
        </div>

        <p class="review-text">{{ review.comment }}</p>
    </div>
</template>

<script setup>
import { defineProps } from 'vue';
import { getImageUrl } from '../utils/imageHelper';
import { useDateFormatter } from '../composables/useDateFormatter';

const props = defineProps({
    review: {
        type: Object,
        required: true
    }
});

const { timeAgo } = useDateFormatter();
</script>

<style scoped>
.review-card {
    background-color: var(--bg-gray);
    padding: 1rem;
    border-radius: var(--radius-lg);
    margin-bottom: 1rem;
}

.review-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 0.75rem;
}

.user-meta {
    display: flex;
    align-items: center;
}

.avatar-circle {
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 50%;
    background-color: #e5e7eb;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    color: var(--text-secondary);
    margin-right: 0.75rem;
}

.avatar-circle img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.user-info {
    display: flex;
    flex-direction: column;
}

.username {
    font-size: 0.875rem;
    font-weight: 700;
    color: var(--text-main);
}

.review-date {
    font-size: 0.75rem;
    color: var(--text-light);
}

.stars {
    color: #d1d5db;
    font-size: 1rem;
    letter-spacing: 1px;
}

.star-filled {
    color: #fbbf24;
}

.review-text {
    font-size: 0.875rem;
    color: var(--text-secondary);
    line-height: 1.5;
    margin: 0;
    padding-left: 3.25rem;
}
</style>