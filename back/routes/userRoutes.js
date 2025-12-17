const express = require('express');
const { register, login, currentUser, refreshToken, logout, updateName, addFavorite, removeFavorite, getFavorites, getMyRecipes, getAllChefs, getChefProfile, toggleFollow } = require('../controllers/userControllers');
const validateTokenHandler = require('../middleware/validateTokenHandler');
const { upload, uploadAvatar } = require('../controllers/uploadController');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/current-user', validateTokenHandler, currentUser);
router.post('/upload-avatar', validateTokenHandler, upload.single('avatar'), uploadAvatar);
router.get('/refresh-token', refreshToken);
router.post('/logout', logout);
router.patch('/update-username', validateTokenHandler, updateName);
router.post('/favorites/:recipeId', validateTokenHandler, addFavorite)
router.delete('/favorites/:recipeId', validateTokenHandler, removeFavorite)
router.get('/favorites', validateTokenHandler, getFavorites)
router.get('/my-recipes', validateTokenHandler, getMyRecipes);
router.get('/chefs', getAllChefs); // 获取列表
router.get('/chef/:id', getChefProfile); // 获取特定详情
router.post('/follow/:id', validateTokenHandler, toggleFollow); // 关注

module.exports = router;