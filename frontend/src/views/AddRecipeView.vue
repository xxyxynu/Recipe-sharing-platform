<template>
    <div v-if="!user || !user.token" class="not-logged-in">
        <p>Please log in first to create your recipe.</p>
        <button @click="goLogin">Go to Login</button>
    </div>
    <div class="add-page">
        <h2>Add a New Recipe 🍳</h2>

        <form @submit.prevent="handleSubmit" class="form">
            <!-- Left column -->
            <div class="grid">
                <div class="field">
                    <label>Title *</label>
                    <input v-model="title" type="text" placeholder="Recipe title" required />
                </div>

                <div class="field">
                    <label>Category</label>
                    <select v-model="category">
                        <option v-for="c in categoriesList" :key="c.name" :value="c.name">
                            {{ c.label }}
                        </option>
                    </select>
                </div>

                <div class="field">
                    <label>Tags (press Enter or comma)</label>
                    <div class="tags-input" @click="focusTagInput">
                        <span v-for="(t, idx) in tags" :key="t" class="tag">
                            {{ t }} <button type="button" class="remove-tag" @click="removeTag(idx)">×</button>
                        </span>
                        <input ref="tagInput" v-model="tagInputText" @keydown.enter.prevent="addTagFromInput"
                            @keydown="handleTagKeydown" @blur="addTagFromInput"
                            placeholder="Add a tag and press Enter" />
                    </div>
                </div>

                <div class="field">
                    <label>Prep Time (minutes)</label>
                    <input v-model.number="prepTime" type="number" min="0" />
                </div>

                <div class="field">
                    <label>Cook Time (minutes)</label>
                    <input v-model.number="cookTime" type="number" min="0" />
                </div>

                <div class="field">
                    <label>Servings</label>
                    <input v-model.number="servings" type="number" min="1" />
                </div>

                <div class="field">
                    <label>Calories (kcal)</label>
                    <input v-model.number="calories" type="number" min="0" />
                </div>

                <!-- Nutrition block (textarea + single-input quick add) -->
                <div class="field">
                    <label>Nutrition *</label>
                    <div class="nutrient-quick">
                        <input ref="nutrientInput" v-model="nutrientInputText"
                            @keydown.enter.prevent="addNutrientFromInput" @keydown="handleNutrientKeydown"
                            placeholder="Type e.g. Protein: 10g and press Enter" />
                        <button type="button" @click="addNutrientFromInput">＋</button>
                    </div>
                    <div class="nutrient-list">
                        <span v-for="(n, i) in nutritionItems" :key="i" class="nutrient-tag">
                            {{ n }} <button type="button" class="remove-tag" @click="removeNutrient(i)">×</button>
                        </span>
                    </div>
                </div>

                <div class="field file-field">
                    <label>Image *</label>
                    <input type="file" accept="image/*" @change="onFileChange" />
                    <div v-if="previewUrl" class="preview">
                        <img :src="previewUrl" alt="preview" />
                        <button type="button" @click="clearImage">Remove</button>
                    </div>
                </div>
            </div>

            <!-- Full-width fields -->
            <div class="field full">
                <label>Description *</label>
                <textarea v-model="description" placeholder="Short description" rows="3" required />
            </div>

            <div class="field full">
                <label>Ingredients *</label>
                <textarea v-model="ingredients" placeholder="List ingredients — plain text." rows="4" required />
                <small class="hint">One ingredient per line or comma separated.</small>
            </div>

            <div class="field full">
                <label>Instructions *</label>
                <textarea v-model="instructions" placeholder="Step-by-step instructions (one step per line). " rows="6"
                    required />
            </div>

            <div class="actions">
                <button type="submit" :disabled="loading || !user?.token">
                    {{ !user?.token ? 'Please log in first' : (loading ? 'Submitting...' : 'Create Recipe') }}
                </button>

                <button type="button" class="cancel" @click="resetForm" :disabled="loading">Reset</button>
            </div>

            <p v-if="error" class="error">{{ error }}</p>
        </form>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { createRecipeAPI } from '@/api/recipe' // 确认路径
