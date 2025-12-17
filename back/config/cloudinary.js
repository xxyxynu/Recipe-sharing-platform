// backend/config/cloudinary.js
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// 配置菜谱图片的存储
const recipeStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'recipy-app/recipes', // 在 Cloudinary 里的文件夹名
        allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
    },
});

// 配置头像的存储
const avatarStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'recipy-app/avatars',
        allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
    },
});

module.exports = {
    cloudinary,
    recipeStorage,
    avatarStorage
};