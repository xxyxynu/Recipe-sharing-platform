const asyncHandler = require('express-async-handler');
const Recipe = require('../models/recipeModel');
const Review = require('../models/reviewModel');
const User = require('../models/userModel');

const createRecipe = asyncHandler(async (req, res) => {
    const {
        title, description, ingredients, nutrition, tags, category,
        prepTime, cookTime, servings, calories, instructions
    } = req.body;

    const image = req.file ? req.file.path : null; // Cloudinary 会直接返回 https://...

    if (!title || !description || !ingredients) {
        res.status(400);
        throw new Error('Title, description and ingredients are required');
    }

    const recipe = await Recipe.create({
        author: req.user.id,
        title,
        description,
        ingredients: Array.isArray(ingredients) ? ingredients : ingredients.split('\n'),
        nutrition: Array.isArray(nutrition) ? nutrition : (nutrition?.split('\n') || []),
        tags: Array.isArray(tags) ? tags : JSON.parse(tags || '[]'),
        category,
        prepTime,
        cookTime,
        servings,
        calories,
        instructions: Array.isArray(instructions) ? instructions : instructions.split('\n'),
        image
    });

    res.status(201).json(recipe);
});

const getRecipe = asyncHandler(async (req, res) => {
    const recipe = await Recipe.findById(req.params.id)
        .populate('author', 'username avatar')
        .populate({
            path: 'reviews',
            populate: { path: 'user', select: 'username avatar' }
        });

    if (!recipe) {
        res.status(404);
        throw new Error('Recipe not found');
    }

    recipe.views += 1;
    await recipe.save();

    res.status(200).json(recipe);
});

// 获取所有 recipes（可分页，可搜索）
const getAllRecipes = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 20; // 默认20条
    const search = req.query.search || '';
    const category = req.query.category;
    const author = req.query.author;
    const sort = req.query.sort || 'latest'; // 👈 1. 获取 sort 参数 (默认 latest)

    let query = {};

    if (search) {
        query.$text = { $search: search };
    }

    if (author) {
        query.author = author;
    }

    if (category && category !== 'All') {
        query.category = category;
    }

    // 👈 2. 定义排序规则
    let sortOption = { createdAt: -1 }; // 默认：最新发布
    if (sort === 'popular') {
        sortOption = { views: -1, favorites: -1 }; // 热门：按浏览量和收藏降序
    }

    const total = await Recipe.countDocuments(query);

    const recipes = await Recipe.find(query)
        .sort(sortOption) // 👈 3. 应用排序
        .skip((page - 1) * pageSize)
        .limit(pageSize)
        .populate('author', 'username avatar');

    res.status(200).json({
        total,
        page,
        pageSize,
        recipes
    });
});

const getLatestRecipes = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;

    const total = await Recipe.countDocuments();
    const recipes = await Recipe.find()
        .sort({ createdAt: -1 })
        .skip((page - 1) * pageSize)
        .limit(pageSize)
        .populate('author', 'username avatar');

    res.status(200).json({
        total,
        page,
        pageSize,
        recipes
    });
});

const getPopularRecipes = asyncHandler(async (req, res) => {
    const limit = parseInt(req.query.limit) || 10;

    const recipes = await Recipe.find()
        .sort({ views: -1 })
        .limit(limit)
        .populate('author', 'username avatar');

    res.status(200).json(recipes);
});

const updateRecipe = asyncHandler(async (req, res) => {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
        res.status(404);
        throw new Error('Recipe not found');
    }

    if (recipe.author.toString() !== req.user.id.toString()) {
        res.status(403);
        throw new Error('Not authorized to update this recipe');
    }

    // 🔹 从 form-data 里取文本字段
    const { title, description } = req.body;
    if (title) recipe.title = title;
    if (description) recipe.description = description;

    // 🔹 处理图片文件
    if (req.file) {
        recipe.image = req.file.path
    }

    await recipe.save();

    res.status(200).json({ message: 'Recipe updated successfully', recipe });
});

const deleteRecipe = asyncHandler(async (req, res) => {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
        res.status(404);
        throw new Error('Recipe not found');
    }

    if (recipe.author.toString() !== req.user.id.toString()) {
        res.status(403);
        throw new Error('Not authorized to delete this recipe');
    }

    await Recipe.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Recipe removed' });
});

// 收藏/取消收藏 (双向更新)
const toggleFavorite = asyncHandler(async (req, res) => {
    const recipeId = req.params.id;
    const userId = req.user.id;

    // 1. 同时查询 Recipe 和 User
    const recipe = await Recipe.findById(recipeId);
    const user = await User.findById(userId);

    if (!recipe) {
        res.status(404);
        throw new Error('Recipe not found');
    }

    // 2. 检查 User 的收藏列表里有没有这个菜谱 (作为判断依据)
    // 使用 some + toString() 确保 ID 类型匹配 (String vs ObjectId)
    const isFavorited = user.favoriteRecipes.some(id => id.toString() === recipeId);

    if (isFavorited) {
        // --- 取消收藏 ---
        // 1. 从 User 的 favoriteRecipes 中移除
        user.favoriteRecipes = user.favoriteRecipes.filter(id => id.toString() !== recipeId);
        // 2. 从 Recipe 的 favorites 中移除当前用户
        recipe.favorites = recipe.favorites.filter(id => id.toString() !== userId);

        await user.save();
        await recipe.save();

        res.status(200).json({ message: 'Removed from favorites', isFavorited: false });
    } else {
        // --- 添加收藏 ---
        // 1. 推入 User
        user.favoriteRecipes.push(recipeId);
        // 2. 推入 Recipe
        recipe.favorites.push(userId);

        await user.save();
        await recipe.save();

        res.status(200).json({ message: 'Added to favorites', isFavorited: true });
    }
});

const createReview = asyncHandler(async (req, res) => {
    const { rating, comment } = req.body;
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
        res.status(404);
        throw new Error('Recipe not found');
    }

    // 检查用户是否已经评论过
    const alreadyReviewed = await Review.findOne({
        user: req.user.id,
        recipe: req.params.id
    });

    if (alreadyReviewed) {
        res.status(400);
        throw new Error('You have already reviewed this recipe');
    }

    // 创建评论
    const review = await Review.create({
        user: req.user.id,
        recipe: req.params.id,
        rating: Number(rating),
        comment
    });

    // 将评论 ID 推入 Recipe 的 reviews 数组
    recipe.reviews.push(review._id);
    await recipe.save();

    res.status(201).json({ message: 'Review added', review });
});

module.exports = {
    createRecipe,
    getRecipe,
    getLatestRecipes,
    getPopularRecipes,
    updateRecipe,
    deleteRecipe,
    toggleFavorite,
    getAllRecipes,
    createReview
};
