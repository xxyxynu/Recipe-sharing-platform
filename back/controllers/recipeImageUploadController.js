const multer = require('multer');
const { recipeStorage } = require('../config/cloudinary'); // 引入刚才写的配置

// 直接使用 Cloudinary storage，不需要 diskStorage 了
const uploadRecipeImage = multer({ storage: recipeStorage });

module.exports = uploadRecipeImage;