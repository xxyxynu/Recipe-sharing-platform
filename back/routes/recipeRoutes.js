const express = require('express');
const router = express.Router();
const validateTokenHandler = require('../middleware/validateTokenHandler');
const {
    createRecipe,
    getRecipe,
    getLatestRecipes,
    getPopularRecipes,
    updateRecipe,
    deleteRecipe,
    toggleFavorite,
    getAllRecipes,
    createReview
} = require('../controllers/recipeControllers');
const uploadRecipeImage = require('../controllers/recipeImageUploadController');

router.get('/all', getAllRecipes);
router.get('/latest', getLatestRecipes);
router.get('/popular', getPopularRecipes);
router.get('/:id', getRecipe);

router.post(
    '/',
    validateTokenHandler,
    uploadRecipeImage.single('image'), // 接收 image 字段
    createRecipe);
router.put('/:id', validateTokenHandler, uploadRecipeImage.single('image'), updateRecipe);
router.delete('/:id', validateTokenHandler, deleteRecipe);
router.post('/:id/favorite', validateTokenHandler, toggleFavorite);
router.post('/:id/reviews', validateTokenHandler, createReview);

module.exports = router;
