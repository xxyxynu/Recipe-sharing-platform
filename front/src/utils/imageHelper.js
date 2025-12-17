// Helper function to get image URL
export const getImageUrl = (imagePath) => {
    if (!imagePath) return '/src/assets/meal1.jpg'
    
    // If it's already a full URL, return as is
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
        return imagePath
    }
    
    // If it starts with /uploads, it's a backend image - use API base URL
    if (imagePath.startsWith('/uploads')) {
        const apiBaseURL = import.meta.env.VITE_API_URL || 'http://172.20.10.3:5001'
        return `${apiBaseURL}${imagePath}`
    }
    
    // If it starts with /, return as is (for assets in public folder)
    if (imagePath.startsWith('/')) {
        return imagePath
    }
    
    // Otherwise, assume it's a relative path from assets
    return imagePath.startsWith('/src/assets') ? imagePath : `/src/assets${imagePath}`
}
