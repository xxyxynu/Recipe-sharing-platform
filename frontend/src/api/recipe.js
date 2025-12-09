import http from '@/utils/http'

export const createRecipeAPI = (formData) => {
    return http.post('/recipes', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
}

export const getRecipeAPI = (id) => {
    return http.get(`/recipes/${id}`)
}

export const getLatestRecipesAPI = (page = 1, pageSize = 10) => {
    return http.get(`/recipes/latest?page=${page}&pageSize=${pageSize}`)
}

export const getPopularRecipesAPI = (limit = 10) => {
    return http.get(`/recipes/popular?limit=${limit}`)
}

export const updateRecipeAPI = (id, data) => {
    return http.put(`/recipes/${id}`, data)
}

export const deleteRecipeAPI = (id) => {
    return http.delete(`/recipes/${id}`)
}

export const toggleFavoriteAPI = (id) => {
    return http.post(`/recipes/${id}/favorite`)
}

export const getAllRecipesAPI = (page = 1, pageSize = 20, search = '') => {
    return http.get(`/recipes/all?page=${page}&pageSize=${pageSize}&search=${encodeURIComponent(search)}`)
}
