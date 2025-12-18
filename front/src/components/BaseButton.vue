<template>
    <button :class="['base-btn', `btn-${variant}`]" :disabled="disabled || loading" :type="type">
        <!-- 如果正在加载，显示 Spinner -->
        <span v-if="loading" class="btn-spinner"></span>

        <!-- 否则显示插槽内容 -->
        <slot v-else></slot>
    </button>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
    variant: {
        type: String,
        default: 'primary', // primary, secondary, outline, danger
        validator: (value) => ['primary', 'secondary', 'outline', 'danger'].includes(value)
    },
    loading: {
        type: Boolean,
        default: false
    },
    disabled: {
        type: Boolean,
        default: false
    },
    type: {
        type: String,
        default: 'button'
    }
});
</script>

<style scoped>
.base-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0.75rem 1.5rem;
    border-radius: var(--radius-md);
    font-size: 0.875rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    border: 1px solid transparent;
    min-height: 2.75rem;
}

.base-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.btn-primary {
    background-color: var(--primary-color);
    color: white;
}

.btn-primary:not(:disabled):hover {
    background-color: var(--primary-hover);
}

.btn-secondary {
    background-color: white;
    color: var(--text-main);
    border-color: var(--border-color);
}

.btn-secondary:not(:disabled):hover {
    background-color: var(--bg-gray);
    border-color: #d1d5db;
}

.btn-outline {
    background-color: transparent;
    color: var(--primary-color);
    border-color: var(--primary-color);
}

.btn-outline:not(:disabled):hover {
    background-color: #ecfdf5;
}

.btn-danger {
    background-color: #ef4444;
    color: white;
}

.btn-danger:not(:disabled):hover {
    background-color: #dc2626;
}

.btn-spinner {
    width: 1.25rem;
    height: 1.25rem;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    border-top-color: white;
    animation: spin 0.8s linear infinite;
}

/* 如果是 Outline 按钮，Spinner 颜色要深一点 */
.btn-outline .btn-spinner {
    border-color: rgba(5, 150, 105, 0.2);
    border-top-color: var(--primary-color);
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}
</style>