import { useUserStore } from '@/stores/userStore'

const userStore = useUserStore()

const user = computed(() => userStore.userInfo)

const categoriesList = [
    { name: 'All Types', label: 'All Types' },
    { name: 'Appetizers', label: 'Appetizers' },
    { name: 'Main Courses', label: 'Main Courses' },
    { name: 'Salads & Sides', label: 'Salads & Sides' },
    { name: 'Vegetarian Delights', label: 'Vegetarian Delights' },
    { name: 'International Flavors', label: 'International Flavors' },
    { name: 'Desserts & Sweets', label: 'Desserts & Sweets' },
    { name: 'Healthy Eats', label: 'Healthy Eats' },
    { name: 'Quick & Easy Supper', label: 'Quick & Easy Supper' }
]

// form state
const title = ref('')
const description = ref('')
const ingredients = ref('')
const instructions = ref('')
const nutritionItems = ref([])
const nutrientInputText = ref('')
const tags = ref([])
const tagInputText = ref('')
const category = ref(categoriesList[0].name)
const prepTime = ref(0)
const cookTime = ref(0)
const servings = ref(1)
const calories = ref(0)
const imageFile = ref(null)
const previewUrl = ref(null)

const loading = ref(false)
const error = ref('')

const router = useRouter()

// tag helpers
const tagInput = ref(null)
const focusTagInput = () => tagInput.value?.focus()
const addTagFromInput = () => {
    const v = (tagInputText.value || '').trim()
    if (!v) { tagInputText.value = ''; return }
    const parts = v.split(',').map(p => p.trim()).filter(Boolean)
    for (const p of parts) {
        if (p && !tags.value.includes(p)) tags.value.push(p)
    }
    tagInputText.value = ''
}
const removeTag = (idx) => tags.value.splice(idx, 1)
const handleTagKeydown = (e) => {
    if (e.key === ',') {
        e.preventDefault()
        addTagFromInput()
    }
}

const nutrientInput = ref(null)
const addNutrientFromInput = () => {
    const v = (nutrientInputText.value || '').trim()
    if (!v) { nutrientInputText.value = ''; return }
    const parts = v.split(',').map(p => p.trim()).filter(Boolean)
    for (const p of parts) {
        if (p && !nutritionItems.value.includes(p)) nutritionItems.value.push(p)
    }
    nutrientInputText.value = ''
}
const removeNutrient = (idx) => nutritionItems.value.splice(idx, 1)
const handleNutrientKeydown = (e) => {
    if (e.key === ',') {
        e.preventDefault()
        addNutrientFromInput()
    }
}


// image
const onFileChange = (e) => {
    const file = e.target.files && e.target.files[0]
    if (!file) return
    imageFile.value = file
    const reader = new FileReader()
    reader.onload = (ev) => previewUrl.value = ev.target.result
    reader.readAsDataURL(file)
}
const clearImage = () => {
    imageFile.value = null
    previewUrl.value = null
    const inputs = document.querySelectorAll('input[type="file"]')
    inputs.forEach(i => i.value = '')
}

// submit
const handleSubmit = async () => {
    error.value = ''
    if (!title.value.trim() || !description.value.trim() || !ingredients.value.trim() || !instructions.value.trim()) {
        error.value = 'Please fill required fields (title, description, ingredients, instructions).'
        return
    }

    const nutritionFinal = nutritionItems.value.join('\n')


    // build FormData
    const fd = new FormData()
    fd.append('title', title.value.trim())
    fd.append('description', description.value.trim())
    fd.append('ingredients', ingredients.value)      // string
    fd.append('instructions', instructions.value)    // string
    if (tags.value.length) fd.append('tags', JSON.stringify(tags.value))
    if (category.value) fd.append('category', category.value)
    if (prepTime.value) fd.append('prepTime', String(prepTime.value))
    if (cookTime.value) fd.append('cookTime', String(cookTime.value))
    if (servings.value) fd.append('servings', String(servings.value))
    if (calories.value) fd.append('calories', String(calories.value))
    if (nutritionFinal) fd.append('nutrition', nutritionFinal) // string
    if (imageFile.value) fd.append('image', imageFile.value)

    loading.value = true
    try {
        const res = await createRecipeAPI(fd)
        console.log('Recipe created:', res)
        console.log(res._id)
        const id = res._id
        if (id) {
            router.push(`/recipe/${id}`)
        } else {
            router.push('/profile')
        }
    } catch (err) {
        console.error(err)
        error.value = err.response?.data?.message || err.message || 'Failed to create recipe'
    } finally {
        loading.value = false
    }
}

