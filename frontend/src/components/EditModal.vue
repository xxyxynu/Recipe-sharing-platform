<template>
    <transition name="fade">
        <div v-if="isOpen" class="modal-overlay" @click.self="$emit('cancel')">
            <div class="modal-card">
                <h3 class="modal-title">{{ title }}</h3>

                <form @submit.prevent="submitForm" class="form">
                    <label>Title:</label>
                    <input v-model="form.title" type="text" placeholder="Enter recipe title" required />

                    <label>Description:</label>
                    <textarea v-model="form.description" placeholder="Enter description" required></textarea>

                    <label>Image:</label>
                    <input type="file" @change="handleFile" />

                    <div class="modal-actions">
                        <button type="button" class="cancel" @click="$emit('cancel')">Cancel</button>
                        <button type="submit" class="confirm">Save</button>
                    </div>
                </form>
            </div>
        </div>
    </transition>
</template>

<script setup>
import { reactive, watch } from 'vue'

const props = defineProps({
    isOpen: Boolean,
    title: String,
    defaultData: Object,
})

const emit = defineEmits(['confirm', 'cancel'])

const form = reactive({
    title: '',
    description: '',
    image: null,
})

watch(
    () => props.defaultData,
    (val) => {
        if (val) {
            form.title = val.title || ''
            form.description = val.description || ''
        }
    },
    { immediate: true }
)

const handleFile = (e) => {
    form.image = e.target.files[0]
}

const submitForm = () => {
    emit('confirm', form)
}
</script>

<style scoped>
.modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.4);
    backdrop-filter: blur(3px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
    padding: 12px;
}

.modal-card {
    background: #fff;
    border-radius: 16px;
    padding: 28px 32px;
    width: 100%;
    max-width: 450px;
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.18);
    transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.modal-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 16px 40px rgba(0, 0, 0, 0.25);
}

.modal-title {
    margin-bottom: 20px;
    font-size: 20px;
    font-weight: 600;
    text-align: center;
}

.form {
    display: flex;
    flex-direction: column;
    gap: 14px;
}

input,
textarea {
    width: 100%;
    padding: 10px 12px;
    border-radius: 8px;
    border: 1px solid #ccc;
    transition: border 0.2s ease, box-shadow 0.2s ease;
}

input:focus,
textarea:focus {
    outline: none;
    border-color: #1976d2;
    box-shadow: 0 0 4px #1976d2;
}

textarea {
    min-height: 100px;
    resize: vertical;
}

.modal-actions {
    margin-top: 18px;
    display: flex;
    justify-content: flex-end;
    gap: 12px;
}

.cancel {
    padding: 8px 18px;
    border: none;
    border-radius: 8px;
    background: #f2f2f2;
    color: #555;
    cursor: pointer;
    transition: background 0.2s ease;
}

.cancel:hover {
    background: #e0e0e0;
}

.confirm {
    padding: 8px 18px;
    border: none;
    border-radius: 8px;
    background: #1976d2;
    color: white;
    cursor: pointer;
    font-weight: 500;
    transition: background 0.2s ease, transform 0.1s ease;
}

.confirm:hover {
    background: #155fa0;
    transform: translateY(-1px);
}

/* fade 动画 */
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.25s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
