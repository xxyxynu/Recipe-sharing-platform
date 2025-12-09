// composables/useModal.js
import { ref } from 'vue'

const isOpen = ref(false)
const mode = ref('base') // base / edit
const modalTitle = ref('')
const modalMessage = ref('')
const resolveFn = ref(null)
const tempData = ref(null)

export function useModal() {
    const openModal = (title, message) => {
        mode.value = 'base'
        modalTitle.value = title
        modalMessage.value = message
        isOpen.value = true
        return new Promise((resolve) => {
            resolveFn.value = resolve
        })
    }

    const openEditModal = (title, recipe) => {
        mode.value = 'edit'
        modalTitle.value = title
        tempData.value = recipe
        isOpen.value = true
        return new Promise((resolve) => {
            resolveFn.value = resolve
        })
    }

    const confirm = (data = null) => {
        resolveFn.value?.(data || true)
        closeModal()
    }

    const cancel = () => {
        resolveFn.value?.(false)
        closeModal()
    }

    const closeModal = () => {
        isOpen.value = false
        modalTitle.value = ''
        modalMessage.value = ''
        tempData.value = null
        resolveFn.value = null
    }

    return {
        isOpen,
        mode,
        modalTitle,
        modalMessage,
        tempData,
        openModal,
        openEditModal,
        confirm,
        cancel
    }
}