// reset
const resetForm = () => {
    title.value = ''
    description.value = ''
    ingredients.value = ''
    instructions.value = ''
    nutritionItems.value = []
    tags.value = []
    tagInputText.value = ''
    nutrientInputText.value = ''
    category.value = categoriesList[0].name
    prepTime.value = 0
    cookTime.value = 0
    servings.value = 1
    calories.value = 0
    imageFile.value = null
    previewUrl.value = null
    error.value = ''
}

const goLogin = () => {
    router.push('/login')
}
</script>

<style scoped>
.add-page {
    max-width: 900px;
    margin: 24px auto;
    padding: 18px;
    background: #fff;
    border-radius: 10px;
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.06);
    font-family: Inter, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial;
}

h2 {
    margin-bottom: 16px;
}

.form {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
}

.field {
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.field.full {
    grid-column: 1 / -1;
}

/* tags */
.tags-input {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
    padding: 8px;
    border-radius: 6px;
    border: 1px solid #ddd;
}

.tags-input input {
    border: none;
    outline: none;
    min-width: 120px;
    padding: 6px;
}

.tag {
    background: #f3f3f3;
    padding: 4px 8px;
    border-radius: 999px;
    display: inline-flex;
    align-items: center;
    gap: 6px;
}

.remove-tag {
    background: transparent;
    border: none;
    cursor: pointer;
}

/* nutrient inputs */
.nutrient-quick {
    display: flex;
    gap: 8px;
    margin-top: 6px;
}

.nutrient-quick input {
    flex: 1;
    padding: 6px;
    border-radius: 6px;
    border: 1px solid #ddd;
}

.nutrient-quick button {
    padding: 6px 10px;
    border-radius: 6px;
    border: none;
    background: #eee;
    cursor: pointer;
}

.nutrient-list {
    margin-top: 8px;
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
}

.nutrient-tag {
    background: #eef7ff;
    padding: 4px 8px;
    border-radius: 6px;
    display: inline-flex;
    align-items: center;
    gap: 6px;
}

/* file preview */
.file-field input[type="file"] {
    padding: 6px 0;
}

.preview {
    margin-top: 8px;
    display: flex;
    gap: 8px;
    align-items: center;
}

.preview img {
    width: 100px;
    height: 70px;
    object-fit: cover;
    border-radius: 6px;
}

/* actions */
.actions {
    display: flex;
    gap: 12px;
    margin-top: 8px;
}

button {
    padding: 10px 14px;
    border-radius: 8px;
    border: none;
    cursor: pointer;
}

button[type="submit"] {
    background: #ff7f50;
    color: white;
}

button.cancel {
    background: transparent;
    border: 1px solid #ddd;
}

/* hint / error */
.hint {
    color: #666;
    font-size: 12px;
}

.error {
    color: #c62828;
    margin-top: 8px;
    font-weight: 500;
}

.not-logged-in {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100px;
    font-size: 16px;
    gap: 12px;
}

.not-logged-in button {
    padding: 8px 16px;
    border: none;
    border-radius: 6px;
    background-color: var(--btn-color);
    color: white;
    cursor: pointer;
}

/* responsive */
@media (max-width:720px) {
    .grid {
        grid-template-columns: 1fr;
    }

    .preview img {
        width: 80px;
        height: 60px;
    }
}
</style>
