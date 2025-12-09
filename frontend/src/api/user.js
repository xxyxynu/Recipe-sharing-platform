import http from '@/utils/http'

export const registerAPI = (data) => {
    return http.post('/users/register', data)
}

export const loginAPI = (data) => {
    return http.post('/users/login', data)
}

export const logoutAPI = () => {
    return http.post('/users/logout')
}

export const updateNameAPI = (username) => {
    return http.patch('/users/update-username', { username })
}

export const addFavoriteAPI = (recipeId) => {
    return http.post(`/users/favorites/${recipeId}`)
}

export const removeFavoriteAPI = (recipeId) => {
    return http.delete(`/users/favorites/${recipeId}`)
}

export const getFavoritesAPI = () => {
    return http.get('/users/favorites')
}

export const getMyRecipesAPI = () => {
    return http.get('/users/my-recipes')
}

export const uploadAvatarAPI = (file) => {
    const formData = new FormData()
    formData.append('avatar', file)
    return http.post('/users/upload-avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    })
}
