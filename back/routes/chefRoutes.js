const express = require('express');
const {
    getAllChefs,
    getChefProfile,
    followChef,
    unfollowChef,
    getFollowing,
    isFollowing,
    getChefsByRecipe
} = require('../controllers/chefControllers');
const validateTokenHandler = require('../middleware/validateTokenHandler');

const router = express.Router();

// Protected routes (require authentication) - must come before /:chefId
router.get('/following/list', validateTokenHandler, getFollowing);
router.get('/following', validateTokenHandler, getFollowing); // Alias for backward compatibility
router.get('/following/check/:chefId', validateTokenHandler, isFollowing);
router.post('/:chefId/follow', validateTokenHandler, followChef);
router.delete('/:chefId/follow', validateTokenHandler, unfollowChef);

// Public routes
router.get('/', getAllChefs);
router.get('/by-recipe/:recipeId', getChefsByRecipe);
router.get('/:chefId', getChefProfile);

module.exports = router;

