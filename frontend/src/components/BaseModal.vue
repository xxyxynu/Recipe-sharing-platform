<template>
    <transition name="fade">
        <div v-if="isOpen" class="modal-overlay" @click.self="onCancel">
            <div class="modal-card">
                <h3>{{ title }}</h3>
                <p>{{ message }}</p>
                <div class="modal-actions">
                    <button class="cancel" @click="onCancel">Cancel</button>
                    <button class="confirm" @click="onConfirm">Confirm</button>
                </div>
            </div>
        </div>
    </transition>
</template>

<script setup>
defineProps({
    isOpen: Boolean,
    title: String,
    message: String,
    onConfirm: Function,
    onCancel: Function,
})
</script>

<style scoped>
.modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.45);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
}

.modal-card {
    background: white;
    border-radius: 12px;
    padding: 20px 28px;
    width: 360px;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
    text-align: center;
}

.modal-actions {
    margin-top: 20px;
    display: flex;
    justify-content: center;
    gap: 12px;
}

button {
    padding: 6px 14px;
    border-radius: 6px;
    cursor: pointer;
    font-size: 14px;
}

.cancel {
    background: #eee;
}

.confirm {
    background: #f44336;
    color: white;
}
</style>
